import React from 'react';

const PageBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative">
      {/* Dark violet gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950 via-violet-900 to-purple-900" />
      
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-tr from-violet-800/10 via-fuchsia-800/5 to-purple-800/10 animate-gradient-slow" />
      
      {/* Mesh pattern overlay */}
      <div className="fixed inset-0 bg-mesh-pattern opacity-5" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default PageBackground; 