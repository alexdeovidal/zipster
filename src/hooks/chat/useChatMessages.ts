
import { useState, useCallback } from 'react';
import { Message } from '@/services/openaiService';
import { useMessageTracking } from './useMessageTracking';
import { useInitialMessage } from './useInitialMessage';

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  
  const {
    isMessageProcessed,
    markMessageAsProcessed,
    clearProcessedMessages
  } = useMessageTracking();
  
  const {
    setInitialMessage: setInitialWelcomeMessage,
    resetInitialMessageState
  } = useInitialMessage(messages, markMessageAsProcessed);
  
  // Create a wrapper for setInitialMessage that only updates if there are no messages
  const setInitialMessage = useCallback((message: string) => {
    // Only set initial message if there are no existing messages
    if (messages.length === 0) {
      console.log("Setting initial welcome message in useChatMessages");
      const initialMessage = setInitialWelcomeMessage(message);
      if (initialMessage) {
        setMessages([initialMessage]);
        return initialMessage;
      }
    } else {
      console.log("Skipping initial message - already have", messages.length, "messages");
    }
    return null;
  }, [messages.length, setInitialWelcomeMessage, setMessages]);

  // Reset all states
  const resetAllMessageState = useCallback(() => {
    clearProcessedMessages();
    resetInitialMessageState();
  }, [clearProcessedMessages, resetInitialMessageState]);

  return {
    messages,
    setMessages,
    loading,
    setLoading,
    setInitialMessage,
    isMessageProcessed,
    markMessageAsProcessed,
    clearProcessedMessages: resetAllMessageState
  };
}
