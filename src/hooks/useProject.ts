
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Project } from './project/types';
import { useProjectGithub } from './project/useProjectGithub';
import { useProjectDownload } from './project/useProjectDownload';
import { useProjectInitializer } from './project/useProjectInitializer';

export type { Project } from './project/types';

export function useProject() {
  const [project, setProject] = useState<Project>({
    id: null,
    name: "Meu Projeto",
    framework: '',
    githubUrl: null
  });
  const [user, setUser] = useState<any>(null);
  const [showFrameworkSelector, setShowFrameworkSelector] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [supabaseProjectId, setSupabaseProjectId] = useState<string | undefined>(undefined);

  // Initialize sub-hooks
  const { handleDownloadZip } = useProjectDownload(project);
  const { createProject } = useProjectInitializer(setProject, setShowFrameworkSelector, user);
  const { 
    isGithubModalOpen, 
    setIsGithubModalOpen, 
    isGithubConnected,
    handleGithubConnect,
    handleGithubOAuth
  } = useProjectGithub(project, setProject);

  // Check for authenticated user
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkUser();
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Check if project is connected to Supabase
  const checkSupabaseConnection = async (projectId: string) => {
    if (!user || !projectId) return;
    
    try {
      const { data, error } = await supabase
        .from('project_integrations')
        .select('*')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .eq('integration_type', 'supabase')
        .single();
      
      if (data && !error) {
        console.log("Supabase integration found:", data);
        setIsSupabaseConnected(true);
        
        // Store the Supabase project ID from the config if available
        // Using proper type checking to avoid TypeScript errors
        if (data.config && 
            typeof data.config === 'object' && 
            !Array.isArray(data.config) && 
            'url' in data.config && 
            typeof data.config.url === 'string') {
          
          const urlParts = data.config.url.split('.');
          if (urlParts.length > 0) {
            const projectId = urlParts[0].replace('https://', '');
            setSupabaseProjectId(projectId);
          }
        }
      } else {
        setIsSupabaseConnected(false);
        setSupabaseProjectId(undefined);
      }
    } catch (error) {
      console.error('Erro ao verificar conexão com Supabase:', error);
      setIsSupabaseConnected(false);
      setSupabaseProjectId(undefined);
    }
  };

  return {
    project,
    setProject,
    user,
    showFrameworkSelector,
    setShowFrameworkSelector,
    createProject,
    handleDownloadZip,
    handleGithubConnect,
    isGithubModalOpen,
    setIsGithubModalOpen,
    isGithubConnected,
    handleGithubOAuth,
    isSupabaseConnected,
    setIsSupabaseConnected,
    isSupabaseModalOpen,
    setIsSupabaseModalOpen,
    checkSupabaseConnection,
    supabaseProjectId
  };
}
