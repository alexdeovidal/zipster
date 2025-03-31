
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate('/')} 
      className={`cursor-pointer flex items-center gap-2 ${className || ''}`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-r from-brand-purple to-brand-blue">
        <span className="text-lg font-bold text-white">Z</span>
      </div>
      <h1 className="text-xl font-bold gradient-purple-text">
        Zipster
      </h1>
    </div>
  );
};

export default Logo;
