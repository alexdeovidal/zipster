
import { ProjectFile } from '../fileTypes';

/**
 * Generates a Progressive Web App mobile-first project template
 * @returns Array of project files for a PWA mobile-first project
 */
export const generatePWAMobileProject = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# PWA Mobile-first Project

This is a Progressive Web App template with a mobile-first approach, including manifest, service worker, and push notifications.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start the dev server: \`npm run dev\`
3. Build for production: \`npm run build\`
4. Preview the production build: \`npm run preview\``
    }
  ];
};
