
import React from 'react';
import { GeneratedFile } from "@/services/openaiService";

interface ModifiedFilesListProps {
  files: GeneratedFile[];
  getFileDescription: (file: GeneratedFile) => string;
}

const ModifiedFilesList: React.FC<ModifiedFilesListProps> = ({ 
  files, 
  getFileDescription 
}) => {
  if (!files || files.length === 0) return null;
  
  return (
    <div className="space-y-2 mb-3">
      <p className="font-medium text-sm mb-2">
        {files.length > 1 
          ? `Modifiquei os seguintes arquivos:`
          : `Modifiquei o seguinte arquivo:`}
      </p>
      
      <ol className="space-y-2 list-none ml-1">
        {files.map((file, index) => (
          <li key={index} className="text-sm flex items-start">
            <span className="mr-2 flex-shrink-0 font-medium">
              {index + 1}.
            </span>
            <div className="flex flex-col">
              <span className="font-medium break-all">
                {file.path.split('/').pop()}:
              </span>
              <span className="text-white/90 break-words">
                {file.description || getFileDescription(file)}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ModifiedFilesList;
