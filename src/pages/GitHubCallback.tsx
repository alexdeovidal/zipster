
import React, { useEffect } from 'react';
import { useGithubCallback } from '@/hooks/github/useGithubCallback';
import { 
  LoadingState, 
  SuccessState, 
  ErrorState, 
  LoadingMessage 
} from '@/components/github/CallbackStates';

const GitHubCallback: React.FC = () => {
  const { processing, success, error } = useGithubCallback();

  // Log para debug do estado do callback
  useEffect(() => {
    console.log("GitHub Callback estado:", { processing, success, error });
  }, [processing, success, error]);

  // Se estamos processando, mostrar o estado de carregamento
  if (processing) {
    return <LoadingState />;
  }

  // Se o login foi bem-sucedido, mostrar a tela de sucesso
  if (success) {
    return <SuccessState />;
  }

  // Só mostrar o estado de erro se não estamos processando e há um erro
  if (error) {
    return <ErrorState error={error} />;
  }

  // Fallback para qualquer outro caso (não deve acontecer)
  return <LoadingMessage />;
};

export default GitHubCallback;
