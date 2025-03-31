
import { v4 as uuidv4 } from 'uuid';
import { Message, AIResponse, GeneratedFile } from './types';
import { extractFilesFromResponse } from './responseParser';

/**
 * Cria uma mensagem do usuário
 */
export function createUserMessage(prompt: string, image?: File): Message {
  const userMessageContent = image 
    ? `${prompt.trim() ? prompt : "Analise esta imagem"} [Imagem anexada: ${image.name}]` 
    : prompt;
  
  return {
    id: uuidv4(),
    content: userMessageContent,
    sender: 'user',
    timestamp: new Date(),
    imageUrl: image ? URL.createObjectURL(image) : undefined
  };
}

/**
 * Cria uma mensagem do assistente a partir da resposta da API
 */
export function createAssistantMessage(responseData: any): Message {
  // Se os dados retornados já são um objeto com array de arquivos
  if (typeof responseData === 'object' && responseData.files && Array.isArray(responseData.files)) {
    console.log(`Recebida resposta JSON direta com ${responseData.files.length} arquivos`);
    
    return {
      id: uuidv4(),
      content: JSON.stringify(responseData),
      parsedResponse: {
        reply: responseData.reply,
        files: responseData.files,
        imageAnalysis: responseData.imageAnalysis
      },
      sender: 'assistant',
      timestamp: new Date()
    };
  }
  
  // Se a resposta está embrulhada em uma propriedade 'response'
  if (responseData.response) {
    console.log("Analisando resposta do tipo response string");
    const responseText = responseData.response;
    const parsedResponse = extractFilesFromResponse(responseText);
    
    return {
      id: uuidv4(),
      content: responseText,
      parsedResponse,
      sender: 'assistant',
      timestamp: new Date()
    };
  }

  // Resposta simples para outros casos
  return {
    id: uuidv4(),
    content: typeof responseData === 'string' ? responseData : JSON.stringify(responseData),
    sender: 'assistant',
    timestamp: new Date()
  };
}

/**
 * Cria uma mensagem de erro
 */
export function createErrorMessage(errorMessage: string): Message {
  return {
    id: uuidv4(),
    content: errorMessage || "Desculpe, houve um erro ao processar sua solicitação. Por favor, tente novamente.",
    sender: 'assistant',
    timestamp: new Date()
  };
}
