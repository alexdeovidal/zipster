
/**
 * Utilitários para criação de objetos HTTP Response
 */

/**
 * Prepara a resposta HTTP com os cabeçalhos CORS apropriados
 * @param data Dados para incluir na resposta
 * @param status Código de status HTTP
 * @param corsHeaders Cabeçalhos CORS a serem incluídos
 * @returns Objeto Response pronto para retornar ao cliente
 */
export function createResponse(data: any, status = 200, corsHeaders: Record<string, string>) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

/**
 * Cria uma resposta de erro padrão
 * @param message Mensagem de erro
 * @param status Código de status HTTP
 * @param corsHeaders Cabeçalhos CORS a serem incluídos
 * @returns Objeto Response formatado como erro
 */
export function createErrorResponse(message: string, status = 500, corsHeaders: Record<string, string>) {
  return createResponse({ error: message }, status, corsHeaders);
}
