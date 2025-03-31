
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Menu, Github, Upload, FileArchive, Copy } from 'lucide-react';
import GitHubActions from './header/GitHubActions';
import SupabaseDropdown from './header/SupabaseDropdown';
import TemplateButton from './header/TemplateButton';
import ZipUploadButton from './header/ZipUploadButton';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectHeaderProps {
  projectName: string;
  githubUrl: string | null;
  onDownloadZip: () => void;
  onGithubConnect: () => void;
  isSupabaseConnected: boolean;
  onSupabaseConnect: () => void;
  supabaseProjectId?: string;
  projectId?: string;
  framework?: string;
  onLoadTemplate: (framework: string) => Promise<void>;
  // GitHub sync related props
  isSyncing?: boolean;
  hasExternalChanges?: boolean;
  onPullChanges?: () => void;
  // ZIP upload related props
  onUploadZip?: (file: File) => Promise<void>;
  isUploadingZip?: boolean;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  githubUrl,
  onDownloadZip,
  onGithubConnect,
  isSupabaseConnected,
  onSupabaseConnect,
  supabaseProjectId,
  projectId,
  framework = 'react-vite',
  onLoadTemplate,
  isSyncing,
  hasExternalChanges,
  onPullChanges,
  onUploadZip,
  isUploadingZip = false
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-background/50 backdrop-blur-lg border-b border-border p-2 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <h2 className="text-md font-medium">{projectName}</h2>
      </div>
      
      {isMobile ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={20} />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border-border min-w-[200px] w-64">
            <ScrollArea className="max-h-[calc(100vh-100px)]">
              {onUploadZip && (
                <DropdownMenuItem className="flex items-center gap-2 py-3">
                  <FileArchive size={18} className="text-primary" />
                  <ZipUploadButton 
                    onUpload={onUploadZip}
                    isProcessing={isUploadingZip}
                  />
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  size="default"
                  className="w-full flex items-center justify-start gap-2 py-3"
                  onClick={onDownloadZip}
                >
                  <Download size={18} className="text-primary" />
                  Baixar ZIP
                </Button>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex items-center gap-2 py-3">
                <Copy size={18} className="text-primary" />
                <TemplateButton 
                  projectId={projectId || ''} 
                  framework={framework}
                  onLoadTemplate={onLoadTemplate} 
                />
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="flex items-center gap-2 py-3">
                <Github size={18} className="text-primary" />
                <GitHubActions 
                  githubUrl={githubUrl} 
                  onGithubConnect={onGithubConnect}
                  isSyncing={isSyncing}
                  hasExternalChanges={hasExternalChanges}
                  onPullChanges={onPullChanges}
                  isMobile={true}
                />
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex items-center gap-2 py-3">
                <svg className="h-[18px] w-[18px] text-primary" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 2L2 5.5L9 9L16 5.5L9 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12.5L9 16L16 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 9L9 12.5L16 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <SupabaseDropdown
                  projectName={projectName}
                  projectId={projectId}
                  isConnected={isSupabaseConnected}
                  onConnect={onSupabaseConnect}
                  supabaseProjectId={supabaseProjectId}
                  isMobile={true}
                />
              </DropdownMenuItem>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center space-x-3">
          <TemplateButton 
            projectId={projectId || ''} 
            framework={framework}
            onLoadTemplate={onLoadTemplate} 
          />

          {onUploadZip && (
            <ZipUploadButton 
              onUpload={onUploadZip}
              isProcessing={isUploadingZip}
            />
          )}

          <Button
            variant="outline"
            size="default"
            className="hidden sm:flex items-center gap-2"
            onClick={onDownloadZip}
          >
            <Download size={18} />
            Baixar ZIP
          </Button>
          
          <GitHubActions 
            githubUrl={githubUrl} 
            onGithubConnect={onGithubConnect}
            isSyncing={isSyncing}
            hasExternalChanges={hasExternalChanges}
            onPullChanges={onPullChanges}
          />
          
          <SupabaseDropdown
            projectName={projectName}
            projectId={projectId}
            isConnected={isSupabaseConnected}
            onConnect={onSupabaseConnect}
            supabaseProjectId={supabaseProjectId}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectHeader;
