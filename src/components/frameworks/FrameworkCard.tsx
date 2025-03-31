
import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

export interface FrameworkCardProps {
  id: string;
  name: string;
  description: string;
  stars: number;
  tags: string[];
  logo: string;
  color: string;
  textColor: string;
}

const FrameworkCard: React.FC<FrameworkCardProps> = (framework) => {
  const navigate = useNavigate();

  const handleUseFramework = (frameworkId: string) => {
    navigate(`/?framework=${frameworkId}`);
  };

  return (
    <Card 
      key={framework.id} 
      className={`bg-gradient-to-r ${framework.color} backdrop-blur-md border-border hover:bg-background/10 transition-colors hover:shadow-md dark:border-white/10`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded-md p-1 flex items-center justify-center">
              <img src={framework.logo} alt={framework.name} className="h-8 w-8 object-contain" />
            </div>
            <div>
              <CardTitle className="text-foreground text-base font-semibold break-words pr-2">{framework.name}</CardTitle>
              <div className="flex items-center mt-1 text-foreground/80 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                {framework.stars}/5.0
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2 overflow-hidden">
          {framework.tags.map(tag => (
            <Badge key={tag} variant="outline" className="bg-background/10 backdrop-blur-sm text-foreground border-border text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground mb-4 text-sm line-clamp-3">{framework.description}</p>
        <Button 
          className="w-full flex items-center justify-center gap-2 rounded-full backdrop-blur-sm btn-hover-effect"
          variant="outline"
          onClick={() => handleUseFramework(framework.id)}
        >
          Usar Framework <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default FrameworkCard;
