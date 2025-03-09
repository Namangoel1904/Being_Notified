import React from 'react';
import { Star, TrendingUp, Award } from 'lucide-react';
import Card from './Card';

interface CoinStatusProps {
  coins: number;
  level: number;
  nextLevelCoins: number;
}

const DashboardCoinStatus: React.FC<CoinStatusProps> = ({
  coins = 1950,
  level = 4,
  nextLevelCoins = 2000,
}) => {
  const progress = (coins / nextLevelCoins) * 100;

  return (
    <Card variant="primary" className="relative overflow-hidden">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-yellow-100/90">Your Progress</h3>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-300">Level {level}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
              <span className="text-2xl font-bold text-yellow-300">{coins}</span>
            </div>
            <p className="text-sm text-yellow-100/60">Total Coins</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-yellow-100/60">Progress to Level {level + 1}</span>
            <span className="text-yellow-300 font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-yellow-100/60">
            <span>{coins} coins</span>
            <span>{nextLevelCoins} coins</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-yellow-100/60">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Daily Earnings</span>
            </div>
            <p className="text-lg font-medium text-yellow-300">+150 coins</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-yellow-100/60">
              <Award className="w-4 h-4" />
              <span className="text-sm">Next Reward</span>
            </div>
            <p className="text-lg font-medium text-yellow-300">50 coins</p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4">
          <Star className="w-32 h-32 text-yellow-400/5" fill="currentColor" />
        </div>
      </div>
    </Card>
  );
};

export default DashboardCoinStatus; 