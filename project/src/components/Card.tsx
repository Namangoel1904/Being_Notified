import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  onClick,
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'bg-gradient-to-br from-primary-500/30 via-secondary-500/20 to-accent-500/30',
    primary: 'bg-gradient-to-br from-primary-400/40 via-primary-500/30 to-primary-600/40',
    secondary: 'bg-gradient-to-br from-secondary-400/40 via-secondary-500/30 to-secondary-600/40',
    accent: 'bg-gradient-to-br from-accent-400/40 via-accent-500/30 to-accent-600/40',
  };

  const hoverClasses = {
    default: 'hover:from-primary-500/40 hover:via-secondary-500/30 hover:to-accent-500/40',
    primary: 'hover:from-primary-400/50 hover:via-primary-500/40 hover:to-primary-600/50',
    secondary: 'hover:from-secondary-400/50 hover:via-secondary-500/40 hover:to-secondary-600/50',
    accent: 'hover:from-accent-400/50 hover:via-accent-500/40 hover:to-accent-600/50',
  };

  return (
    <div
      className={`
        backdrop-blur-lg rounded-xl shadow-lg
        border border-white/10
        ${variantClasses[variant]}
        ${hover ? `transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${hoverClasses[variant]}` : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-pattern opacity-5" />
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;

// Usage example:
export const CardGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-3 mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <h3 className={`text-xl font-semibold bg-clip-text text-transparent bg-gradient-primary ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <p className={`text-white/80 ${className}`}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`mt-4 text-white/90 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`mt-4 pt-4 border-t border-white/20 ${className}`}>
      {children}
    </div>
  );
}; 