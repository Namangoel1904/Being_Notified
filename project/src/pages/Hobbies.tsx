import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Palette, Music, Camera, Gamepad, Video, Book, Star, Clock, Target, ExternalLink } from 'lucide-react';

interface Hobby {
  id: number;
  name: string;
  category: string;
  description: string;
  difficulty_level: string;
  time_commitment: string;
  required_resources: string;
  learning_path: string;
  tips: string;
  resources_url: string;
  image_url?: string;
}

interface UserHobbyPreference {
  preferred_categories: string[];
  time_available: string;
  skill_level: string;
}

const hobbyCategories = [
  { name: 'Art & Crafts', icon: Palette },
  { name: 'Music', icon: Music },
  { name: 'Photography', icon: Camera },
  { name: 'Gaming', icon: Gamepad },
  { name: 'Video Creation', icon: Video },
  { name: 'Writing', icon: Book },
  { name: 'Dance', icon: Star }
];

const timeCommitments = [
  '1-2 hours/week',
  '3-5 hours/week',
  '5-10 hours/week',
  '10+ hours/week'
];

const skillLevels = [
  'Beginner',
  'Intermediate',
  'Advanced'
];

const Hobbies = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserHobbyPreference>({
    preferred_categories: [],
    time_available: '',
    skill_level: ''
  });
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [recommendedHobbies, setRecommendedHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserPreferences();
      fetchAllHobbies();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/hobbies/preferences`, {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
          'user-id': user?.id?.toString() || ''
        }
      });
      const data = await response.json();
      
      if (response.ok && data.preferences) {
        const prefs = {
          ...data.preferences,
          preferred_categories: Array.isArray(data.preferences.preferred_categories) 
            ? data.preferences.preferred_categories 
            : []
        };
        setPreferences(prefs);
        setError(null);
        fetchRecommendedHobbies(prefs);
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      setError('Failed to fetch preferences');
    }
  };

  const fetchAllHobbies = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/hobbies');
      const data = await response.json();
      
      if (response.ok) {
        setHobbies(Array.isArray(data.hobbies) ? data.hobbies : []);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching hobbies:', error);
      setError('Failed to fetch hobbies');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedHobbies = async (prefs: UserHobbyPreference = preferences) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/hobbies/recommended`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.id}`,
            'user-id': user?.id?.toString() || ''
          },
          body: JSON.stringify(prefs)
        }
      );
      const data = await response.json();
      
      if (response.ok) {
        setRecommendedHobbies(data.hobbies);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching recommended hobbies:', error);
      setError('Failed to fetch recommended hobbies');
    }
  };

  const savePreferences = async () => {
    try {
      if (!user?.id) {
        setError('Please sign in to save preferences');
        return;
      }

      setLoading(true);
      const response = await fetch('http://localhost:3001/api/hobbies/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`,
          'user-id': user.id.toString()
        },
        body: JSON.stringify(preferences)
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage('Preferences saved successfully!');
        setError(null);
        await fetchRecommendedHobbies();
      } else {
        setError(data.error || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setPreferences(prev => {
      const categories = Array.isArray(prev.preferred_categories) 
        ? prev.preferred_categories 
        : [];
      return {
        ...prev,
        preferred_categories: categories.includes(category)
          ? categories.filter(c => c !== category)
          : [...categories, category]
      };
    });
  };

  const handlePreferenceChange = (field: keyof UserHobbyPreference, value: any) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const filterHobbiesByCategory = (category: string) => {
    if (!Array.isArray(hobbies)) return [];
    return hobbies.filter(hobby => hobby.category === category);
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-600 mb-4">Discover New Hobbies</h1>
          <p className="text-gray-600 text-lg mb-8">Please sign in to explore hobby paths and save your preferences.</p>
        </div>
      </div>
    );
  }

  const HobbyCard = ({ hobby }: { hobby: Hobby }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{hobby.name}</h3>
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm mb-2">
            {hobby.category}
          </span>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <span className="flex items-center">
              <Target className="h-4 w-4 mr-1" />
              {hobby.difficulty_level}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {hobby.time_commitment}
            </span>
          </div>
        </div>
        {hobby.image_url && (
          <img
            src={hobby.image_url}
            alt={hobby.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
        )}
      </div>
      <p className="text-gray-600 mb-4">{hobby.description}</p>
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Required Resources:</h4>
        <p className="text-gray-600">{hobby.required_resources}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Learning Path:</h4>
        <p className="text-gray-600">{hobby.learning_path}</p>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Tips:</h4>
        <p className="text-gray-600">{hobby.tips}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <a
          href={hobby.resources_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Learn More
        </a>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">Discover New Hobbies</h1>
        <p className="text-gray-600 text-lg">
          Explore curated paths for various hobbies and find your next passion
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      {/* Preferences Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Hobby Preferences</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Categories of Interest</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hobbyCategories.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => toggleCategory(name)}
                className={`flex items-center p-3 rounded-lg border ${
                  preferences.preferred_categories.includes(name)
                    ? 'bg-purple-100 border-purple-500 text-purple-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">Time Available</label>
            <select
              value={preferences.time_available}
              onChange={(e) => handlePreferenceChange('time_available', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            >
              <option value="">Select time commitment</option>
              {timeCommitments.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Skill Level</label>
            <select
              value={preferences.skill_level}
              onChange={(e) => handlePreferenceChange('skill_level', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              disabled={loading}
            >
              <option value="">Select skill level</option>
              {skillLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={savePreferences}
          disabled={loading || preferences.preferred_categories.length === 0 || !preferences.time_available || !preferences.skill_level}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⌛</span>
              Updating...
            </>
          ) : (
            'Save Preferences'
          )}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="mb-8">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {hobbyCategories.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setSelectedCategory(name)}
              className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap ${
                selectedCategory === name
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Hobbies */}
      {recommendedHobbies.length > 0 && !selectedCategory && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recommended for You</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {recommendedHobbies.map(hobby => (
              <HobbyCard key={hobby.id} hobby={hobby} />
            ))}
          </div>
        </div>
      )}

      {/* Filtered Hobbies by Category */}
      {selectedCategory && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {selectedCategory} Paths
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {filterHobbiesByCategory(selectedCategory).map(hobby => (
              <HobbyCard key={hobby.id} hobby={hobby} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Hobbies;