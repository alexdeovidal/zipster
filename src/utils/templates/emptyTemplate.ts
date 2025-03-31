
import { ProjectFile } from '../fileTypes';

/**
 * Generates an empty project with just a README file
 */
export const generateEmptyProject = (): ProjectFile[] => {
  // Projeto vazio, apenas com um README
  return [
    {
      path: 'README.md',
      content: `# Novo Projeto

Este é um novo projeto vazio.

Descreva seu projeto para o assistente AI e ele criará os arquivos necessários para você.`
    }
  ];
};
