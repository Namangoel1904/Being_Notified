import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Book, Compass, TrendingUp, ExternalLink } from 'lucide-react';

interface Roadmap {
  id: number;
  title: string;
  category: string;
  description: string;
  url: string;
  is_trending: boolean;
}

interface UserPreference {
  current_field: string;
  preferred_domain: string;
}

const studyFields = [
  'Computer Science',
  'Information Technology',
  'Software Engineering',
  'Data Science',
  'Cybersecurity',
  'Artificial Intelligence',
  'Other'
];

const domains = [
  'Web Development',
  'Mobile Development',
  'Cloud Computing',
  'DevOps',
  'Machine Learning',
  'Blockchain',
  'UI/UX Design',
  'Game Development',
  'Data Engineering',
  'Network Security'
];

const Education = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreference>({
    current_field: '',
    preferred_domain: ''
  });
  const [trendingRoadmaps, setTrendingRoadmaps] = useState<Roadmap[]>([]);
  const [recommendedRoadmaps, setRecommendedRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserPreferences();
      fetchTrendingRoadmaps();
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
      const response = await fetch(`http://localhost:3001/api/education/preferences`, {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
          'user-id': user?.id?.toString() || ''
        }
      });
      const data = await response.json();
      
      if (response.ok && data.preferences) {
        setPreferences(data.preferences);
        setError(null);
        // Fetch recommended roadmaps if preferences exist
        if (data.preferences.current_field && data.preferences.preferred_domain) {
          fetchRecommendedRoadmaps(data.preferences);
        }
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      setError('Failed to fetch preferences');
    }
  };

  const fetchTrendingRoadmaps = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/education/roadmaps/trending');
      const data = await response.json();
      
      if (response.ok) {
        // Only show top 3 trending roadmaps
        setTrendingRoadmaps(data.roadmaps.slice(0, 3));
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching trending roadmaps:', error);
      setError('Failed to fetch trending roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedRoadmaps = async (prefs: UserPreference = preferences) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/education/roadmaps/recommended?field=${encodeURIComponent(prefs.current_field)}&domain=${encodeURIComponent(prefs.preferred_domain)}`,
        {
          headers: {
            'Authorization': `Bearer ${user?.id}`,
            'user-id': user?.id?.toString() || ''
          }
        }
      );
      const data = await response.json();
      
      if (response.ok) {
        // Show up to 5 recommended roadmaps
        setRecommendedRoadmaps(data.roadmaps.slice(0, 5));
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching recommended roadmaps:', error);
      setError('Failed to fetch recommended roadmaps');
    }
  };

  const savePreferences = async () => {
    try {
      if (!user?.id) {
        setError('Please sign in to save preferences');
        return;
      }

      setLoading(true);
      const response = await fetch('http://localhost:3001/api/education/preferences', {
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
        await fetchRecommendedRoadmaps();
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

  const handlePreferenceChange = (field: keyof UserPreference, value: string) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">Educational Roadmaps</h1>
          <p className="text-gray-600 text-lg mb-8">Please sign in to access educational roadmaps and save your preferences.</p>
        </div>
      </div>
    );
  }

  const RoadmapCard = ({ roadmap }: { roadmap: Roadmap }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{roadmap.title}</h3>
          <p className="text-gray-600 mb-4">{roadmap.description}</p>
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
            {roadmap.category}
          </span>
        </div>
        {roadmap.is_trending && (
          <span className="flex items-center text-orange-500">
            <TrendingUp className="h-5 w-5 mr-1" />
            Trending
          </span>
        )}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => window.open(roadmap.url, '_blank')}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          View Roadmap
        </button>
        <a
          href={roadmap.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Open in new tab
        </a>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">Educational Roadmaps</h1>
        <p className="text-gray-600 text-lg">
          Discover personalized learning paths and trending roadmaps in tech
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
        <div className="flex items-center space-x-2 mb-6">
          <Compass className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Your Learning Preferences</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Current Field of Study</label>
            <select
              value={preferences.current_field}
              onChange={(e) => handlePreferenceChange('current_field', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              <option value="">Select your field</option>
              {studyFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Preferred Domain</label>
            <select
              value={preferences.preferred_domain}
              onChange={(e) => handlePreferenceChange('preferred_domain', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              <option value="">Select domain</option>
              {domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={savePreferences}
          disabled={loading || !preferences.current_field || !preferences.preferred_domain}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⌛</span>
              Updating...
            </>
          ) : (
            'Update Preferences'
          )}
        </button>
      </div>

      {/* Trending Roadmaps */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-orange-500" />
            <h2 className="text-2xl font-semibold text-gray-800">Trending Roadmaps</h2>
          </div>
          <span className="text-sm text-gray-500">Top 3 trending paths</span>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading trending roadmaps...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {trendingRoadmaps.map(roadmap => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        )}
      </div>

      {/* Recommended Roadmaps */}
      {recommendedRoadmaps.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Book className="h-6 w-6 text-green-500" />
              <h2 className="text-2xl font-semibold text-gray-800">Recommended for You</h2>
            </div>
            <span className="text-sm text-gray-500">Based on your preferences</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {recommendedRoadmaps.map(roadmap => (
              <RoadmapCard key={roadmap.id} roadmap={roadmap} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;