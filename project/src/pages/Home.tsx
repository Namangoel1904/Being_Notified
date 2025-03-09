import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Book, Heart, MessageCircle, DollarSign, Sparkles, ArrowRight, Star } from 'lucide-react';
import Card from '../components/Card';

const Home: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Mindfulness',
      description: 'Develop focus and mental clarity through guided meditation and mindfulness exercises.',
      color: 'from-purple-400 to-purple-600',
      link: '/mindfulness'
    },
    {
      icon: Book,
      title: 'Education',
      description: 'Access personalized learning paths and interactive study materials.',
      color: 'from-blue-400 to-blue-600',
      link: '/education'
    },
    {
      icon: Heart,
      title: 'Health',
      description: 'Track your well-being and maintain a healthy work-life balance.',
      color: 'from-red-400 to-red-600',
      link: '/health'
    },
    {
      icon: MessageCircle,
      title: 'Chat Rooms',
      description: 'Connect with peers, share experiences, and learn together.',
      color: 'from-green-400 to-green-600',
      link: '/chatrooms'
    },
    {
      icon: DollarSign,
      title: 'Financial',
      description: 'Learn financial literacy and manage your resources effectively.',
      color: 'from-emerald-400 to-emerald-600',
      link: '/financial'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 blur-3xl opacity-20 animate-pulse" />
              <h1 className="relative text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                Welcome to MindfulLearner
              </h1>
            </div>
            <p className="text-xl text-yellow-100/80 max-w-3xl mx-auto">
              Your personal companion for mindful learning and holistic growth. Achieve your goals while maintaining balance in life.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link
                to="/signup"
                className="px-8 py-3 text-lg font-medium text-violet-900 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-xl hover:from-yellow-400 hover:to-yellow-600 transition-all duration-200 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 text-lg font-medium text-yellow-300 border border-yellow-400/20 rounded-xl hover:bg-yellow-400/10 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent mb-4">
            Explore Our Features
          </h2>
          <p className="text-yellow-100/60">
            Discover tools and resources designed to support your journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={feature.link}>
                <Card
                  className="h-full transform transition-all duration-300 hover:scale-[1.02]"
                  variant="primary"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-20`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-yellow-300">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-white/70">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-yellow-300 group">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-yellow-400/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-yellow-300">10,000+</div>
              <p className="text-yellow-100/60">Active Learners</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-yellow-300">500+</div>
              <p className="text-yellow-100/60">Learning Resources</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-yellow-300">95%</div>
              <p className="text-yellow-100/60">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card variant="accent" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4">
            <Sparkles className="w-64 h-64 text-yellow-400/5" />
          </div>
          <div className="relative p-8 md:p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold text-yellow-300">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-yellow-100/80 max-w-2xl mx-auto">
              Join our community of mindful learners and begin your path to personal growth and success.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link
                to="/signup"
                className="px-8 py-3 text-lg font-medium text-violet-900 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-xl hover:from-yellow-400 hover:to-yellow-600 transition-all duration-200 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 transform hover:scale-105"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;