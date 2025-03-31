
import { ProjectFile } from './fileTypes';
import { generateBasicReactProject } from './templates/reactTemplate';
import { generateBasicLaravelProject } from './templates/laravelTemplate';
import { generateEmptyProject } from './templates/emptyTemplate';
import { generateGoProject } from './templates/goTemplate';
import { generateBunProject } from './templates/bunTemplate';
import { generateFastAPIProject } from './templates/fastApiTemplate';
import { generateReactNativeExpoProject } from './templates/reactNativeExpoTemplate';
import { generateFlutterProject } from './templates/flutterTemplate';
import { generateCapacitorVueProject } from './templates/capacitorVueTemplate';
import { generateKotlinMultiplatformProject } from './templates/kotlinMultiplatformTemplate';
import { generateSwiftUIProject } from './templates/swiftUITemplate';
import { generateJetpackComposeProject } from './templates/jetpackComposeTemplate';
import { generatePWAMobileProject } from './templates/pwaMobileTemplate';

// Placeholder implementations for missing templates
const generateVue3Project = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# Vue 3 Project

This is a Vue 3 project template. Additional files will be added in a future update.`
    }
  ];
};

const generateNextJsProject = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# Next.js Project

This is a Next.js project template. Additional files will be added in a future update.`
    }
  ];
};

const generateNuxt3Project = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# Nuxt 3 Project

This is a Nuxt 3 project template. Additional files will be added in a future update.`
    }
  ];
};

const generateSvelteKitProject = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# SvelteKit Project

This is a SvelteKit project template. Additional files will be added in a future update.`
    }
  ];
};

const generateAstroProject = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# Astro Project

This is an Astro project template. Additional files will be added in a future update.`
    }
  ];
};

const generateWordPressThemeProject = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# WordPress Theme Project

This is a WordPress theme project template. Additional files will be added in a future update.`
    }
  ];
};

const generateWordPressElementorProject = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# WordPress Elementor Project

This is a WordPress Elementor project template. Additional files will be added in a future update.`
    }
  ];
};

const generateNestJSProject = (): ProjectFile[] => {
  return [
    {
      path: 'README.md',
      content: `# NestJS Project

This is a NestJS project template. Additional files will be added in a future update.`
    }
  ];
};

/**
 * Selects and returns the appropriate project template based on framework
 * @param framework The framework identifier for the project
 * @returns Array of project files for the selected template
 */
export const getProjectTemplateByFramework = (framework: string): ProjectFile[] => {
  // Seleciona o template apropriado com base no framework
  switch (framework) {
    case 'react-vite':
      return generateBasicReactProject();
    case 'vue3-vite':
      return generateVue3Project();
    case 'nextjs14':
      return generateNextJsProject();
    case 'nuxt3':
      return generateNuxt3Project();
    case 'sveltekit':
      return generateSvelteKitProject();
    case 'astro':
      return generateAstroProject();
    case 'wordpress-theme':
      return generateWordPressThemeProject();
    case 'wordpress-elementor':
      return generateWordPressElementorProject();
    case 'fastapi-python':
      return generateFastAPIProject();
    case 'nestjs':
      return generateNestJSProject();
    case 'golang':
      return generateGoProject();
    case 'bun':
      return generateBunProject();
    case 'laravel':
      return generateBasicLaravelProject();
    case 'laravel-livewire':
      return generateBasicLaravelProject();
    case 'laravel-react':
    case 'laravel-vue':
      // Para Laravel com React/Vue via Inertia.js, usamos o mesmo template base
      return generateBasicLaravelProject();
    case 'html-css-js':
      // Para um projeto HTML/CSS/JS básico
      return generateEmptyProject();
    // Mobile frameworks
    case 'react-native-expo':
      return generateReactNativeExpoProject();
    case 'flutter':
      return generateFlutterProject();
    case 'capacitor-vue':
      return generateCapacitorVueProject();
    case 'kotlin-multiplatform':
      return generateKotlinMultiplatformProject();
    case 'swiftui':
      return generateSwiftUIProject();
    case 'jetpack-compose':
      return generateJetpackComposeProject();
    case 'pwa-mobile':
      return generatePWAMobileProject();
    default:
      // Projeto vazio para outros frameworks ou quando não especificado
      return generateEmptyProject();
  }
};
