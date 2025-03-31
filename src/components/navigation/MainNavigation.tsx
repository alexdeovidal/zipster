
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Layout, Database, Globe, Paintbrush, ChevronDown, ChevronRight } from 'lucide-react';
import { Framework } from '@/data/framework-types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// List item component for dropdown content
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
});
ListItem.displayName = "ListItem";

interface MainNavigationProps {
  frontendFrameworks: Framework[];
  backendFrameworks: Framework[];
  fullstackFrameworks: Framework[];
  cmsFrameworks: Framework[]; 
  user: any;
  isMobile?: boolean;
}

const MainNavigation: React.FC<MainNavigationProps> = ({
  frontendFrameworks,
  backendFrameworks,
  fullstackFrameworks,
  cmsFrameworks,
  user,
  isMobile = false
}) => {
  const navigate = useNavigate();
  // State for collapsible sections in mobile view
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // For mobile view
  if (isMobile) {
    return (
      <ScrollArea className="h-[calc(100vh-120px)] w-full">
        <div className="flex flex-col space-y-4 w-full p-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          
          {user && (
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => navigate('/projects')}
            >
              Meus Projetos
            </Button>
          )}

          <Collapsible open={openSections['resources']} className="w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground p-2">Recursos</h3>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleSection('resources')}
                  className="p-1"
                >
                  {openSections['resources'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="space-y-1 pl-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate('/docs')}
                >
                  Documentação
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate('/frameworks')}
                >
                  Frameworks
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  onClick={() => navigate('/terminal')}
                >
                  Terminal
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Collapsible open={openSections['frameworks']} className="w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground p-2">Frameworks</h3>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleSection('frameworks')}
                  className="p-1"
                >
                  {openSections['frameworks'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="space-y-1 pl-3">
                <Collapsible open={openSections['frontend']} className="w-full">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-medium text-muted-foreground pl-2">Frontend</h4>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleSection('frontend')}
                        className="p-1"
                      >
                        {openSections['frontend'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="space-y-1 pl-2">
                      {frontendFrameworks.slice(0, 3).map(framework => (
                        <Button 
                          key={framework.id}
                          variant="ghost" 
                          className="w-full justify-start" 
                          onClick={() => navigate(`/?framework=${framework.id}`)}
                        >
                          {framework.name}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible open={openSections['backend']} className="w-full">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-medium text-muted-foreground pl-2 mt-2">Backend</h4>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleSection('backend')}
                        className="p-1"
                      >
                        {openSections['backend'] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="space-y-1 pl-2">
                      {backendFrameworks.slice(0, 3).map(framework => (
                        <Button 
                          key={framework.id}
                          variant="ghost" 
                          className="w-full justify-start" 
                          onClick={() => navigate(`/?framework=${framework.id}`)}
                        >
                          {framework.name}
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start mt-2" 
                  onClick={() => navigate('/frameworks')}
                >
                  Ver todos os frameworks →
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    );
  }
  
  // For desktop view (original code)
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white">Recursos</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-black/80 backdrop-blur-lg">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-brand-lilac/20 to-brand-blue/20 p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium text-white">
                      Zipster Builder
                    </div>
                    <p className="text-sm leading-tight text-white/80">
                      Plataforma avançada para desenvolvimento web com diversos frameworks.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li className="hover:bg-white/10 rounded-md">
                <NavigationMenuLink asChild>
                  <a href="/docs" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors text-white">
                    <div className="text-sm font-medium leading-none">Documentação</div>
                    <p className="line-clamp-2 text-sm leading-snug text-white/70">
                      Guias e referências para usar o Zipster Builder.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li className="hover:bg-white/10 rounded-md">
                <NavigationMenuLink asChild>
                  <a href="/frameworks" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors text-white">
                    <div className="text-sm font-medium leading-none">Frameworks</div>
                    <p className="line-clamp-2 text-sm leading-snug text-white/70">
                      Explore nossa coleção de frameworks suportados.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li className="hover:bg-white/10 rounded-md">
                <NavigationMenuLink asChild>
                  <a href="/terminal" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors text-white">
                    <div className="text-sm font-medium leading-none">Terminal</div>
                    <p className="line-clamp-2 text-sm leading-snug text-white/70">
                      Terminal integrado para comandos e desenvolvimento.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white">Frameworks</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-2 p-4 md:grid-cols-2 lg:grid-cols-4 bg-black/80 backdrop-blur-lg min-w-[600px]">
              <div className="col-span-1">
                <h3 className="mb-2 text-sm font-medium text-white/70 flex items-center gap-2">
                  <Layout className="h-4 w-4 text-blue-400" /> Frontend
                </h3>
                <ul className="space-y-1">
                  {frontendFrameworks.slice(0, 5).map((framework) => (
                    <li key={framework.id} className="hover:bg-white/10 rounded-md">
                      <NavigationMenuLink asChild>
                        <a 
                          href={`/?framework=${framework.id}`}
                          className="block px-3 py-2 text-sm text-white hover:text-white/90"
                        >
                          {framework.name}
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-1">
                <h3 className="mb-2 text-sm font-medium text-white/70 flex items-center gap-2">
                  <Database className="h-4 w-4 text-green-400" /> Backend
                </h3>
                <ul className="space-y-1">
                  {backendFrameworks.slice(0, 5).map((framework) => (
                    <li key={framework.id} className="hover:bg-white/10 rounded-md">
                      <NavigationMenuLink asChild>
                        <a 
                          href={`/?framework=${framework.id}`}
                          className="block px-3 py-2 text-sm text-white hover:text-white/90"
                        >
                          {framework.name}
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-1">
                <h3 className="mb-2 text-sm font-medium text-white/70 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-400" /> Full-Stack
                </h3>
                <ul className="space-y-1">
                  {fullstackFrameworks.slice(0, 5).map((framework) => (
                    <li key={framework.id} className="hover:bg-white/10 rounded-md">
                      <NavigationMenuLink asChild>
                        <a 
                          href={`/?framework=${framework.id}`}
                          className="block px-3 py-2 text-sm text-white hover:text-white/90"
                        >
                          {framework.name}
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-1">
                <h3 className="mb-2 text-sm font-medium text-white/70 flex items-center gap-2">
                  <Paintbrush className="h-4 w-4 text-pink-400" /> CMS
                </h3>
                <ul className="space-y-1">
                  {cmsFrameworks.slice(0, 5).map((framework) => (
                    <li key={framework.id} className="hover:bg-white/10 rounded-md">
                      <NavigationMenuLink asChild>
                        <a 
                          href={`/?framework=${framework.id}`}
                          className="block px-3 py-2 text-sm text-white hover:text-white/90"
                        >
                          {framework.name}
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-black/60 p-2">
              <a href="/frameworks" className="block w-full text-center text-sm text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-md">
                Ver todos os frameworks →
              </a>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {user && (
          <NavigationMenuItem>
            <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/projects">
              Meus Projetos
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
