
import { useState, useEffect } from 'react';
import { isGithubConnected as checkGithubConnection } from '@/services/github';

/**
 * Hook to manage GitHub connection status
 */
export function useGithubConnection() {
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [isCheckingGithubConnection, setIsCheckingGithubConnection] = useState(false);
  
  // Check if the user is connected to GitHub
  useEffect(() => {
    const checkGithubConnectionStatus = async () => {
      setIsCheckingGithubConnection(true);
      try {
        const connected = await checkGithubConnection();
        console.log("GitHub conectado:", connected);
        setIsGithubConnected(connected);
      } catch (error) {
        console.error("Erro ao verificar conexão GitHub:", error);
      } finally {
        setIsCheckingGithubConnection(false);
      }
    };

    checkGithubConnectionStatus();
  }, []);

  return {
    isGithubConnected,
    isCheckingGithubConnection
  };
}
