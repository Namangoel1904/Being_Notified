import React from 'react';
import PageHeader from '../components/PageHeader';
import DashboardChallenges from '../components/DashboardChallenges';
import DashboardLeaderboard from '../components/DashboardLeaderboard';
import DashboardCoinStatus from '../components/DashboardCoinStatus';
import { Layout, Trophy } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 p-8">
      <PageHeader
        title="Dashboard"
        description="Track your progress, complete challenges, and climb the leaderboard!"
        icon={Layout}
      />

      {/* Main grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Coin Status */}
        <div className="lg:col-span-2">
          <DashboardCoinStatus
            coins={1950}
            level={4}
            nextLevelCoins={2000}
          />
        </div>

        {/* Right column - Quick Stats */}
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 backdrop-blur-lg border border-yellow-400/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-yellow-400/20">
                <Trophy className="w-8 h-8 text-yellow-300" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-yellow-300">Weekly Rank</h3>
                <p className="text-3xl font-bold text-yellow-100">#4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Section - Full width */}
        <div className="lg:col-span-3">
          <DashboardChallenges />
        </div>

        {/* Leaderboard Section - Full width */}
        <div className="lg:col-span-3">
          <DashboardLeaderboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 