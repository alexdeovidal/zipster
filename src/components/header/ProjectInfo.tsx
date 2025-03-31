
import React from 'react';

interface ProjectInfoProps {
  projectName: string;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectName }) => {
  return (
    <div className="hidden md:flex items-center space-x-1">
      <span className="text-sm text-muted-foreground">Projeto:</span>
      <span className="text-sm font-medium">{projectName || "Novo Projeto"}</span>
    </div>
  );
};

export default ProjectInfo;
