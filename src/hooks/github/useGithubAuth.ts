
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { initiateGithubOAuth } from '@/services/github';

/**
 * Hook to manage GitHub OAuth process
 */
export function useGithubAuth() {
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  
  const handleGithubOAuth = async () => {
    console.log("Iniciando OAuth do GitHub");
    
    try {
      const result = await initiateGithubOAuth();
      if (!result) {
        console.log("Não foi possível iniciar o OAuth do GitHub");
        toast({
          title: "Erro na conexão",
          description: "Não foi possível iniciar a autenticação com GitHub. Tente novamente.",
          variant: "destructive"
        });
      } else {
        console.log("OAuth iniciado, aguardando redirecionamento...");
        toast({
          title: "Redirecionando...",
          description: "Você será redirecionado para o GitHub para autorização.",
        });
      }
    } catch (error) {
      console.error("Erro ao iniciar OAuth:", error);
      toast({
        title: "Erro na conexão",
        description: "Ocorreu um erro ao iniciar a autenticação com GitHub.",
        variant: "destructive"
      });
    }
  };

  return {
    isGithubModalOpen,
    setIsGithubModalOpen,
    handleGithubOAuth
  };
}
