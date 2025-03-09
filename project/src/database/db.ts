import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we create the database in the project root directory
const DB_PATH = path.resolve(__dirname, '../../mindful_learner.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to database at:', DB_PATH);
  }
});

// Create tables if they don't exist
const initDb = () => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      degree TEXT NOT NULL,
      goal TEXT NOT NULL CHECK(goal IN ('academic', 'academic-plus', 'all-round')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      due_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS gratitude_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
      gratitude_1 TEXT NOT NULL,
      gratitude_2 TEXT NOT NULL,
      gratitude_3 TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, entry_date)
    )`,
    `CREATE TABLE IF NOT EXISTS mood_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
      mood_scale INTEGER NOT NULL CHECK(mood_scale BETWEEN 1 AND 5),
      primary_emotion TEXT NOT NULL,
      secondary_emotions TEXT,
      factors TEXT,
      reflection TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`
  ];

  tables.forEach(table => {
    db.run(table, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Table created successfully');
      }
    });
  });
};

// Health tracking tables
db.exec(`
  CREATE TABLE IF NOT EXISTS sleep_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    hours_slept REAL NOT NULL,
    sleep_quality TEXT CHECK(sleep_quality IN ('Poor', 'Fair', 'Good', 'Excellent')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS water_intake (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    amount_ml INTEGER NOT NULL CHECK(amount_ml >= 0 AND amount_ml <= 4000),
    time_logged TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS daily_hygiene (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    bathed BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS health_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    goal_type TEXT NOT NULL CHECK(goal_type IN ('sleep', 'water', 'fitness')),
    target_value TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'abandoned')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS meditation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

// Educational preferences and roadmaps table
db.exec(`
  CREATE TABLE IF NOT EXISTS educational_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    current_field TEXT NOT NULL,
    preferred_domain TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS roadmaps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    is_trending BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial trending roadmaps
db.exec(`
  INSERT OR IGNORE INTO roadmaps (title, category, description, url, is_trending)
  VALUES 
    ('Frontend Development', 'Web Development', 'Complete roadmap to becoming a frontend developer', 'https://roadmap.sh/frontend', TRUE),
    ('Backend Development', 'Web Development', 'Step by step guide to becoming a backend developer', 'https://roadmap.sh/backend', TRUE),
    ('DevOps', 'Infrastructure', 'Complete DevOps roadmap for modern software development', 'https://roadmap.sh/devops', TRUE),
    ('Computer Science', 'Computer Science', 'Essential computer science concepts and fundamentals', 'https://roadmap.sh/computer-science', TRUE),
    ('JavaScript', 'Web Development', 'Master JavaScript programming language', 'https://roadmap.sh/javascript', TRUE),
    ('React', 'Web Development', 'Learn React for building user interfaces', 'https://roadmap.sh/react', TRUE),
    ('Python', 'Software Engineering', 'Complete Python programming roadmap', 'https://roadmap.sh/python', TRUE),
    ('Java', 'Software Engineering', 'Master Java programming language', 'https://roadmap.sh/java', TRUE),
    ('Android', 'Mobile Development', 'Learn Android app development', 'https://roadmap.sh/android', TRUE),
    ('Flutter', 'Mobile Development', 'Cross-platform app development with Flutter', 'https://roadmap.sh/flutter', TRUE),
    ('Cyber Security', 'Cybersecurity', 'Comprehensive guide to cyber security', 'https://roadmap.sh/cyber-security', TRUE),
    ('AI and Machine Learning', 'Artificial Intelligence', 'Path to becoming an AI engineer', 'https://roadmap.sh/ai-data-scientist', TRUE),
    ('System Design', 'Software Engineering', 'Learn to design scalable systems', 'https://roadmap.sh/system-design', TRUE),
    ('Software Design', 'Software Engineering', 'Master software design and architecture', 'https://roadmap.sh/software-design-architecture', TRUE),
    ('QA', 'Software Engineering', 'Quality Assurance engineering path', 'https://roadmap.sh/qa', TRUE),
    ('Software Architect', 'Software Engineering', 'Path to becoming a software architect', 'https://roadmap.sh/software-architect', TRUE),
    ('Blockchain', 'Blockchain', 'Complete blockchain development guide', 'https://roadmap.sh/blockchain', TRUE),
    ('Design System', 'UI/UX Design', 'Learn to create design systems', 'https://roadmap.sh/design-system', TRUE),
    ('MongoDB', 'Database', 'Master MongoDB database', 'https://roadmap.sh/mongodb', TRUE),
    ('PostgreSQL', 'Database', 'Learn PostgreSQL database', 'https://roadmap.sh/postgresql', TRUE)
`);

// Hobbies tables
db.exec(`
  CREATE TABLE IF NOT EXISTS hobbies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty_level TEXT NOT NULL,
    time_commitment TEXT NOT NULL,
    required_resources TEXT NOT NULL,
    learning_path TEXT NOT NULL,
    tips TEXT NOT NULL,
    resources_url TEXT NOT NULL,
    image_url TEXT
  );

  DROP TABLE IF EXISTS user_hobby_preferences;
  
  CREATE TABLE IF NOT EXISTS user_hobby_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    preferred_categories TEXT NOT NULL,
    time_available TEXT NOT NULL,
    skill_level TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id)
  );
`);

// Insert initial hobbies data
db.exec(`
  INSERT OR IGNORE INTO hobbies (name, category, description, difficulty_level, time_commitment, required_resources, learning_path, tips, resources_url) VALUES
  ('Digital Art', 'Art & Crafts', 'Create stunning digital artwork using tablets and software', 'Beginner', '5-10 hours/week', 'Drawing tablet, Computer, Art software (e.g., Procreate, Photoshop)', '1. Learn basic digital tools\n2. Practice fundamental shapes\n3. Study color theory\n4. Master layers and effects\n5. Develop your style', 'Start with simple sketches, watch tutorials, join online art communities', 'https://www.ctrlpaint.com/'),
  
  ('Guitar', 'Music', 'Learn to play acoustic or electric guitar', 'Beginner', '3-5 hours/week', 'Guitar, Picks, Tuner, Basic music theory knowledge', '1. Learn basic chords\n2. Practice finger placement\n3. Study rhythm patterns\n4. Learn popular songs\n5. Explore different styles', 'Practice regularly, start with easy songs, use online tutorials', 'https://www.justinguitar.com/'),
  
  ('Portrait Photography', 'Photography', 'Capture stunning portraits with proper lighting and composition', 'Intermediate', '5-10 hours/week', 'DSLR/Mirrorless camera, Basic lighting equipment, Editing software', '1. Understand camera settings\n2. Study lighting techniques\n3. Learn composition rules\n4. Practice with models\n5. Master post-processing', 'Focus on natural light first, practice with friends, study professional portraits', 'https://www.digitalcameraworld.com/'),
  
  ('Streaming', 'Gaming', 'Start your journey as a game streamer', 'Beginner', '10+ hours/week', 'Gaming PC/Console, Microphone, Webcam, Streaming software', '1. Set up streaming equipment\n2. Learn OBS/Streamlabs\n3. Build channel identity\n4. Engage with viewers\n5. Network with other streamers', 'Be consistent with schedule, interact with chat, focus on one game initially', 'https://www.twitch.tv/creatorcamp'),
  
  ('YouTube Content Creation', 'Video Creation', 'Create engaging video content for YouTube', 'Intermediate', '10+ hours/week', 'Camera, Microphone, Editing software, Good lighting', '1. Plan content strategy\n2. Learn video production\n3. Master editing skills\n4. Optimize for SEO\n5. Build audience engagement', 'Focus on quality over quantity, study successful channels, be consistent', 'https://creatoracademy.youtube.com/'),
  
  ('Creative Writing', 'Writing', 'Develop your storytelling and writing skills', 'Beginner', '3-5 hours/week', 'Writing software/notebook, Reading materials, Grammar resources', '1. Study story structure\n2. Practice character development\n3. Learn dialogue writing\n4. Develop writing style\n5. Edit and revise', 'Read extensively, write daily, join writing communities', 'https://www.masterclass.com/writing'),
  
  ('Contemporary Dance', 'Dance', 'Learn modern dance techniques and expression', 'Intermediate', '5-10 hours/week', 'Dance space, Comfortable clothes, Mirror, Music system', '1. Learn basic positions\n2. Study movement techniques\n3. Practice choreography\n4. Develop flexibility\n5. Create own routines', 'Stretch regularly, record yourself, take online classes', 'https://www.steezy.co/'),
  
  ('Watercolor Painting', 'Art & Crafts', 'Master the delicate art of watercolor', 'Beginner', '3-5 hours/week', 'Watercolor paints, Brushes, Paper, Basic color theory knowledge', '1. Learn water control\n2. Practice basic techniques\n3. Study color mixing\n4. Master brush strokes\n5. Create compositions', 'Start with simple subjects, experiment with water ratios, use quality materials', 'https://www.artistsnetwork.com/'),
  
  ('Music Production', 'Music', 'Create and produce your own music', 'Intermediate', '10+ hours/week', 'DAW software, MIDI keyboard, Audio interface, Headphones', '1. Learn DAW basics\n2. Study music theory\n3. Practice sound design\n4. Master mixing techniques\n5. Learn arrangement', 'Start with simple beats, study professional tracks, join producer communities', 'https://www.ableton.com/learn-live/'),
  
  ('Street Photography', 'Photography', 'Capture life and culture through street photos', 'Beginner', '3-5 hours/week', 'Camera, Comfortable shoes, Basic editing software', '1. Learn camera settings\n2. Study composition\n3. Practice timing\n4. Develop observation skills\n5. Edit effectively', 'Always carry your camera, respect privacy, learn local laws', 'https://www.streetphotography.com/')
`);

// Chat rooms tables
db.exec(`
  DROP TABLE IF EXISTS chat_rooms;
  
  CREATE TABLE IF NOT EXISTS chat_rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    member_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Insert default chat rooms with member counts
  INSERT OR IGNORE INTO chat_rooms (name, category, description, icon, member_count, is_active) VALUES
    ('General Discussion', 'General', 'Chat about anything and everything', '💬', 156, TRUE),
    ('Study Group', 'Education', 'Find study partners and share resources', '📚', 89, TRUE),
    ('Movie Night', 'Entertainment', 'Join our weekly movie watching sessions', '🎬', 45, FALSE),
    ('Music Lovers', 'Entertainment', 'Share and discover new music', '🎵', 72, TRUE),
    ('Coffee Chat', 'Social', 'Casual conversations and making friends', '☕', 93, TRUE),
    ('Meditation Circle', 'Mindfulness', 'Share meditation experiences and tips', '🧘', 67, TRUE),
    ('Fitness Squad', 'Health', 'Workout tips and motivation', '💪', 84, TRUE),
    ('Book Club', 'Education', 'Discuss books and share recommendations', '📖', 58, TRUE),
    ('Tech Talk', 'Technology', 'Discuss latest tech trends and gadgets', '💻', 112, TRUE),
    ('Art Gallery', 'Creative', 'Share your artwork and get feedback', '🎨', 76, TRUE);
`);

// Initialize database
db.serialize(() => {
  // Drop any existing tables to ensure clean state
  db.run("DROP TABLE IF EXISTS notes");
  db.run("DROP TABLE IF EXISTS gratitude_entries");
  db.run("DROP TABLE IF EXISTS mood_entries");
  db.run("DROP TABLE IF EXISTS tasks");
  db.run("DROP TABLE IF EXISTS users");
  
  // Initialize tables
  initDb();
});

export { db }; 