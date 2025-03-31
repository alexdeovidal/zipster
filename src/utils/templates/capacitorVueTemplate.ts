
import { ProjectFile } from '../fileTypes';

/**
 * Generates a Capacitor + Vue 3 project template
 * @returns Array of project files for a Capacitor + Vue 3 project
 */
export const generateCapacitorVueProject = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# Capacitor + Vue 3 Project

This is a Vue 3 project with Ionic Framework and Capacitor integration for hybrid mobile app development.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start the dev server: \`npm run dev\`
3. Build for production: \`npm run build\`
4. Add mobile platforms: \`npx cap add android\` or \`npx cap add ios\`
5. Sync changes: \`npx cap sync\`
6. Open in IDE: \`npx cap open android\` or \`npx cap open ios\``
    }
  ];
};
