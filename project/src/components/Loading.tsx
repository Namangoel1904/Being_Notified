import React from 'react';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loading: React.FC<LoadingProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full
          border-2
          border-t-indigo-600
          border-r-indigo-600
          border-b-purple-600
          border-l-purple-600
          animate-spin
        `}
      />
    </div>
  );
};

export const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Loading size="lg" className="mb-4" />
        {message && (
          <p className="text-gray-600 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
};

export const LoadingCard: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="glass-card p-8 text-center">
      <Loading size="lg" className="mb-4" />
      {message && (
        <p className="text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default Loading; 