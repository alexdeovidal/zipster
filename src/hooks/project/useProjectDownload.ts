
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { downloadProjectAsZip } from '@/utils/downloadUtils';
import { ProjectFile } from '@/utils/fileTypes';
import { Project } from './types';

export function useProjectDownload(project: Project) {
  const handleDownloadZip = async () => {
    if (!project.id) {
      toast({
        title: "Erro ao baixar",
        description: "Nenhum projeto selecionado para download.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Fetch ALL files from the project, including template files
      const { data: projectFiles, error } = await supabase
        .from('project_files')
        .select('file_path, content')
        .eq('project_id', project.id);
      
      if (error) throw error;
      
      if (!projectFiles || projectFiles.length === 0) {
        toast({
          title: "Projeto vazio",
          description: "Não há arquivos para download.",
          variant: "default"
        });
        return;
      }
      
      console.log(`Preparing to download ${projectFiles.length} files from project`);
      
      const filesForZip: ProjectFile[] = projectFiles.map(file => ({
        path: file.file_path,
        content: file.content
      }));
      
      downloadProjectAsZip(project.name, filesForZip);
      
      toast({
        title: "Download iniciado",
        description: `Seu projeto com ${filesForZip.length} arquivos foi baixado como arquivo ZIP.`,
      });
    } catch (error) {
      console.error('Error downloading project:', error);
      toast({
        title: "Erro ao baixar",
        description: "Ocorreu um erro ao gerar o arquivo ZIP.",
        variant: "destructive"
      });
    }
  };

  return { handleDownloadZip };
}
