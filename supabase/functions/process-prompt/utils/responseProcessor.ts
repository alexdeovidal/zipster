
/**
 * Utilitários para processamento de respostas da API OpenAI
 */

import { validateFileExtension, getFileDescription } from './fileValidation.ts';

/**
 * Processa a resposta da OpenAI e garante que esteja no formato correto
 * @param generatedText Texto gerado pela API OpenAI
 * @param framework Framework do projeto
 * @returns Objeto de resposta formatado 
 */
export function processResponse(generatedText: string, framework: string) {
  console.log("Resposta recebida do OpenAI, formato:", {
    tipo: typeof generatedText,
    tamanho: generatedText.length,
    éJSON: generatedText.startsWith('{')
  });

  try {
    // Tentar analisar a resposta como JSON
    const jsonResponse = JSON.parse(generatedText);
    
    // Verificar se tem a estrutura esperada
    if (jsonResponse && jsonResponse.files && Array.isArray(jsonResponse.files)) {
      console.log(`Resposta JSON válida com ${jsonResponse.files.length} arquivos`);
      
      // Verificar se o projeto está completo (pelo menos 5 arquivos)
      if (jsonResponse.files.length < 5) {
        console.warn("Projeto incompleto detectado, possui menos de 5 arquivos");
      }
      
      // Adicionar descrições aos arquivos se não existirem e garantir extensões corretas
      jsonResponse.files = jsonResponse.files.map(file => {
        // Garantir que extensões estejam corretas para o framework
        file = validateFileExtension(file, framework);
        
        // Substituir placeholders de chave Supabase pelo valor real
        if (file.content && typeof file.content === 'string') {
          // Se for um arquivo de configuração do Supabase ou contiver placeholders de chave
          if (
            file.path.includes('supabase') || 
            file.path.includes('config') || 
            file.content.includes('sua-chave-supabase') || 
            file.content.includes('SUPABASE_ANON_KEY') ||
            file.content.includes('SUPABASE_URL')
          ) {
            // Substituir placeholders por valores reais
            file.content = file.content
              .replace(/['"]sua-chave-supabase['"]|sua-chave-supabase/g, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6cmVkbnpvbmJ6aGh1emlybGRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NTcwMzYsImV4cCI6MjA1ODEzMzAzNn0.vrkWL4jxhKg0mmFtUCqcIhOdo6OUPAy-ddZbbkSd18s')
              .replace(/['"]SEU_PROJECT_ID['"]|SEU_PROJECT_ID/g, 'ezrednzonbzhhuzirldb')
              .replace(/https:\/\/seu-projeto\.supabase\.co/g, 'https://ezrednzonbzhhuzirldb.supabase.co');
          }
        }
        
        // Adicionar descrição se não existir
        if (!file.description) {
          file.description = getFileDescription(file.path, file.language);
        }
        return file;
      });
      
      return jsonResponse;
    } else {
      console.warn("Resposta JSON inválida, faltando arquivos:", jsonResponse);
      // Criar estrutura correta
      return {
        reply: jsonResponse.reply || "Resposta sem arquivos. Tente ser mais específico no seu pedido.",
        imageAnalysis: jsonResponse.imageAnalysis || null,
        files: []
      };
    }
  } catch (e) {
    console.error("Erro ao analisar JSON:", e);
    // Não está em formato JSON, retornar como texto
    return { response: generatedText };
  }
}
