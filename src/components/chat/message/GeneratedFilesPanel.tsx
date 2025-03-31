
import React from 'react';
import { GeneratedFile } from "@/services/openaiService";
import { Button } from "@/components/ui/button";
import { Code, FileText, RotateCcw } from "lucide-react";

interface GeneratedFilesPanelProps {
  files: GeneratedFile[];
  onApplyGeneratedFiles?: (files: GeneratedFile[]) => void;
}

const GeneratedFilesPanel: React.FC<GeneratedFilesPanelProps> = ({ 
  files,
  onApplyGeneratedFiles
}) => {
  if (!files || files.length === 0) return null;
  
  return (
    <div className="relative bg-white/20 dark:bg-secondary/30 p-4 rounded-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Code size={16} />
          <span className="font-medium">{files.length} arquivos gerados</span>
        </div>
        {onApplyGeneratedFiles && files.length > 0 && (
          <Button 
            size="sm"
            variant="secondary"
            className="text-xs py-1 bg-primary/20 hover:bg-primary/30 text-white"
            onClick={() => onApplyGeneratedFiles(files)}
          >
            <RotateCcw size={14} className="mr-1" />
            Reverter a esse ponto
          </Button>
        )}
      </div>
      <div className="max-h-40 overflow-y-auto text-xs space-y-1">
        {files.map((file, index) => (
          <div key={index} className="py-1 px-2 rounded bg-white/20 dark:bg-secondary/40 flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <FileText size={12} className="flex-shrink-0" />
              <span className="font-mono truncate">{file.path}</span>
            </div>
            <span className="text-white/80 dark:text-white/80 ml-2 flex-shrink-0">{file.language}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedFilesPanel;
