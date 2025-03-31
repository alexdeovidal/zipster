
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

async function downloadGitHubRepository(repoUrl: string, branch: string = 'master') {
  try {
    const repoInfoMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!repoInfoMatch) {
      throw new Error('URL de repositório GitHub inválida');
    }

    const [, owner, repo] = repoInfoMatch;
    console.log(`Baixando repositório ${owner}/${repo} (branch: ${branch})`);

    // URL da API do GitHub para obter o conteúdo do repositório
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    
    // Obtém a árvore de arquivos do repositório
    const treeResponse = await fetch(apiUrl);
    if (!treeResponse.ok) {
      const error = await treeResponse.text();
      throw new Error(`Erro ao obter árvore do repositório: ${error}`);
    }
    
    const treeData = await treeResponse.json();
    
    // Filtra apenas os arquivos (não diretórios)
    const files = treeData.tree.filter((item: any) => item.type === 'blob');
    
    // Baixa o conteúdo de cada arquivo
    const processedFiles = await Promise.all(
      files.map(async (file: any) => {
        try {
          const fileResponse = await fetch(file.url);
          if (!fileResponse.ok) {
            console.warn(`Erro ao baixar arquivo ${file.path}: ${fileResponse.statusText}`);
            return null;
          }
          
          const fileData = await fileResponse.json();
          let content = '';
          
          if (fileData.encoding === 'base64') {
            // Decodifica o conteúdo base64 para UTF-8
            const bytes = base64ToUint8Array(fileData.content);
            content = new TextDecoder().decode(bytes);
          } else {
            content = fileData.content;
          }
          
          return {
            path: file.path,
            content
          };
        } catch (error) {
          console.warn(`Erro ao processar arquivo ${file.path}:`, error);
          return null;
        }
      })
    );
    
    // Remove nulls de arquivos que falharam
    const validFiles = processedFiles.filter(file => file !== null);
    
    console.log(`Download concluído. ${validFiles.length} arquivos processados.`);
    return validFiles;
  } catch (error) {
    console.error('Erro ao baixar repositório:', error);
    throw error;
  }
}

// Função auxiliar para converter Base64 para Uint8Array
function base64ToUint8Array(base64: string) {
  const binary = atob(base64.replace(/\s/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

serve(async (req) => {
  // Habilita CORS
  const headers = new Headers({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  });

  // Responde a requisições OPTIONS para CORS pre-flight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }

  try {
    const { repositoryUrl, branch = 'master' } = await req.json();
    
    if (!repositoryUrl) {
      return new Response(
        JSON.stringify({ error: 'URL do repositório é obrigatória' }),
        { status: 400, headers }
      );
    }
    
    console.log(`Iniciando download do repositório: ${repositoryUrl}, branch: ${branch}`);
    const files = await downloadGitHubRepository(repositoryUrl, branch);
    
    return new Response(
      JSON.stringify({ files, count: files.length }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao baixar template',
        message: error.message || 'Erro desconhecido'
      }),
      { status: 500, headers }
    );
  }
});
