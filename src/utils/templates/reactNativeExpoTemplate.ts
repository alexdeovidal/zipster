
import { ProjectFile } from '../fileTypes';

/**
 * Generates a React Native with Expo project template
 * @returns Array of project files for a React Native with Expo project
 */
export const generateReactNativeExpoProject = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# React Native with Expo Project

This is a React Native with Expo project template for mobile development. Built with TypeScript, NativeWind (TailwindCSS for React Native), React Navigation, and state management.

## Getting Started

1. Install dependencies: \`npm install\`
2. Start the development server: \`npm start\` or \`npx expo start\`
3. Use the Expo Go app on your device to scan the QR code, or press 'a' for Android emulator or 'i' for iOS simulator.`
    },
    {
      path: 'App.tsx',
      content: `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome' }} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}`
    },
    {
      path: 'src/screens/HomeScreen.tsx',
      content: `import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native App</Text>
      <Text style={styles.subtitle}>Built with Expo and TypeScript</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
});`
    }
  ];
};
