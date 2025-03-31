
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileData } from '@/components/CodeEditor';
import { getFileLanguage, FileOperationResult } from './fileUtils';

export function useSaveFiles() {
  const saveFilesToSupabase = async (projectId: string, filesToSave: FileData[], userId: any): Promise<boolean> => {
    if (!userId || !projectId) return false;
    
    try {
      console.log(`Saving ${filesToSave.length} files to project ${projectId}`);
      
      for (const file of filesToSave) {
        // Check if the file already exists
        const { data: existingFile } = await supabase
          .from('project_files')
          .select('id')
          .eq('project_id', projectId)
          .eq('file_path', file.path)
          .maybeSingle();
        
        if (existingFile) {
          // Update existing file
          const { error: updateError } = await supabase
            .from('project_files')
            .update({
              content: file.content,
              language: file.language
            })
            .eq('id', existingFile.id);
          
          if (updateError) throw updateError;
        } else {
          // Insert new file
          const { error: insertError } = await supabase
            .from('project_files')
            .insert({
              project_id: projectId,
              file_path: file.path,
              content: file.content,
              language: file.language
            });
          
          if (insertError) throw insertError;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error saving project files:', error);
      return false;
    }
  };

  const saveFileToSupabase = async (projectId: string, filePath: string, content: string, userId: any, language?: string): Promise<FileOperationResult> => {
    if (!userId || !projectId) return { success: false, message: 'Missing user or project ID' };
    
    try {
      const { data, error: selectError } = await supabase
        .from('project_files')
        .select('id')
        .eq('project_id', projectId)
        .eq('file_path', filePath)
        .maybeSingle();
      
      if (selectError) throw selectError;
      
      const fileLanguage = language || getFileLanguage(filePath);
      
      if (data) {
        const { error: updateError } = await supabase
          .from('project_files')
          .update({ content })
          .eq('id', data.id);
        
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('project_files')
          .insert({
            project_id: projectId,
            file_path: filePath,
            content,
            language: fileLanguage
          });
        
        if (insertError) throw insertError;
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving file:', error);
      return { 
        success: false, 
        message: 'Não foi possível salvar as alterações no servidor.' 
      };
    }
  };

  const deleteFileFromSupabase = async (projectId: string, filePath: string): Promise<FileOperationResult> => {
    if (!projectId) return { success: false, message: 'Missing project ID' };
    
    try {
      const { error } = await supabase
        .from('project_files')
        .delete()
        .eq('project_id', projectId)
        .eq('file_path', filePath);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { 
        success: false, 
        message: 'Não foi possível excluir o arquivo do servidor.' 
      };
    }
  };

  return { saveFilesToSupabase, saveFileToSupabase, deleteFileFromSupabase };
}
