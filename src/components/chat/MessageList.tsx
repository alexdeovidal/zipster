
import React, { useEffect } from 'react';
import { Message, GeneratedFile } from "@/services/openaiService";
import EmptyStateMessage from './message/EmptyStateMessage';
import MessageListContainer from './message/MessageListContainer';
import { useMessageSuggestion } from '@/hooks/chat/useMessageSuggestion';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  onApplyGeneratedFiles?: (files: GeneratedFile[]) => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  loading, 
  onApplyGeneratedFiles 
}) => {
  const { handleSuggestion } = useMessageSuggestion();

  // Log messages when they change to debug
  useEffect(() => {
    console.log('MessageList received messages:', messages.length);
  }, [messages]);

  if (messages.length === 0) {
    return <EmptyStateMessage onSuggest={handleSuggestion} />;
  }

  return (
    <MessageListContainer 
      messages={messages} 
      loading={loading} 
      onApplyGeneratedFiles={onApplyGeneratedFiles} 
    />
  );
};

export default MessageList;
