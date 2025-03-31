
import { ProjectFile } from '../fileTypes';

/**
 * Generates a Kotlin Multiplatform Mobile project template
 * @returns Array of project files for a KMM project
 */
export const generateKotlinMultiplatformProject = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# Kotlin Multiplatform Mobile Project

This is a Kotlin Multiplatform Mobile project template for native Android and iOS development with shared business logic.

## Getting Started

1. Open the project in Android Studio or IntelliJ IDEA
2. For Android: Run the androidApp configuration
3. For iOS: Open the iosApp.xcworkspace file in Xcode and run`
    }
  ];
};
