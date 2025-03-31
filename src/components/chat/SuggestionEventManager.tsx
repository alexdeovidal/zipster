
import React, { useEffect } from 'react';
import { useMessageSuggestion } from '@/hooks/chat/useMessageSuggestion';

interface SuggestionEventManagerProps {
  onSendPrompt: (prompt: string, image?: File) => Promise<void>;
}

const SuggestionEventManager: React.FC<SuggestionEventManagerProps> = ({ 
  onSendPrompt 
}) => {
  // Setup event listener for suggestions
  useEffect(() => {
    const handleSuggestion = (e: CustomEvent<{ suggestion: string }>) => {
      if (e.detail && e.detail.suggestion) {
        onSendPrompt(e.detail.suggestion);
      }
    };

    document.addEventListener('suggest-prompt', handleSuggestion as EventListener);
    
    return () => {
      document.removeEventListener('suggest-prompt', handleSuggestion as EventListener);
    };
  }, [onSendPrompt]);

  // Este componente não renderiza nada visualmente
  return null;
};

export default React.memo(SuggestionEventManager);
