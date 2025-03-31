
import { ProjectFile } from '../fileTypes';

/**
 * Gera um template básico de projeto Laravel com os arquivos essenciais
 * Na inicialização completa, será baixado o repositório oficial do Laravel
 */
export const generateBasicLaravelProject = (): ProjectFile[] => {
  // Template inicial mínimo para exibir algo enquanto o download completo é feito
  return [
    {
      path: 'README.md',
      content: `# Projeto Laravel

Este projeto Laravel está sendo inicializado. O framework completo será baixado do repositório oficial.

## Baixando dependências...

Aguarde enquanto o template completo é baixado do repositório oficial do Laravel.
`
    },
    {
      path: '.init-laravel',
      content: 'true'
    }
  ];
};

/**
 * Verifica se um projeto Laravel precisa ser inicializado com o template completo
 */
export const shouldInitializeFullLaravelProject = (files: ProjectFile[]): boolean => {
  return files.some(file => file.path === '.init-laravel');
};

