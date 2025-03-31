
import { ProjectFile } from '../fileTypes';

/**
 * Generates a Jetpack Compose project template
 * @returns Array of project files for a Jetpack Compose project
 */
export const generateJetpackComposeProject = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# Jetpack Compose Project

This is a Jetpack Compose project template for modern Android development with declarative UI and MVVM architecture.

## Getting Started

1. Open the project in Android Studio
2. Sync Gradle files
3. Run the app on an emulator or connected device`
    }
  ];
};
