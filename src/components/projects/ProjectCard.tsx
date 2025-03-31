
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Edit, Trash2, Download, Github, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";

interface Project {
  id: string;
  title: string;
  framework: string;
  created_at: string;
  description: string | null;
  github_repo: string | null;
}

interface ProjectCardProps {
  project: Project;
  onDelete: (projectId: string) => Promise<void>;
  onDownload: (projectId: string) => Promise<void>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete, onDownload }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const openInGithub = (repoUrl: string) => {
    window.open(repoUrl, '_blank');
  };

  // Get badge color based on framework
  const getBadgeVariant = (framework: string) => {
    const frameworkMap: Record<string, string> = {
      'react-vite': 'bg-blue-500/20 text-blue-500 border-blue-500/20',
      'vue3-vite': 'bg-green-500/20 text-green-500 border-green-500/20',
      'nextjs14': 'bg-black/20 text-black dark:text-white border-black/20 dark:border-white/20',
      'nuxt3': 'bg-green-500/20 text-green-500 border-green-500/20',
      'sveltekit': 'bg-orange-500/20 text-orange-500 border-orange-500/20',
      'astro': 'bg-purple-500/20 text-purple-500 border-purple-500/20',
      'wordpress-theme': 'bg-blue-500/20 text-blue-500 border-blue-500/20',
      'wordpress-elementor': 'bg-pink-500/20 text-pink-500 border-pink-500/20',
      'fastapi-python': 'bg-teal-500/20 text-teal-500 border-teal-500/20',
      'nestjs': 'bg-red-500/20 text-red-500 border-red-500/20',
      'golang': 'bg-cyan-500/20 text-cyan-500 border-cyan-500/20',
      'bun': 'bg-amber-500/20 text-amber-500 border-amber-500/20',
      'laravel': 'bg-red-500/20 text-red-500 border-red-500/20',
      'laravel-livewire': 'bg-pink-500/20 text-pink-500 border-pink-500/20',
      'laravel-react': 'bg-indigo-500/20 text-indigo-500 border-indigo-500/20',
      'laravel-vue': 'bg-emerald-500/20 text-emerald-500 border-emerald-500/20',
      'html-css-js': 'bg-orange-500/20 text-orange-500 border-orange-500/20',
    };
    
    return frameworkMap[framework] || 'bg-gray-500/20 text-gray-500 border-gray-500/20';
  };

  return (
    <Card key={project.id} className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold break-words pr-2">{project.title}</CardTitle>
          <Badge variant="outline" className={getBadgeVariant(project.framework)}>{project.framework}</Badge>
        </div>
        <CardDescription className="flex items-center gap-2 mt-1">
          <Calendar className="h-3 w-3" />
          {formatDate(project.created_at)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {project.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-4 border-t">
        <DeleteConfirmDialog
          itemName={`project "${project.title}" and all of its files`}
          onConfirm={() => onDelete(project.id)}
          triggerButtonProps={{
            variant: "outline",
            size: "sm",
            className: "text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
          }}
        />
        
        <Button 
          onClick={() => onDownload(project.id)} 
          variant="outline" 
          size="sm"
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
        
        <Button 
          onClick={() => navigate(`/builder/${project.id}`)} 
          size="sm"
          className="ml-auto"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        
        {project.github_repo && (
          <Button 
            onClick={() => openInGithub(project.github_repo!)} 
            variant="outline" 
            size="sm"
          >
            <Github className="h-4 w-4 mr-1" />
            GitHub
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
