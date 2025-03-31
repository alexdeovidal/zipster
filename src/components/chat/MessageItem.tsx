
import React from 'react';
import { Message } from "@/services/openaiService";
import UserMessage from './message/UserMessage';
import AssistantMessage from './message/AssistantMessage';

interface MessageItemProps {
  message: Message;
  onApplyGeneratedFiles?: (files: any[]) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onApplyGeneratedFiles }) => {
  // Renderiza mensagem de usuário ou assistente com base no remetente
  if (message.sender === 'user') {
    return <UserMessage message={message} />;
  } else {
    return <AssistantMessage message={message} onApplyGeneratedFiles={onApplyGeneratedFiles} />;
  }
};

export default MessageItem;
