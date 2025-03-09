from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, emit, join_room, leave_room
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)
socketio = SocketIO(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(10), nullable=False)  # 'user' or 'mentor'
    degree = db.Column(db.String(100), nullable=True)
    goal = db.Column(db.String(200), nullable=True)
    password = db.Column(db.String(200), nullable=False)
    chat_rooms = db.relationship('ChatRoom', secondary='user_rooms', backref='participants')

class ChatRoom(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.String(36), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    room_number = db.Column(db.Integer, nullable=False)

    @staticmethod
    def get_next_room_number():
        last_room = ChatRoom.query.order_by(ChatRoom.room_number.desc()).first()
        return (last_room.room_number + 1) if last_room else 1

class UserRooms(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    chat_room_id = db.Column(db.Integer, db.ForeignKey('chat_room.id'))

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    room_id = db.Column(db.String(36), db.ForeignKey('chat_room.room_id'), nullable=False)
    sender_role = db.Column(db.String(10), nullable=False)  # 'user' or 'mentor'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.drop_all()  # Dropping existing tables to update schema
    db.create_all()

@app.route('/')
def home():
    return redirect(url_for('signin'))

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        role = request.form['role']
        password = request.form['password']
        
        degree = None
        goal = None
        if role == 'user':
            degree = request.form.get('degree')
            goal = request.form.get('goal')
            if not degree or not goal:
                flash('Degree and Goal are required for users!')
                return redirect(url_for('signup'))

        if User.query.filter_by(email=email).first():
            flash('Email already exists!')
            return redirect(url_for('signup'))

        hashed_password = generate_password_hash(password)
        new_user = User(name=name, email=email, role=role, degree=degree, goal=goal, password=hashed_password)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            flash('Registration successful! Please login.')
            return redirect(url_for('signin'))
        except:
            flash('An error occurred. Please try again.')
            return redirect(url_for('signup'))

    return render_template('signup.html')

@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        user = User.query.filter_by(email=email).first()
        
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            return redirect(url_for('profile'))
        
        flash('Invalid email or password!')
        return redirect(url_for('signin'))
        
    return render_template('signin.html')

@app.route('/profile')
def profile():
    if 'user_id' not in session:
        return redirect(url_for('signin'))
    
    user = User.query.get(session['user_id'])
    return render_template('profile.html', user=user)

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('signin'))

@app.route('/chat')
def chat():
    if 'user_id' not in session:
        return redirect(url_for('signin'))
    
    user = User.query.get(session['user_id'])
    if not user:
        return redirect(url_for('signin'))
    
    # For mentors, show all their active chat rooms
    if user.role == 'mentor':
        active_rooms = [room for room in user.chat_rooms if room.is_active]
        return render_template('mentor_chat.html', user=user, rooms=active_rooms)
    
    # For regular users, show available mentors and their active chat rooms
    mentors = User.query.filter_by(role='mentor').all()
    # Check if user has any active chat
    has_active_chat = any(room.is_active for room in user.chat_rooms)
    return render_template('user_chat.html', user=user, mentors=mentors, has_active_chat=has_active_chat)

@app.route('/start_chat/<int:mentor_id>')
def start_chat(mentor_id):
    if 'user_id' not in session:
        return redirect(url_for('signin'))
    
    user = User.query.get(session['user_id'])
    mentor = User.query.get(mentor_id)
    
    if not user or not mentor or mentor.role != 'mentor':
        flash('Invalid mentor selected.')
        return redirect(url_for('chat'))
    
    # Check if chat room already exists between this specific user and mentor
    existing_room = None
    for room in user.chat_rooms:
        if room in mentor.chat_rooms and room.is_active:
            # Found an active common room between this user and mentor
            existing_room = room
            break
    
    if existing_room:
        chat_room = existing_room
    else:
        # Create new chat room
        chat_room = ChatRoom(
            room_id=str(uuid.uuid4()),
            room_number=ChatRoom.get_next_room_number(),
            is_active=True
        )
        db.session.add(chat_room)
        user.chat_rooms.append(chat_room)
        mentor.chat_rooms.append(chat_room)
        db.session.commit()
    
    return redirect(url_for('chat_room', room_id=chat_room.room_id))

@app.route('/end_chat/<room_id>')
def end_chat(room_id):
    if 'user_id' not in session:
        return redirect(url_for('signin'))
    
    user = User.query.get(session['user_id'])
    chat_room = ChatRoom.query.filter_by(room_id=room_id).first()
    
    if not user or not chat_room or chat_room not in user.chat_rooms:
        flash('Invalid chat room.')
        return redirect(url_for('chat'))
    
    try:
        # Delete all messages from this chat room
        Message.query.filter_by(room_id=room_id).delete()
        
        # End the chat
        chat_room.is_active = False
        db.session.commit()
        
        # Notify all participants that the chat has ended
        emit('chat_ended', {'room': room_id}, room=room_id, namespace='/')
        
        flash('Chat ended successfully.')
    except Exception as e:
        flash('An error occurred while ending the chat.')
        db.session.rollback()
    
    return redirect(url_for('chat'))

@app.route('/chat_room/<room_id>')
def chat_room(room_id):
    if 'user_id' not in session:
        return redirect(url_for('signin'))
    
    user = User.query.get(session['user_id'])
    chat_room = ChatRoom.query.filter_by(room_id=room_id).first()
    
    if not user or not chat_room or chat_room not in user.chat_rooms:
        flash('Invalid chat room.')
        return redirect(url_for('chat'))
    
    if not chat_room.is_active:
        flash('This chat room has been ended.')
        return redirect(url_for('chat'))
    
    # Get messages for this specific room
    messages = Message.query.filter_by(room_id=room_id).order_by(Message.timestamp).all()
    return render_template('chat_room.html', user=user, room=chat_room, messages=messages)

@socketio.on('join')
def on_join(data):
    if 'user_id' not in session:
        return
    
    user = User.query.get(session['user_id'])
    room = data['room']
    
    # Verify that the user has access to this room
    chat_room = ChatRoom.query.filter_by(room_id=room).first()
    if user and chat_room and chat_room in user.chat_rooms:
        join_room(room)

@socketio.on('leave')
def on_leave(data):
    if 'user_id' not in session:
        return
    
    user = User.query.get(session['user_id'])
    room = data['room']
    
    # Verify that the user has access to this room
    chat_room = ChatRoom.query.filter_by(room_id=room).first()
    if user and chat_room and chat_room in user.chat_rooms:
        leave_room(room)

@socketio.on('message')
def handle_message(data):
    if 'user_id' not in session:
        return
    
    user = User.query.get(session['user_id'])
    room = data['room']
    
    # Verify that the user has access to this room
    chat_room = ChatRoom.query.filter_by(room_id=room).first()
    if not user or not chat_room or chat_room not in user.chat_rooms:
        return
    
    message = Message(
        content=data['message'],
        room_id=room,
        sender_role=user.role
    )
    db.session.add(message)
    db.session.commit()
    
    emit('message', {
        'message': message.content,
        'sender_role': message.sender_role,
        'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    }, room=room)

if __name__ == '__main__':
    socketio.run(app, debug=True) 