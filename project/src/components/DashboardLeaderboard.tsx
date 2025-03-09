import React from 'react';
import { Crown, Medal, Trophy, Star } from 'lucide-react';
import Card from './Card';

interface LeaderboardEntry {
  rank: number;
  username: string;
  coins: number;
  avatar: string;
  isCurrentUser: boolean;
}

const DashboardLeaderboard: React.FC = () => {
  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      username: "MindfulMaster",
      coins: 2500,
      avatar: "😊",
      isCurrentUser: false
    },
    {
      rank: 2,
      username: "LearningPro",
      coins: 2350,
      avatar: "🚀",
      isCurrentUser: false
    },
    {
      rank: 3,
      username: "StudyBuddy",
      coins: 2200,
      avatar: "📚",
      isCurrentUser: false
    },
    {
      rank: 4,
      username: "CurrentUser",
      coins: 1950,
      avatar: "🌟",
      isCurrentUser: true
    },
    {
      rank: 5,
      username: "FocusChamp",
      coins: 1800,
      avatar: "🎯",
      isCurrentUser: false
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" fill="currentColor" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" fill="currentColor" />;
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" fill="currentColor" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-yellow-100/60">
          {rank}
        </span>;
    }
  };

  return (
    <Card className="overflow-hidden" variant="accent">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Leaderboard
          </h2>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
            <span className="text-yellow-300 font-medium">Top Achievers</span>
          </div>
        </div>

        <div className="space-y-2">
          {leaderboardData.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                entry.isCurrentUser
                  ? 'bg-yellow-400/20 ring-1 ring-yellow-400/30'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{entry.avatar}</span>
                  <span className={`font-medium ${
                    entry.isCurrentUser ? 'text-yellow-300' : 'text-white/90'
                  }`}>
                    {entry.username}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span className="font-medium text-yellow-300">
                  {entry.coins.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between items-center text-sm text-white/60">
            <span>Updated every hour</span>
            <button className="text-yellow-300 hover:text-yellow-400 transition-colors">
              View Full Rankings →
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardLeaderboard; 