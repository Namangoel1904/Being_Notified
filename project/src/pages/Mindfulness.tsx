import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Music, Edit3, Heart, Plus, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

interface GratitudeEntry {
  id: number;
  entry_date: string;
  gratitude_1: string;
  gratitude_2: string;
  gratitude_3: string;
}

interface MoodEntry {
  id: number;
  entry_date: string;
  mood_scale: number;
  primary_emotion: string;
  secondary_emotions: string;
  factors: string;
  reflection: string;
}

const emotions = {
  'Joy': ['Happy', 'Excited', 'Delighted', 'Content', 'Proud', 'Optimistic', 'Enthusiastic'],
  'Love': ['Grateful', 'Compassionate', 'Peaceful', 'Affectionate', 'Connected', 'Trusting'],
  'Surprise': ['Amazed', 'Astonished', 'Curious', 'Inspired', 'Wonder', 'Awe'],
  'Sadness': ['Lonely', 'Disappointed', 'Discouraged', 'Hurt', 'Grief', 'Melancholy'],
  'Anger': ['Frustrated', 'Irritated', 'Annoyed', 'Resentful', 'Overwhelmed', 'Stressed'],
  'Fear': ['Anxious', 'Nervous', 'Worried', 'Insecure', 'Uncertain', 'Vulnerable'],
};

const factors = [
  'Academic Pressure',
  'Social Relationships',
  'Family Dynamics',
  'Health & Wellness',
  'Sleep Quality',
  'Physical Activity',
  'Financial Situation',
  'Future Career',
  'Personal Growth',
  'Time Management',
  'Environmental Factors',
  'Current Events'
];

const Mindfulness = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'gratitude' | 'mood'>('gratitude');
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [gratitudeForm, setGratitudeForm] = useState({
    gratitude_1: '',
    gratitude_2: '',
    gratitude_3: ''
  });

  const [moodForm, setMoodForm] = useState({
    mood_scale: 3,
    primary_emotion: '',
    secondary_emotions: [] as string[],
    factors: [] as string[],
    reflection: ''
  });

  const [selectedPrimaryEmotion, setSelectedPrimaryEmotion] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchGratitudeEntries();
      fetchMoodEntries();
    }
  }, [user]);

  const fetchGratitudeEntries = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/gratitude', {
        headers: {
          'Content-Type': 'application/json',
          'user-id': user?.id?.toString() || ''
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch gratitude entries');
      }
      
      const data = await response.json();
      setGratitudeEntries(data);
    } catch (error) {
      console.error('Error fetching gratitude entries:', error);
      toast.error('Failed to load gratitude entries');
    }
  };

  const fetchMoodEntries = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/mood', {
        headers: {
          'Content-Type': 'application/json',
          'user-id': user?.id?.toString() || ''
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch mood entries');
      }
      
      const data = await response.json();
      setMoodEntries(data);
    } catch (error) {
      console.error('Error fetching mood entries:', error);
      toast.error('Failed to load mood entries');
    }
  };

  const handleGratitudeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error('Please sign in to submit entries');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/gratitude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user.id.toString()
        },
        body: JSON.stringify(gratitudeForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save gratitude entry');
      }

      await response.json();
      toast.success('Gratitude entry saved successfully!');
      setGratitudeForm({ gratitude_1: '', gratitude_2: '', gratitude_3: '' });
      fetchGratitudeEntries();
    } catch (error: any) {
      console.error('Error saving gratitude entry:', error);
      toast.error(error.message || 'Failed to save gratitude entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error('Please sign in to submit entries');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3001/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user.id.toString()
        },
        body: JSON.stringify({
          ...moodForm,
          secondary_emotions: moodForm.secondary_emotions.join(', '),
          factors: moodForm.factors.join(', ')
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save mood entry');
      }

      await response.json();
      toast.success('Mood entry saved successfully!');
      setMoodForm({
        mood_scale: 3,
        primary_emotion: '',
        secondary_emotions: [],
        factors: [],
        reflection: ''
      });
      setSelectedPrimaryEmotion('');
      fetchMoodEntries();
    } catch (error: any) {
      console.error('Error saving mood entry:', error);
      toast.error(error.message || 'Failed to save mood entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodLabel = (scale: number) => {
    switch (scale) {
      case 1: return 'Very Unpleasant';
      case 2: return 'Slightly Unpleasant';
      case 3: return 'Neutral';
      case 4: return 'Slightly Pleasant';
      case 5: return 'Very Pleasant';
      default: return 'Neutral';
    }
  };

  if (!user?.id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h1>
        <p className="text-gray-600">You need to be signed in to access the Mindfulness Journal.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">Mindfulness Journal</h1>
      
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('gratitude')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'gratitude'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Gratitude Journal
        </button>
        <button
          onClick={() => setActiveTab('mood')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'mood'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Mood Tracker
        </button>
      </div>

      {activeTab === 'gratitude' ? (
        <div className="space-y-8">
          <form onSubmit={handleGratitudeSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Today's Gratitude</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((num) => (
                <div key={num}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I am grateful for...
                  </label>
                  <input
                    type="text"
                    value={gratitudeForm[`gratitude_${num}` as keyof typeof gratitudeForm]}
                    onChange={(e) => setGratitudeForm(prev => ({
                      ...prev,
                      [`gratitude_${num}`]: e.target.value
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter something you're grateful for"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Gratitude Entry'}
              </button>
            </div>
          </form>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Previous Entries</h2>
            <div className="space-y-4">
              {gratitudeEntries.length === 0 ? (
                <p className="text-gray-600 text-center">No entries yet. Start your gratitude journey today!</p>
              ) : (
                gratitudeEntries.map((entry) => (
                  <div key={entry.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                    <p className="text-sm text-gray-500 mb-2">{format(new Date(entry.entry_date), 'MMMM d, yyyy')}</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{entry.gratitude_1}</li>
                      <li>{entry.gratitude_2}</li>
                      <li>{entry.gratitude_3}</li>
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <form onSubmit={handleMoodSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Current State of Mind</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling? ({getMoodLabel(moodForm.mood_scale)})
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={moodForm.mood_scale}
                  onChange={(e) => setMoodForm(prev => ({ ...prev, mood_scale: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={isSubmitting}
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Very Unpleasant</span>
                  <span>Neutral</span>
                  <span>Very Pleasant</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Emotion
                </label>
                <select
                  value={selectedPrimaryEmotion}
                  onChange={(e) => {
                    setSelectedPrimaryEmotion(e.target.value);
                    setMoodForm(prev => ({
                      ...prev,
                      primary_emotion: e.target.value,
                      secondary_emotions: []
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select primary emotion</option>
                  {Object.keys(emotions).map((emotion) => (
                    <option key={emotion} value={emotion}>{emotion}</option>
                  ))}
                </select>
              </div>

              {selectedPrimaryEmotion && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Emotions
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {emotions[selectedPrimaryEmotion as keyof typeof emotions].map((emotion) => (
                      <label key={emotion} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={moodForm.secondary_emotions.includes(emotion)}
                          onChange={(e) => {
                            setMoodForm(prev => ({
                              ...prev,
                              secondary_emotions: e.target.checked
                                ? [...prev.secondary_emotions, emotion]
                                : prev.secondary_emotions.filter(em => em !== emotion)
                            }));
                          }}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                          disabled={isSubmitting}
                        />
                        <span>{emotion}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What factors are affecting you?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {factors.map((factor) => (
                    <label key={factor} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={moodForm.factors.includes(factor)}
                        onChange={(e) => {
                          setMoodForm(prev => ({
                            ...prev,
                            factors: e.target.checked
                              ? [...prev.factors, factor]
                              : prev.factors.filter(f => f !== factor)
                          }));
                        }}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                        disabled={isSubmitting}
                      />
                      <span>{factor}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reflection (Optional)
                </label>
                <textarea
                  value={moodForm.reflection}
                  onChange={(e) => setMoodForm(prev => ({ ...prev, reflection: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows={4}
                  placeholder="Add any additional thoughts or reflections..."
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Mood Entry'}
              </button>
            </div>
          </form>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Previous Entries</h2>
            <div className="space-y-4">
              {moodEntries.length === 0 ? (
                <p className="text-gray-600 text-center">No entries yet. Start tracking your mood today!</p>
              ) : (
                moodEntries.map((entry) => (
                  <div key={entry.id} className="border-l-4 border-indigo-500 pl-4 py-2">
                    <p className="text-sm text-gray-500 mb-2">{format(new Date(entry.entry_date), 'MMMM d, yyyy')}</p>
                    <p className="mb-2"><strong>Mood:</strong> {getMoodLabel(entry.mood_scale)}</p>
                    <p className="mb-2"><strong>Primary Emotion:</strong> {entry.primary_emotion}</p>
                    {entry.secondary_emotions && (
                      <p className="mb-2"><strong>Secondary Emotions:</strong> {entry.secondary_emotions}</p>
                    )}
                    {entry.factors && (
                      <p className="mb-2"><strong>Affecting Factors:</strong> {entry.factors}</p>
                    )}
                    {entry.reflection && (
                      <p className="mb-2"><strong>Reflection:</strong> {entry.reflection}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mindfulness;