
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Framework } from '@/data/framework-types';
import FrameworkCard from './FrameworkCard';

interface CategorySectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  frameworks: Framework[];
  colorClasses: {
    icon: string;
    button: string;
    card: string;
    badge: string;
    buttonHover: string;
  };
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  title, 
  description, 
  icon, 
  frameworks, 
  colorClasses 
}) => {
  const navigate = useNavigate();
  
  const handleNavigateToFrameworks = () => {
    navigate('/frameworks');
  };

  return (
    <div className="w-full py-16">
      <div className="w-full px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`rounded-full p-3 ${colorClasses.icon}`}>
                {icon}
              </div>
              <h3 className="text-3xl font-semibold">{title}</h3>
            </div>
            <p className="text-muted-foreground max-w-2xl text-lg">
              {description}
            </p>
          </div>
          <Button 
            onClick={handleNavigateToFrameworks} 
            variant="outline" 
            className={`${colorClasses.button} group`}
          >
            Ver todos <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {frameworks.map(framework => (
            <FrameworkCard 
              key={framework.id} 
              framework={framework} 
              colorClasses={{
                card: colorClasses.card,
                badge: colorClasses.badge,
                button: colorClasses.buttonHover,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
