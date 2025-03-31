
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ChatHeaderProps {
  projectName?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ projectName = "Novo Projeto" }) => {
  return (
    <div className="p-4 border-b border-border flex items-center justify-between">
      <h2 className="font-semibold">Chat de IA</h2>
      {projectName && (
        <Badge variant="outline" className="text-xs">
          {projectName}
        </Badge>
      )}
    </div>
  );
};

export default React.memo(ChatHeader);
