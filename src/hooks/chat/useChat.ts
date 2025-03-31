import { useEffect, useCallback, useState, useRef } from 'react';
import { Message, GeneratedFile } from '@/services/openaiService';
import { ProjectFile } from '@/utils/fileUtils';
import { useChatMessages } from './useChatMessages';
import { useChatSupabase } from './useChatSupabase';
import { useChatPrompt } from './useChatPrompt';
import { toast } from 'sonner';

interface UseChatProps {
  projectId: string | null;
  projectName: string;
  selectedFramework: string;
  userId: any;
  onApplyGeneratedFiles: (files: GeneratedFile[]) => Promise<void>;
  githubSync?: {
    syncChangesToGithub: (files: ProjectFile[]) => Promise<boolean>;
  } | null;
}

export function useChat({
  projectId,
  projectName,
  selectedFramework,
  userId,
  onApplyGeneratedFiles,
  githubSync = null
}: UseChatProps) {
  const {
    messages,
    setMessages,
    loading,
    setLoading,
    setInitialMessage,
    isMessageProcessed,
    markMessageAsProcessed,
    clearProcessedMessages
  } = useChatMessages();

  const {
    loadProjectMessages,
    saveMessageToSupabase,
    resetMessageTracking,
    isLoaded
  } = useChatSupabase();

  const { sendPrompt } = useChatPrompt();
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const currentProjectIdRef = useRef<string | null>(null);
  const initialLoadAttemptedRef = useRef(false);
  const isProcessingRef = useRef(false);

  const saveMessage = async (message: Message) => {
    if (isMessageProcessed(message.id)) {
      console.log("Message already processed, skipping save:", message.id);
      return true;
    }
    
    markMessageAsProcessed(message.id);
    
    if (userId && projectId) {
      try {
        return await saveMessageToSupabase(message, userId, projectId);
      } catch (error) {
        console.error("Error saving message to Supabase:", error);
        return true;
      }
    }
    return true;
  };

  const loadMessages = useCallback(async (force = false) => {
    if (!projectId) return false;
    
    if (messagesLoaded && projectId === currentProjectIdRef.current && !force) {
      console.log("Messages already loaded for this project, skipping load");
      return true;
    }
    
    try {
      setLoading(true);
      console.log("Loading messages for project:", projectId);
      
      let loadedMessages = null;
      
      try {
        loadedMessages = await loadProjectMessages(projectId);
      } catch (error) {
        console.error("Error loading messages from Supabase:", error);
        loadedMessages = [];
      }
      
      if (loadedMessages) {
        loadedMessages.forEach(msg => {
          markMessageAsProcessed(msg.id);
        });
        
        console.log("Setting loaded messages:", loadedMessages.length);
        setMessages(loadedMessages);
        
        setMessagesLoaded(true);
        currentProjectIdRef.current = projectId;
        initialLoadAttemptedRef.current = true;
        return true;
      }
      
      if (loadedMessages === null) {
        console.log("Messages already up to date");
        return true;
      }
      
      console.log("No messages found, setting empty array");
      setMessages([]);
      setMessagesLoaded(true);
      currentProjectIdRef.current = projectId;
      initialLoadAttemptedRef.current = true;
      return true;
    } catch (error) {
      console.error("Error in loadMessages:", error);
      setMessages([]);
      setMessagesLoaded(true);
      currentProjectIdRef.current = projectId;
      initialLoadAttemptedRef.current = true;
      return true;
    } finally {
      setLoading(false);
    }
  }, [projectId, loadProjectMessages, markMessageAsProcessed, setMessages, setLoading, messagesLoaded]);

  const handleSendPrompt = async (prompt: string, projectFiles: ProjectFile[], image?: File) => {
    if (isProcessingRef.current) {
      console.log("Already processing a prompt, ignoring:", prompt);
      return;
    }
    
    if (loading) {
      console.log("System is loading, ignoring prompt:", prompt);
      return;
    }
    
    try {
      isProcessingRef.current = true;
      
      const result = await sendPrompt({
        prompt,
        projectFiles,
        image,
        projectName,
        selectedFramework,
        messages,
        userId,
        projectId,
        saveMessage,
        onApplyGeneratedFiles: async (files: GeneratedFile[]) => {
          await onApplyGeneratedFiles(files);
          
          if (githubSync && files.length > 0) {
            console.log("Syncing changes to GitHub after file modifications");
            
            const projectFilesToSync: ProjectFile[] = files.map(file => ({
              path: file.path,
              content: file.content
            }));
            
            const commitMessage = `AI: ${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}`;
            
            githubSync.syncChangesToGithub(projectFilesToSync)
              .catch(error => {
                console.error("Failed to sync changes to GitHub:", error);
              });
          }
        },
        setLoading
      });
      
      if (result) {
        setMessages(prevMessages => [...prevMessages, result.userMessage, result.assistantMessage]);
      }
    } catch (error) {
      console.error("Error in handleSendPrompt:", error);
      toast.error("Erro ao enviar mensagem. Por favor, tente novamente.");
    } finally {
      isProcessingRef.current = false;
    }
  };

  useEffect(() => {
    console.log("useChat effect triggered - projectId:", projectId, 
                "currentProjectIdRef:", currentProjectIdRef.current, 
                "messagesLoaded:", messagesLoaded);
    
    if (!projectId) return;
    
    if (projectId !== currentProjectIdRef.current || !messagesLoaded) {
      if (projectId !== currentProjectIdRef.current) {
        console.log("Project ID changed, resetting message tracking");
        resetMessageTracking();
        clearProcessedMessages();
        setMessagesLoaded(false);
      }
      
      const timer = setTimeout(() => {
        loadMessages().catch(err => {
          console.error("Failed to load messages:", err);
          setMessagesLoaded(true);
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [projectId, loadMessages, clearProcessedMessages, resetMessageTracking, messagesLoaded]);

  useEffect(() => {
    if (projectId && !initialLoadAttemptedRef.current) {
      console.log("Initial load attempt for project:", projectId);
      loadMessages().catch(err => {
        console.error("Failed during initial load of messages:", err);
        setMessagesLoaded(true);
      });
    }
  }, [projectId, loadMessages]);

  useEffect(() => {
    console.log("Current messages in useChat:", messages.length);
  }, [messages]);

  return {
    messages,
    setMessages,
    loading,
    setLoading,
    handleSendPrompt,
    setInitialMessage,
    loadProjectMessages: loadMessages,
    messagesLoaded
  };
}
