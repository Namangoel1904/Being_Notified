import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquare, Users, Music, Hash, ChevronRight, Send } from 'lucide-react';

interface ChatRoom {
  id: number;
  name: string;
  category: string;
  description: string;
  icon: string;
  member_count: number;
  is_active: boolean;
}

interface ChatMessage {
  id: number;
  message: string;
  username: string;
  user_id: number;
  created_at: string;
}

const ChatRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showLofiPlayer, setShowLofiPlayer] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchRooms();
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/chat/rooms', {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
          'user-id': user?.id?.toString() || ''
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setRooms(data.rooms);
        if (data.rooms.length > 0 && !selectedRoom) {
          setSelectedRoom(data.rooms[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/chat/rooms/${roomId}/messages`, {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
          'user-id': user?.id?.toString() || ''
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data.messages.reverse());
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !newMessage.trim()) return;

    try {
      const response = await fetch(`http://localhost:3001/api/chat/rooms/${selectedRoom.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`,
          'user-id': user?.id?.toString() || ''
        },
        body: JSON.stringify({ message: newMessage })
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(selectedRoom.id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">Chat Rooms</h1>
          <p className="text-gray-600 text-lg mb-8">Please sign in to access chat rooms.</p>
        </div>
      </div>
    );
  }

  const groupedRooms = rooms.reduce((acc, room) => {
    if (!acc[room.category]) {
      acc[room.category] = [];
    }
    acc[room.category].push(room);
    return acc;
  }, {} as Record<string, ChatRoom[]>);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-white text-lg font-semibold flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Chat Rooms
          </h2>
        </div>

        {/* Room Categories */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(groupedRooms).map(([category, categoryRooms]) => (
            <div key={category} className="mb-4">
              <div className="px-4 py-2 text-gray-400 text-sm uppercase flex items-center">
                <ChevronRight className="h-4 w-4 mr-1" />
                {category}
              </div>
              {categoryRooms.map(room => (
                <div
                  key={room.id}
                  className="px-4 py-3 hover:bg-gray-700 cursor-pointer"
                >
                  <div 
                    onClick={() => setSelectedRoom(room)}
                    className={`flex flex-col ${
                      selectedRoom?.id === room.id
                        ? 'text-white'
                        : 'text-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2">{room.icon}</span>
                        <span className="font-medium">{room.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        room.is_active 
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {room.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{room.description}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      {room.member_count} members
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Music Player Toggle */}
        <button
          onClick={() => setShowLofiPlayer(!showLofiPlayer)}
          className="p-4 bg-gray-700 text-white flex items-center hover:bg-gray-600"
        >
          <Music className="h-5 w-5 mr-2" />
          {showLofiPlayer ? 'Hide' : 'Show'} Lofi Player
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Room Header */}
        {selectedRoom && (
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Hash className="h-6 w-6 text-gray-500 mr-2" />
              <div>
                <h3 className="font-semibold text-gray-800">{selectedRoom.name}</h3>
                <p className="text-sm text-gray-500">{selectedRoom.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                {selectedRoom.member_count} members
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                selectedRoom.is_active 
                  ? 'bg-green-500/20 text-green-500'
                  : 'bg-gray-500/20 text-gray-500'
              }`}>
                {selectedRoom.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {messages.map(message => (
            <div key={message.id} className="mb-4">
              <div className="flex items-start">
                <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 font-semibold">
                  {message.username[0].toUpperCase()}
                </div>
                <div className="ml-3">
                  <div className="flex items-baseline">
                    <span className="font-semibold text-gray-800">{message.username}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      {formatTimestamp(message.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{message.message}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 bg-white border-t">
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Lofi Player */}
      {showLofiPlayer && (
        <div className="w-80 bg-gray-800 p-4 flex flex-col">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Music className="h-5 w-5 mr-2" />
            Lofi Girl Radio
          </h3>
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1"
              title="Lofi Girl Radio"
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRooms;