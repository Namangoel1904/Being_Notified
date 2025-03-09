import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Mindfulness from '../pages/Mindfulness';
import ChatBot from '../pages/ChatBot';
import Education from '../pages/Education';
import Hobbies from '../pages/Hobbies';
import Health from '../pages/Health';
import ChatRooms from '../pages/ChatRooms';
import PeerMotivator from '../pages/PeerMotivator';
import Financial from '../pages/Financial';
import Dashboard from '../pages/Dashboard';
import { MessageSquare } from 'lucide-react';
import PageBackground from './PageBackground';

const AppLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500">
        <div className="absolute inset-0 bg-mesh-pattern opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/5 to-black/10" />
        <div className="relative">
          <Navbar />
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="glass-card p-8 backdrop-blur-lg bg-white/20">
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="*" element={<Navigate to="/signup" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navigation = [
    {
      name: 'Chat Rooms',
      href: '/chat',
      icon: MessageSquare,
      description: 'Connect with peers in topic-based chat rooms'
    }
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500">
      <div className="absolute inset-0 bg-mesh-pattern opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/5 to-black/10" />
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-300/30 rounded-full mix-blend-multiply filter blur-xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-secondary-300/30 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent-300/30 rounded-full mix-blend-multiply filter blur-xl animate-float animation-delay-4000" />
      </div>

      <div className="relative">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="glass-card p-8 backdrop-blur-lg bg-white/20 transition-all duration-300 hover:shadow-2xl hover:bg-white/30">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/mindfulness" element={<Mindfulness />} />
              <Route path="/chatbot" element={<ChatBot />} />
              <Route path="/education" element={<Education />} />
              <Route path="/hobbies" element={<Hobbies />} />
              <Route path="/health" element={<Health />} />
              <Route path="/chatrooms" element={<ChatRooms />} />
              <Route path="/peer-motivator" element={<PeerMotivator />} />
              <Route path="/financial" element={<Financial />} />
              <Route path="/signin" element={<Navigate to="/" replace />} />
              <Route path="/signup" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout; 