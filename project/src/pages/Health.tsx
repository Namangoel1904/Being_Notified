import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Droplet, Moon, Bath, Trophy, Clock, Info, ExternalLink, Flower } from 'lucide-react';

interface MeditationLog {
  duration_minutes: number;
  notes: string;
  created_at: string;
}

interface HealthLog {
  sleep?: {
    hours: number;
    quality: string;
    logged: boolean;
  };
  water: {
    total: number;
    logs: { amount: number; time: string }[];
  };
  hygiene: {
    bathed: boolean;
    logged: boolean;
  };
  meditation?: {
    logs: MeditationLog[];
  };
}

const Health = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tracking' | 'resources' | 'meditation'>('tracking');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [healthLog, setHealthLog] = useState<HealthLog>({
    sleep: { hours: 7, quality: 'Good', logged: false },
    water: { total: 0, logs: [] },
    hygiene: { bathed: false, logged: false },
    meditation: { logs: [] }
  });
  const [waterAmount, setWaterAmount] = useState(200);
  
  // Meditation state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [meditationNotes, setMeditationNotes] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchDailyLogs();
    }
  }, [user?.id, date]);

  const fetchDailyLogs = async () => {
    try {
      const [sleepRes, waterRes, hygieneRes, meditationRes] = await Promise.all([
        fetch(`http://localhost:3001/api/health/sleep/${date}?userId=${user?.id}`),
        fetch(`http://localhost:3001/api/health/water/${date}?userId=${user?.id}`),
        fetch(`http://localhost:3001/api/health/hygiene/${date}?userId=${user?.id}`),
        fetch(`http://localhost:3001/api/health/meditation/${date}?userId=${user?.id}`)
      ]);

      const [sleep, water, hygiene, meditation] = await Promise.all([
        sleepRes.json(),
        waterRes.json(),
        hygieneRes.json(),
        meditationRes.json()
      ]);

      setHealthLog({
        sleep: sleep.data,
        water: water.data,
        hygiene: hygiene.data,
        meditation: {
          logs: meditation.data || []
        }
      });
    } catch (error) {
      console.error('Error fetching health logs:', error);
    }
  };

  const logSleep = async (hours: number, quality: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/health/sleep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user?.id?.toString() || ''
        },
        body: JSON.stringify({ date, hours, quality })
      });
      if (response.ok) {
        fetchDailyLogs();
      }
    } catch (error) {
      console.error('Error logging sleep:', error);
    }
  };

  const logWater = async (amount: number) => {
    try {
      const response = await fetch('http://localhost:3001/api/health/water', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user?.id?.toString() || ''
        },
        body: JSON.stringify({ date, amount })
      });
      if (response.ok) {
        fetchDailyLogs();
      }
    } catch (error) {
      console.error('Error logging water:', error);
    }
  };

  const logHygiene = async (bathed: boolean) => {
    try {
      const response = await fetch('http://localhost:3001/api/health/hygiene', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user?.id?.toString() || ''
        },
        body: JSON.stringify({ date, bathed })
      });
      if (response.ok) {
        fetchDailyLogs();
      }
    } catch (error) {
      console.error('Error logging hygiene:', error);
    }
  };

  const startMeditation = () => {
    setIsTimerRunning(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Set volume to 50%
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopMeditation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopMeditation = async () => {
    setIsTimerRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Log meditation session
    if (600 - timeLeft > 0) { // Only log if some time has passed
      try {
        const response = await fetch('http://localhost:3001/api/health/meditation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user-id': user?.id?.toString() || ''
          },
          body: JSON.stringify({
            date,
            duration_minutes: Math.ceil((600 - timeLeft) / 60),
            notes: meditationNotes
          })
        });
        if (response.ok) {
          await fetchDailyLogs();
          setMeditationNotes('');
        }
      } catch (error) {
        console.error('Error logging meditation:', error);
      }
    }
    setTimeLeft(600);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const healthResources = [
    {
      title: "Sleep Better",
      links: [
        {
          name: "Sleep Foundation - Sleep Hygiene",
          url: "https://www.sleepfoundation.org/sleep-hygiene"
        },
        {
          name: "CDC - Sleep and Sleep Disorders",
          url: "https://www.cdc.gov/sleep/index.html"
        }
      ]
    },
    {
      title: "Stay Hydrated",
      links: [
        {
          name: "Mayo Clinic - Water: How much should you drink?",
          url: "https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256"
        },
        {
          name: "Cleveland Clinic - Dehydration",
          url: "https://my.clevelandclinic.org/health/treatments/9013-dehydration"
        }
      ]
    },
    {
      title: "Fitness Resources",
      links: [
        {
          name: "NHS - Fitness Studio Exercise Videos",
          url: "https://www.nhs.uk/conditions/nhs-fitness-studio/"
        },
        {
          name: "Harvard Health - Starting to Exercise",
          url: "https://www.health.harvard.edu/staying-healthy/starting-to-exercise"
        }
      ]
    }
  ];

  const meditationResources = [
    {
      title: "Guided Meditation",
      links: [
        {
          name: "Headspace - Learn to Meditate",
          url: "https://www.headspace.com/meditation/guided-meditation"
        },
        {
          name: "Insight Timer - Free Meditation App",
          url: "https://insighttimer.com/"
        }
      ]
    },
    {
      title: "Meditation Techniques",
      links: [
        {
          name: "Mindful.org - How to Meditate",
          url: "https://www.mindful.org/how-to-meditate/"
        },
        {
          name: "Mayo Clinic - Meditation Guide",
          url: "https://www.mayoclinic.org/tests-procedures/meditation/in-depth/meditation/art-20045858"
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-indigo-600 mb-8">Health & Wellness</h1>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        {[
          { id: 'tracking', label: 'Daily Tracking', icon: Trophy },
          { id: 'meditation', label: 'Meditation', icon: Flower },
          { id: 'resources', label: 'Health Resources', icon: Info }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'tracking' && (
        <div className="space-y-6">
          {/* Date Selector */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">Daily Health Log</h2>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          {/* Sleep Tracking */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Moon className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Sleep Log</h2>
            </div>
            {!healthLog.sleep?.logged ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-gray-600">Hours Slept:</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={healthLog.sleep?.hours}
                    onChange={(e) => setHealthLog(prev => ({
                      ...prev,
                      sleep: { ...prev.sleep!, hours: parseFloat(e.target.value), quality: prev.sleep!.quality }
                    }))}
                    className="px-4 py-2 border rounded-lg w-24"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="text-gray-600">Sleep Quality:</label>
                  <select
                    value={healthLog.sleep?.quality}
                    onChange={(e) => setHealthLog(prev => ({
                      ...prev,
                      sleep: { ...prev.sleep!, quality: e.target.value }
                    }))}
                    className="px-4 py-2 border rounded-lg"
                  >
                    {['Poor', 'Fair', 'Good', 'Excellent'].map(quality => (
                      <option key={quality} value={quality}>{quality}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => logSleep(healthLog.sleep!.hours, healthLog.sleep!.quality)}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Log Sleep
                </button>
              </div>
            ) : (
              <div className="text-gray-600">
                <p>You slept for {healthLog.sleep.hours} hours</p>
                <p>Quality: {healthLog.sleep.quality}</p>
              </div>
            )}
          </div>

          {/* Water Tracking */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Droplet className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Water Intake</h2>
            </div>
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-indigo-600 h-4 rounded-full transition-all"
                  style={{ width: `${(healthLog.water.total / 4000) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>{healthLog.water.total}ml</span>
                <span>Goal: 4000ml</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="100"
                  value={waterAmount}
                  onChange={(e) => setWaterAmount(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-gray-600 w-20">{waterAmount}ml</span>
              </div>
              <button
                onClick={() => logWater(waterAmount)}
                disabled={healthLog.water.total >= 4000}
                className={`w-full py-2 rounded-lg transition-colors ${
                  healthLog.water.total >= 4000
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Add Water
              </button>
            </div>
            {healthLog.water.logs.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Today's Logs</h3>
                <div className="space-y-2">
                  {healthLog.water.logs.map((log, index) => (
                    <div key={index} className="flex justify-between text-sm text-gray-600">
                      <span>{log.amount}ml</span>
                      <span>{new Date(log.time).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hygiene Tracking */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bath className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Daily Hygiene</h2>
            </div>
            {!healthLog.hygiene.logged ? (
              <div className="space-y-4">
                <p className="text-gray-600">Did you take a bath today? 🚿</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => logHygiene(true)}
                    className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Yes! 😊
                  </button>
                  <button
                    onClick={() => logHygiene(false)}
                    className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Not yet 😅
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-600">
                {healthLog.hygiene.bathed ? (
                  <p className="text-green-600">You've taken a bath today! 🎉</p>
                ) : (
                  <p className="text-red-600">Don't forget to take a bath! 🚿</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'meditation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Flower className="h-6 w-6 text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Meditation Timer</h2>
            </div>

            <div className="text-center space-y-6">
              <div className="text-6xl font-bold text-indigo-600">
                {formatTime(timeLeft)}
              </div>

              <audio ref={audioRef} loop preload="auto">
                <source src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8533f28.mp3?filename=meditation-ambient-music-22165.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>

              <button
                onClick={isTimerRunning ? stopMeditation : startMeditation}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  isTimerRunning
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isTimerRunning ? 'Stop Meditation' : 'Start 10-Minute Meditation'}
              </button>

              {!isTimerRunning && (
                <div className="mt-6">
                  <textarea
                    value={meditationNotes}
                    onChange={(e) => setMeditationNotes(e.target.value)}
                    placeholder="Add notes about your meditation session..."
                    className="w-full p-4 border rounded-lg resize-none h-32"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Meditation Logs */}
          {(healthLog.meditation?.logs?.length || 0) > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Today's Meditation Sessions</h3>
              <div className="space-y-4">
                {healthLog.meditation?.logs?.map((log, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{log.duration_minutes} minutes</span>
                      <span>{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                    {log.notes && (
                      <p className="mt-2 text-gray-600">{log.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meditation Resources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Meditation Resources</h2>
            <div className="space-y-6">
              {meditationResources.map((category, index) => (
                <div key={index}>
                  <h3 className="text-lg font-medium text-gray-800 mb-3">{category.title}</h3>
                  <div className="space-y-3">
                    {category.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 hover:border-indigo-600 transition-colors group"
                      >
                        <span className="text-gray-800 group-hover:text-indigo-600">{link.name}</span>
                        <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-6">
          {healthResources.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{category.title}</h2>
              <div className="space-y-4">
                {category.links.map((link, linkIndex) => (
                  <a
                    key={linkIndex}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-600 transition-colors group"
                  >
                    <span className="text-gray-800 group-hover:text-indigo-600">{link.name}</span>
                    <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Health;