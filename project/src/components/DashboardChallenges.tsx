import React, { useState } from 'react';
import { Trophy, Star, Clock, CheckCircle } from 'lucide-react';
import Card from './Card';

interface Challenge {
  id: number;
  title: string;
  description: string;
  coins: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLeft: string;
  completed: boolean;
}

const DashboardChallenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: 1,
      title: 'Daily Meditation',
      description: 'Complete a 10-minute mindfulness session',
      coins: 50,
      difficulty: 'Easy',
      timeLeft: '12 hours',
      completed: false,
    },
    {
      id: 2,
      title: 'Study Sprint',
      description: 'Study for 2 hours without interruption',
      coins: 100,
      difficulty: 'Medium',
      timeLeft: '1 day',
      completed: false,
    },
    {
      id: 3,
      title: 'Knowledge Share',
      description: 'Help 3 peers with their doubts in the chat rooms',
      coins: 150,
      difficulty: 'Hard',
      timeLeft: '2 days',
      completed: false,
    },
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-400';
      case 'Medium':
        return 'text-yellow-400';
      case 'Hard':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const handleCompleteChallenge = (id: number) => {
    setChallenges(challenges.map(challenge => 
      challenge.id === id ? { ...challenge, completed: true } : challenge
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
          Active Challenges
        </h2>
        <div className="flex items-center space-x-2 text-yellow-300">
          <Trophy className="w-5 h-5" />
          <span className="text-sm font-medium">Earn coins by completing challenges!</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <Card
            key={challenge.id}
            className={`transform transition-all duration-300 ${
              challenge.completed ? 'opacity-75' : 'hover:scale-[1.02]'
            }`}
            variant={challenge.completed ? 'secondary' : 'primary'}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-yellow-300">
                  {challenge.title}
                </h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  <span className="text-yellow-300 font-medium">{challenge.coins}</span>
                </div>
              </div>
              
              <p className="text-white/80">{challenge.description}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className={`font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
                <div className="flex items-center space-x-1 text-white/60">
                  <Clock className="w-4 h-4" />
                  <span>{challenge.timeLeft}</span>
                </div>
              </div>
              
              <button
                onClick={() => handleCompleteChallenge(challenge.id)}
                disabled={challenge.completed}
                className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2
                  ${
                    challenge.completed
                      ? 'bg-green-500/20 text-green-300 cursor-default'
                      : 'bg-yellow-400/20 text-yellow-300 hover:bg-yellow-400/30'
                  }`}
              >
                {challenge.completed ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Completed!</span>
                  </>
                ) : (
                  'Complete Challenge'
                )}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardChallenges; 