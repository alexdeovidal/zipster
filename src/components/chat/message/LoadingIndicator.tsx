
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="mr-auto max-w-[80%] bg-brand-green/10 backdrop-blur-sm border border-brand-green/20 text-secondary-foreground rounded-lg p-3 z-10">
      <div className="flex space-x-2">
        <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" style={{ animationDelay: "0.2s" }}></div>
        <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" style={{ animationDelay: "0.4s" }}></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
