import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  className = '',
  children,
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-yellow-100/80 max-w-3xl">
          {description}
        </p>
      )}
      <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
      {Icon && (
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
      )}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader; 