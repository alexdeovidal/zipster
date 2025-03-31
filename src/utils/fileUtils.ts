
/**
 * Central export file for all file utilities
 */

// Re-export types
export * from './fileTypes';

// Re-export utilities
export * from './downloadUtils';

// Re-export templates manager
export * from './templatesManager';

// Re-export individual templates for direct access if needed
export * from './templates/reactTemplate';
export * from './templates/laravelTemplate';
export * from './templates/emptyTemplate';
export * from './templates/goTemplate';
export * from './templates/bunTemplate';
export * from './templates/fastApiTemplate';

// Mobile templates
export * from './templates/reactNativeExpoTemplate';
export * from './templates/flutterTemplate';
export * from './templates/capacitorVueTemplate';
export * from './templates/kotlinMultiplatformTemplate';
export * from './templates/swiftUITemplate';
export * from './templates/jetpackComposeTemplate';
export * from './templates/pwaMobileTemplate';

/**
 * Transforms a flat list of files into a hierarchical tree
 */
export const getFileTree = (files: { path: string; name?: string }[]) => {
  const tree: any[] = [];
  const directories: { [key: string]: any } = {
    '': { name: '', path: '', isDirectory: true, children: [] }
  };

  files.forEach(file => {
    const pathParts = file.path.split('/');
    let currentPath = '';

    for (let i = 0; i < pathParts.length - 1; i++) {
      const segment = pathParts[i];
      currentPath = currentPath ? `${currentPath}/${segment}` : segment;
      
      if (!directories[currentPath]) {
        directories[currentPath] = {
          name: segment,
          path: currentPath,
          isDirectory: true,
          children: []
        };
      }
    }
  });

  files.forEach(file => {
    const pathParts = file.path.split('/');
    const fileName = pathParts.pop() || file.name || file.path;
    const dirPath = pathParts.join('/');
    
    const fileNode = {
      name: fileName,
      path: file.path,
      isDirectory: false
    };
    
    if (directories[dirPath]) {
      if (!directories[dirPath].children) {
        directories[dirPath].children = [];
      }
      directories[dirPath].children.push(fileNode);
    } else if (dirPath === '') {
      tree.push(fileNode);
    }
  });

  for (const dirPath in directories) {
    if (dirPath === '') continue;
    
    const pathParts = dirPath.split('/');
    const dirName = pathParts.pop();
    const parentPath = pathParts.join('/');
    
    if (parentPath === '') {
      tree.push(directories[dirPath]);
    } else if (directories[parentPath]) {
      if (!directories[parentPath].children) {
        directories[parentPath].children = [];
      }
      directories[parentPath].children.push(directories[dirPath]);
    }
  }

  const sortItems = (items: any[]): any[] => {
    return items.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    }).map(item => {
      if (item.children) {
        item.children = sortItems(item.children);
      }
      return item;
    });
  };

  return sortItems(tree);
};
