
/**
 * Funções utilitárias para validação e correção de extensões de arquivos
 */

/**
 * Valida e corrige extensões de arquivo para o framework selecionado
 * @param file Arquivo gerado pela IA
 * @param framework Framework do projeto
 * @returns Arquivo com extensões corrigidas
 */
export function validateFileExtension(file: any, framework: string) {
  const fileNameParts = file.path.split('.');
  const currentExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
  let newPath = file.path;
  let newLanguage = file.language;
  
  // Laravel com React/Vue utiliza Inertia.js (sem .blade.php para componentes React/Vue)
  if (framework.includes('laravel') && (currentExtension === 'tsx' || currentExtension === 'jsx')) {
    // Verificar se o caminho já está em resources/js
    if (!file.path.includes('resources/js')) {
      if (framework.includes('react')) {
        // Para Laravel + React com Inertia
        if (file.path.includes('page') || file.path.includes('Page')) {
          newPath = `resources/js/Pages/${file.path.split('/').pop()}`;
        } else if (file.path.includes('component') || file.path.includes('Component')) {
          newPath = `resources/js/Components/${file.path.split('/').pop()}`;
        } else if (file.path.includes('layout') || file.path.includes('Layout')) {
          newPath = `resources/js/Layouts/${file.path.split('/').pop()}`;
        } else {
          newPath = `resources/js/Components/${file.path.split('/').pop()}`;
        }
      } else if (framework.includes('vue')) {
        // Converter para .vue para Laravel + Vue com Inertia
        const basePath = file.path.replace(/\.(tsx|jsx)$/, '.vue');
        if (file.path.includes('page') || file.path.includes('Page')) {
          newPath = `resources/js/Pages/${basePath.split('/').pop()}`;
        } else if (file.path.includes('layout') || file.path.includes('Layout')) {
          newPath = `resources/js/Layouts/${basePath.split('/').pop()}`;
        } else {
          newPath = `resources/js/Components/${basePath.split('/').pop()}`;
        }
        newLanguage = 'vue';
      } else if (framework.includes('livewire')) {
        // Para Livewire, converter para .blade.php ou componente PHP
        if (file.path.includes('view') || file.path.includes('View')) {
          newPath = `resources/views/livewire/${file.path.replace(/\.(tsx|jsx)$/, '.blade.php').split('/').pop()}`;
          newLanguage = 'php';
        } else {
          newPath = `app/Livewire/${file.path.replace(/\.(tsx|jsx)$/, '.php').split('/').pop()}`;
          newLanguage = 'php';
        }
      } else {
        // Laravel tradicional sem especificação, usar .blade.php
        newPath = file.path.replace(/\.(tsx|jsx)$/, '.blade.php');
        newLanguage = 'php';
      }
    }
  }
  
  // WordPress e HTML/CSS/JS não devem usar .tsx ou .jsx
  if ((framework.includes('wordpress') || framework.includes('html')) && 
      (currentExtension === 'tsx' || currentExtension === 'jsx')) {
    // Para WordPress, converter para .php
    if (framework.includes('wordpress')) {
      newPath = file.path.replace(/\.(tsx|jsx)$/, '.php');
      newLanguage = 'php';
    }
    // Para HTML, converter para .html, .css ou .js dependendo do contexto
    else if (framework.includes('html')) {
      // Determinar se é um componente de estrutura, estilo ou comportamento
      if (file.path.includes('component') || file.path.includes('page')) {
        newPath = file.path.replace(/\.(tsx|jsx)$/, '.html');
        newLanguage = 'html';
      } else if (file.path.includes('style')) {
        newPath = file.path.replace(/\.(tsx|jsx)$/, '.css');
        newLanguage = 'css';
      } else {
        newPath = file.path.replace(/\.(tsx|jsx)$/, '.js');
        newLanguage = 'js';
      }
    }
  }
  
  // Python deve ter arquivos .py
  if (framework.includes('python') && (currentExtension === 'tsx' || currentExtension === 'jsx')) {
    // Se o caminho sugere que é uma view ou template, convertê-lo para HTML
    if (file.path.includes('template') || file.path.includes('html')) {
      newPath = file.path.replace(/\.(tsx|jsx)$/, '.html');
      newLanguage = 'html';
    } else {
      newPath = file.path.replace(/\.(tsx|jsx)$/, '.py');
      newLanguage = 'python';
    }
  }
  
  return { 
    ...file, 
    path: newPath,
    language: newLanguage
  };
}

/**
 * Gera descrições padronizadas para arquivos com base no nome e tipo
 * @param filePath Caminho do arquivo
 * @param language Linguagem/extensão do arquivo
 * @returns Descrição gerada para o arquivo
 */
export function getFileDescription(filePath: string, language: string) {
  const fileName = filePath.split('/').pop() || '';
  
  if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
    if (filePath.includes('resources/js/Pages')) {
      return "Página React com Inertia.js para Laravel";
    } else if (filePath.includes('resources/js/Components')) {
      return "Componente React para Laravel com Inertia.js";
    } else if (filePath.includes('resources/js/Layouts')) {
      return "Layout React para Laravel com Inertia.js";
    } else {
      return "Componente React";
    }
  } else if (fileName.endsWith('.vue')) {
    if (filePath.includes('resources/js/Pages')) {
      return "Página Vue com Inertia.js para Laravel";
    } else if (filePath.includes('resources/js/Components')) {
      return "Componente Vue para Laravel com Inertia.js";
    } else if (filePath.includes('resources/js/Layouts')) {
      return "Layout Vue para Laravel com Inertia.js";
    } else {
      return "Componente Vue";
    }
  } else if (fileName.endsWith('.ts') || fileName.endsWith('.js')) {
    if (fileName.includes('service')) {
      return "Serviço para integração com API";
    } else if (fileName.includes('util')) {
      return "Funções de utilidade";
    } else if (fileName.includes('hook')) {
      return "Hook personalizado";
    } else if (fileName.includes('context')) {
      return "Contexto para gerenciamento de estado";
    } else if (filePath.includes('resources/js')) {
      return "Script JavaScript para Laravel";
    } else {
      return "Arquivo JavaScript/TypeScript";
    }
  } else if (fileName.endsWith('.css') || fileName.endsWith('.scss')) {
    return "Estilos CSS";
  } else if (fileName.endsWith('.html')) {
    return "Página HTML";
  } else if (fileName.endsWith('.php')) {
    if (filePath.includes('app/Livewire')) {
      return "Componente Livewire";
    } else if (fileName.includes('controller')) {
      return "Controlador Laravel";
    } else if (fileName.endsWith('.blade.php')) {
      return "Template Blade Laravel";
    } else if (filePath.includes('routes')) {
      return "Rotas Laravel";
    } else {
      return "Arquivo PHP";
    }
  } else if (fileName.endsWith('.py')) {
    if (fileName.includes('views')) {
      return "View Django";
    } else if (fileName.includes('models')) {
      return "Modelo Django";
    } else if (fileName.includes('urls')) {
      return "URLs Django";
    } else {
      return "Script Python";
    }
  } else {
    return "Arquivo para o projeto";
  }
}
