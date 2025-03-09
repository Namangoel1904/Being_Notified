import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { db } from './database/db';

interface User {
  id: number;
  username: string;
  password?: string;
  email: string;
  degree: string;
  goal: string;
}

interface AuthenticatedRequest extends Request {
  user?: User;
}

interface HobbyPreferences {
  preferred_categories: string;
  time_available: string;
  skill_level: string;
}

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Authentication Routes
app.post('/auth/signup', (req: Request, res: Response) => {
  const { username, password, email, degree, goal } = req.body;
  
  if (!username?.trim() || !password?.trim() || !email?.trim() || !degree?.trim() || !goal) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  if (!['academic', 'academic-plus', 'all-round'].includes(goal)) {
    return res.status(400).json({ error: 'Invalid goal selection' });
  }

  // Check if username or email already exists
  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, existingUser) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Create new user
    const query = 'INSERT INTO users (username, password, email, degree, goal) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [username, password, email, degree, goal], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create user' });
      }

      // Verify the user was created by fetching their data
      db.get('SELECT id, username, email, degree, goal FROM users WHERE id = ?', [this.lastID], (err, row) => {
        if (err || !row) {
          console.error('Error verifying new user:', err);
          return res.status(500).json({ error: 'User created but failed to verify' });
        }

        const newUser = row as User;
        res.status(201).json({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          degree: newUser.degree,
          goal: newUser.goal,
          message: 'User created successfully'
        });
      });
    });
  });
});

app.post('/auth/signin', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const query = 'SELECT id, username, password, email, degree, goal FROM users WHERE username = ?';
  db.get(query, [username], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!row) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = row as User;
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Return user data (never return the password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      ...userWithoutPassword,
      message: 'Signed in successfully'
    });
  });
});

// Protected Routes
const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  db.get('SELECT id, username, email, degree, goal FROM users WHERE id = ?', [userId], (err, row) => {
    if (err || !row) {
      return res.status(401).json({ error: 'Invalid authentication' });
    }
    req.user = row as User;
    next();
  });
};

// Gratitude endpoints
app.post('/api/gratitude', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { gratitude_1, gratitude_2, gratitude_3 } = req.body;
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!gratitude_1?.trim() || !gratitude_2?.trim() || !gratitude_3?.trim()) {
    return res.status(400).json({ error: 'Please provide three gratitude entries' });
  }

  // Check if user already has an entry for today
  const today = new Date().toISOString().split('T')[0];
  db.get(
    'SELECT id FROM gratitude_entries WHERE user_id = ? AND date(entry_date) = date(?)',
    [user_id, today],
    (err, existingEntry) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (existingEntry) {
        return res.status(409).json({ error: 'You have already made a gratitude entry today' });
      }

      // Create new gratitude entry
      db.run(
        'INSERT INTO gratitude_entries (user_id, gratitude_1, gratitude_2, gratitude_3) VALUES (?, ?, ?, ?)',
        [user_id, gratitude_1, gratitude_2, gratitude_3],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to save gratitude entry' });
          }

          res.status(201).json({
            id: this.lastID,
            user_id,
            gratitude_1,
            gratitude_2,
            gratitude_3,
            entry_date: today
          });
        }
      );
    }
  );
});

app.get('/api/gratitude', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  db.all(
    'SELECT * FROM gratitude_entries WHERE user_id = ? ORDER BY entry_date DESC LIMIT 10',
    [user_id],
    (err, entries) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch gratitude entries' });
      }
      res.json(entries);
    }
  );
});

// Mood tracking endpoints
app.post('/api/mood', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { mood_scale, primary_emotion, secondary_emotions, factors, reflection } = req.body;
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!mood_scale || !primary_emotion) {
    return res.status(400).json({ error: 'Mood scale and primary emotion are required' });
  }

  if (mood_scale < 1 || mood_scale > 5) {
    return res.status(400).json({ error: 'Mood scale must be between 1 and 5' });
  }

  db.run(
    `INSERT INTO mood_entries (
      user_id, mood_scale, primary_emotion, secondary_emotions, factors, reflection
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, mood_scale, primary_emotion, secondary_emotions, factors, reflection],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to save mood entry' });
      }

      res.status(201).json({
        id: this.lastID,
        user_id,
        mood_scale,
        primary_emotion,
        secondary_emotions,
        factors,
        reflection,
        entry_date: new Date().toISOString().split('T')[0]
      });
    }
  );
});

app.get('/api/mood', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  db.all(
    'SELECT * FROM mood_entries WHERE user_id = ? ORDER BY entry_date DESC LIMIT 10',
    [user_id],
    (err, entries) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to fetch mood entries' });
      }
      res.json(entries);
    }
  );
});

// Tasks endpoints (protected)
app.post('/api/tasks', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { title, description, due_date } = req.body;
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  db.run(
    'INSERT INTO tasks (user_id, title, description, due_date) VALUES (?, ?, ?, ?)',
    [user_id, title, description, due_date],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to create task' });
      }
      res.status(201).json({
        id: this.lastID,
        user_id,
        title,
        description,
        due_date
      });
    }
  );
});

app.get('/api/tasks', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  
  db.all('SELECT * FROM tasks WHERE user_id = ?', [user_id], (err, tasks) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }
    res.json(tasks);
  });
});

// Health tracking endpoints
app.post('/api/health/sleep', (req, res) => {
  const { date, hours, quality } = req.body;
  const userId = req.headers['user-id'];

  if (!userId || !date || !hours || !quality) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'INSERT OR REPLACE INTO sleep_logs (user_id, date, hours_slept, sleep_quality) VALUES (?, ?, ?, ?)',
    [userId, date, hours, quality],
    (err) => {
      if (err) {
        console.error('Error logging sleep:', err);
        return res.status(500).json({ error: 'Failed to log sleep' });
      }
      res.json({ success: true });
    }
  );
});

app.get('/api/health/sleep/:date', (req, res) => {
  const { date } = req.params;
  const userId = req.query.userId;

  if (!userId || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.get(
    'SELECT hours_slept as hours, sleep_quality as quality FROM sleep_logs WHERE user_id = ? AND date = ?',
    [userId, date],
    (err, row) => {
      if (err) {
        console.error('Error fetching sleep log:', err);
        return res.status(500).json({ error: 'Failed to fetch sleep log' });
      }
      res.json({
        data: row ? { ...row, logged: true } : { hours: 7, quality: 'Good', logged: false }
      });
    }
  );
});

app.post('/api/health/water', async (req, res) => {
  try {
    const { date, amount } = req.body;
    const userId = req.headers['user-id'];

    if (!userId || !date || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await db.run(
      'INSERT INTO water_intake (user_id, date, amount_ml) VALUES (?, ?, ?)',
      [userId, date, amount]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error logging water intake:', error);
    res.status(500).json({ error: 'Failed to log water intake' });
  }
});

app.get('/api/health/water/:date', (req, res) => {
  const { date } = req.params;
  const userId = req.query.userId;

  if (!userId || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  interface WaterLog {
    amount: number;
    time: string;
  }

  db.all(
    'SELECT amount_ml as amount, time_logged as time FROM water_intake WHERE user_id = ? AND date = ? ORDER BY time_logged DESC',
    [userId, date],
    (err, rows: WaterLog[]) => {
      if (err) {
        console.error('Error fetching water logs:', err);
        return res.status(500).json({ error: 'Failed to fetch water logs' });
      }

      const waterLogs = rows || [];
      const total = waterLogs.reduce((sum, log) => sum + log.amount, 0);

      res.json({
        data: {
          total,
          logs: waterLogs
        }
      });
    }
  );
});

app.post('/api/health/hygiene', (req, res) => {
  const { date, bathed } = req.body;
  const userId = req.headers['user-id'];

  if (!userId || !date || bathed === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'INSERT OR REPLACE INTO daily_hygiene (user_id, date, bathed) VALUES (?, ?, ?)',
    [userId, date, bathed],
    (err) => {
      if (err) {
        console.error('Error logging hygiene:', err);
        return res.status(500).json({ error: 'Failed to log hygiene' });
      }
      res.json({ success: true });
    }
  );
});

app.get('/api/health/hygiene/:date', (req, res) => {
  const { date } = req.params;
  const userId = req.query.userId;

  if (!userId || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.get(
    'SELECT bathed FROM daily_hygiene WHERE user_id = ? AND date = ?',
    [userId, date],
    (err, row) => {
      if (err) {
        console.error('Error fetching hygiene log:', err);
        return res.status(500).json({ error: 'Failed to fetch hygiene log' });
      }
      res.json({
        data: row ? { ...row, logged: true } : { bathed: false, logged: false }
      });
    }
  );
});

// Meditation endpoints
app.post('/api/health/meditation', (req, res) => {
  const { date, duration_minutes, notes } = req.body;
  const userId = req.headers['user-id'];

  if (!userId || !date || !duration_minutes) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    'INSERT INTO meditation_logs (user_id, date, duration_minutes, notes) VALUES (?, ?, ?, ?)',
    [userId, date, duration_minutes, notes],
    (err) => {
      if (err) {
        console.error('Error logging meditation:', err);
        return res.status(500).json({ error: 'Failed to log meditation' });
      }
      res.json({ success: true });
    }
  );
});

app.get('/api/health/meditation/:date', (req, res) => {
  const { date } = req.params;
  const userId = req.query.userId;

  if (!userId || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.all(
    'SELECT duration_minutes, notes, created_at FROM meditation_logs WHERE user_id = ? AND date = ? ORDER BY created_at DESC',
    [userId, date],
    (err, rows) => {
      if (err) {
        console.error('Error fetching meditation logs:', err);
        return res.status(500).json({ error: 'Failed to fetch meditation logs' });
      }
      res.json({ data: rows || [] });
    }
  );
});

// Education routes
app.get('/api/education/preferences', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;

  if (!user_id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  db.get(
    'SELECT current_field, preferred_domain FROM educational_preferences WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
    [user_id],
    (err, row) => {
      if (err) {
        console.error('Error fetching educational preferences:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      console.log('Fetched preferences:', row); // Debug log
      res.json({ preferences: row || null });
    }
  );
});

app.post('/api/education/preferences', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;
  const { current_field, preferred_domain } = req.body;

  if (!user_id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!current_field || !preferred_domain) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log('Saving preferences:', { user_id, current_field, preferred_domain }); // Debug log

  db.run(
    'INSERT INTO educational_preferences (user_id, current_field, preferred_domain) VALUES (?, ?, ?)',
    [user_id, current_field, preferred_domain],
    function(err) {
      if (err) {
        console.error('Error saving educational preferences:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      console.log('Preferences saved successfully'); // Debug log
      res.json({ 
        success: true,
        preferences: {
          current_field,
          preferred_domain
        }
      });
    }
  );
});

app.get('/api/education/roadmaps/trending', (req, res) => {
  db.all(
    'SELECT * FROM roadmaps WHERE is_trending = 1 ORDER BY created_at DESC',
    [],
    (err, rows) => {
      if (err) {
        console.error('Error fetching trending roadmaps:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      console.log('Fetched trending roadmaps:', rows?.length); // Debug log
      res.json({ roadmaps: rows || [] });
    }
  );
});

app.get('/api/education/roadmaps/recommended', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const user_id = req.user?.id;
  const { field, domain } = req.query;

  if (!user_id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  if (!field || !domain) {
    return res.status(400).json({ error: 'Field and domain are required' });
  }

  console.log('Fetching recommendations for:', { field, domain }); // Debug log

  db.all(
    'SELECT * FROM roadmaps WHERE category = ? OR category = ? ORDER BY created_at DESC',
    [field, domain],
    (err, rows) => {
      if (err) {
        console.error('Error fetching recommended roadmaps:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      console.log('Found recommended roadmaps:', rows?.length); // Debug log
      res.json({ roadmaps: rows || [] });
    }
  );
});

// Hobbies endpoints
app.get('/api/hobbies', async (req, res) => {
  try {
    const hobbies = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM hobbies', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
    res.json({ hobbies });
  } catch (error) {
    console.error('Error fetching hobbies:', error);
    res.status(500).json({ error: 'Failed to fetch hobbies', hobbies: [] });
  }
});

app.get('/api/hobbies/preferences', authenticateUser, async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const row = await db.get(
      'SELECT preferred_categories, time_available, skill_level FROM user_hobby_preferences WHERE user_id = ?',
      userId
    );
    
    // Handle the case where no preferences exist yet
    if (!row) {
      return res.json({
        preferences: {
          preferred_categories: [],
          time_available: '',
          skill_level: ''
        }
      });
    }

    // Parse the JSON string safely
    let preferred_categories = [];
    try {
      preferred_categories = JSON.parse(row.preferred_categories);
    } catch (e) {
      console.error('Error parsing preferred categories:', e);
    }

    res.json({
      preferences: {
        preferred_categories,
        time_available: row.time_available || '',
        skill_level: row.skill_level || ''
      }
    });
  } catch (error) {
    console.error('Error fetching hobby preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

app.post('/api/hobbies/preferences', authenticateUser, async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    const { preferred_categories, time_available, skill_level } = req.body;

    if (!Array.isArray(preferred_categories)) {
      return res.status(400).json({ error: 'Invalid preferred categories format' });
    }

    // Convert array to string for storage
    const categoriesString = JSON.stringify(preferred_categories);

    // First try to insert
    try {
      await db.run(
        'INSERT INTO user_hobby_preferences (user_id, preferred_categories, time_available, skill_level) VALUES (?, ?, ?, ?)',
        [userId, categoriesString, time_available, skill_level]
      );
    } catch (err) {
      // If insert fails, try to update
      await db.run(
        'UPDATE user_hobby_preferences SET preferred_categories = ?, time_available = ?, skill_level = ? WHERE user_id = ?',
        [categoriesString, time_available, skill_level, userId]
      );
    }

    res.json({ 
      message: 'Preferences saved successfully',
      preferences: {
        preferred_categories,
        time_available,
        skill_level
      }
    });
  } catch (error) {
    console.error('Error saving hobby preferences:', error);
    res.status(500).json({ error: 'Failed to save preferences' });
  }
});

app.post('/api/hobbies/recommended', authenticateUser, async (req, res) => {
  try {
    const { preferred_categories, time_available, skill_level } = req.body;
    
    if (!Array.isArray(preferred_categories) || preferred_categories.length === 0) {
      return res.json({ hobbies: [] });
    }
    
    const placeholders = preferred_categories.map(() => '?').join(',');
    
    // Get hobbies that match user preferences
    const hobbies = await db.all(
      `SELECT * FROM hobbies 
       WHERE category IN (${placeholders})
       AND difficulty_level = ?
       LIMIT 5`,
      [...preferred_categories, skill_level]
    );
    
    res.json({ hobbies: hobbies || [] });
  } catch (error) {
    console.error('Error fetching recommended hobbies:', error);
    res.status(500).json({ error: 'Failed to fetch recommended hobbies' });
  }
});

// Chat room endpoints
app.get('/api/chat/rooms', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const rooms = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM chat_rooms ORDER BY category, name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
    res.json({ rooms });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
});

app.get('/api/chat/rooms/:roomId/messages', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { roomId } = req.params;
    const messages = await new Promise((resolve, reject) => {
      db.all(
        `SELECT m.*, u.username, u.id as user_id 
         FROM chat_messages m 
         JOIN users u ON m.user_id = u.id 
         WHERE m.room_id = ? 
         ORDER BY m.created_at DESC 
         LIMIT 50`,
        [roomId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ error: 'Failed to fetch chat messages' });
  }
});

app.post('/api/chat/rooms/:roomId/messages', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { roomId } = req.params;
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const result = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO chat_messages (room_id, user_id, message) VALUES (?, ?, ?)',
        [roomId, userId, message],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });

    res.status(201).json({ 
      success: true,
      message: {
        id: result,
        room_id: roomId,
        user_id: userId,
        message,
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 