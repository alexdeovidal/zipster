
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ProjectFile } from './fileTypes';

/**
 * Downloads a collection of files as a zip archive
 * @param projectName Name of the project (used for the zip filename)
 * @param files Array of project files to include in the zip
 */
export const downloadProjectAsZip = async (projectName: string, files: ProjectFile[]) => {
  const zip = new JSZip();
  
  // Add files to zip
  files.forEach(file => {
    // Ensure proper directory structure
    const filePath = file.path.startsWith('/') ? file.path.substring(1) : file.path;
    zip.file(filePath, file.content);
  });
  
  // Generate the zip file
  const zipContent = await zip.generateAsync({ type: 'blob' });
  
  // Create a sanitized project name for the file
  const sanitizedName = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'project';
    
  // Download the zip file
  saveAs(zipContent, `${sanitizedName}.zip`);
};
