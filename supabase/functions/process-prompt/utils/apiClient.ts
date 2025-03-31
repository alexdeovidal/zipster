
import "https://deno.land/x/xhr@0.1.0/mod.ts";

/**
 * Chama a API OpenAI com os parâmetros configurados
 * @param openAIApiKey Chave da API OpenAI
 * @param messages Mensagens a serem enviadas para a API
 * @param hasImage Se há uma imagem no prompt
 * @returns Texto de resposta da API
 */
export async function callOpenAI(openAIApiKey: string, messages: any[], hasImage: boolean) {
  console.log("Enviando para OpenAI com configurações:", {
    model: hasImage ? 'gpt-4o' : 'gpt-4o',
    messagesCount: messages.length,
    temperatura: 0.8,
    temImagem: hasImage
  });

  // Chamar a API OpenAI com parâmetros otimizados para projetos completos
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: hasImage ? 'gpt-4o' : 'gpt-4o',
      messages,
      temperature: 0.8,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Erro na API OpenAI:', errorData);
    throw new Error(`Erro na API OpenAI: ${errorData.error?.message || 'Erro desconhecido'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
