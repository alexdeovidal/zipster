
import React from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { FrameworkCategory } from '@/hooks/useProjectSelector';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryTabsProps {
  activeTab: FrameworkCategory;
  onTabChange: (value: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  const isMobile = useIsMobile();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="overflow-x-auto pb-2">
        <TabsList className="flex w-max min-w-full md:w-auto md:grid md:grid-cols-6 mb-8 bg-background/20 text-foreground">
          <TabsTrigger value="all" className="text-foreground data-[state=active]:text-primary data-[state=active]:bg-background">
            Todos
          </TabsTrigger>
          <TabsTrigger value="frontend" className="text-foreground data-[state=active]:text-primary data-[state=active]:bg-background">
            Frontend
          </TabsTrigger>
          <TabsTrigger value="backend" className="text-foreground data-[state=active]:text-primary data-[state=active]:bg-background">
            Backend
          </TabsTrigger>
          <TabsTrigger value="fullstack" className="text-foreground data-[state=active]:text-primary data-[state=active]:bg-background">
            Full-Stack
          </TabsTrigger>
          <TabsTrigger value="cms" className="text-foreground data-[state=active]:text-primary data-[state=active]:bg-background">
            CMS
          </TabsTrigger>
          <TabsTrigger value="mobile" className="text-foreground data-[state=active]:text-primary data-[state=active]:bg-background">
            Mobile
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
};

export default CategoryTabs;
