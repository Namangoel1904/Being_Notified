import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/mindfulness', label: 'Mindfulness' },
    { path: '/education', label: 'Education' },
    { path: '/hobbies', label: 'Hobbies' },
    { path: '/health', label: 'Health' },
    { path: '/chatrooms', label: 'Chat Rooms' },
    { path: '/financial', label: 'Financial' },
    { path: '/chatbot', label: 'Chat Bot' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-violet-950/30 border-b border-yellow-400/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-yellow-400/10 group-hover:bg-yellow-400/20 transition-colors duration-200">
              <GraduationCap className="h-6 w-6 text-yellow-300" />
            </div>
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
              MindfulLearner
            </span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-yellow-100/80 hover:text-yellow-300 hover:bg-yellow-400/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400/20"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                    ${
                      isActive(item.path)
                        ? 'bg-yellow-400/20 text-yellow-300 shadow-glow-yellow'
                        : 'text-yellow-100/70 hover:text-yellow-300 hover:bg-yellow-400/10'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="flex items-center space-x-4 ml-4 border-l border-yellow-400/20 pl-4">
              {isAuthenticated ? (
                <>
                  <span className="text-yellow-100/90 px-3 font-medium">
                    Welcome, {user?.username}!
                  </span>
                  <Link
                    to="/dashboard"
                    className="px-3 py-2 rounded-md text-sm font-medium text-yellow-100/90 hover:text-yellow-300 hover:bg-yellow-400/10 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-medium text-violet-900 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-md hover:from-yellow-400 hover:to-yellow-600 transition-all duration-200 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="px-4 py-2 text-sm font-medium text-yellow-100/90 hover:text-yellow-300 transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-violet-900 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-md hover:from-yellow-400 hover:to-yellow-600 transition-all duration-200 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-yellow-400/20">
            <div className="flex flex-col space-y-2 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                    ${
                      isActive(item.path)
                        ? 'bg-yellow-400/20 text-yellow-300 shadow-glow-yellow'
                        : 'text-yellow-100/70 hover:text-yellow-300 hover:bg-yellow-400/10'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile auth buttons */}
              <div className="border-t border-yellow-400/20 pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 text-yellow-100/90 font-medium">
                      Welcome, {user?.username}!
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-sm font-medium text-yellow-100/90 hover:text-yellow-300 hover:bg-yellow-400/10"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full mt-2 px-3 py-2 text-sm font-medium text-violet-900 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-md hover:from-yellow-400 hover:to-yellow-600"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-sm font-medium text-yellow-100/90 hover:text-yellow-300 hover:bg-yellow-400/10"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block mt-2 px-3 py-2 text-sm font-medium text-violet-900 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-md hover:from-yellow-400 hover:to-yellow-600"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;