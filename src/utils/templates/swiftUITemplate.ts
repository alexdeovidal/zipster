
import { ProjectFile } from '../fileTypes';

/**
 * Generates a SwiftUI project template
 * @returns Array of project files for a SwiftUI project
 */
export const generateSwiftUIProject = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# SwiftUI Project

This is a SwiftUI project template for modern iOS development with @State, @Binding, and MVVM architecture.

## Getting Started

1. Open the .xcodeproj file in Xcode
2. Select your target device or simulator
3. Build and run the project`
    }
  ];
};
