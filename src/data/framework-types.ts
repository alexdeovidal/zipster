
export interface Framework {
  id: string;
  name: string;
  description: string;
  stars: number;
  tags: string[];
  logo: string;
  color: string;
  textColor: string;
}

export type FrameworkCategory = 'all' | 'frontend' | 'backend' | 'fullstack' | 'cms' | 'mobile';

// Categories mapping for frameworks
export const categoryMap: Record<string, FrameworkCategory> = {
  // Frontend
  'react-vite': 'frontend',
  'vue3-vite': 'frontend',
  'sveltekit': 'frontend',
  'astro': 'frontend',
  'html-css-js': 'frontend',
  
  // Backend
  'fastapi-python': 'backend',
  'nestjs': 'backend',
  'golang': 'backend',
  'laravel': 'backend',
  'bun': 'backend',
  
  // Fullstack
  'nextjs14': 'fullstack',
  'nuxt3': 'fullstack',
  'laravel-livewire': 'fullstack',
  'laravel-react': 'fullstack',
  'laravel-vue': 'fullstack',
  
  // CMS
  'wordpress-theme': 'cms',
  'wordpress-elementor': 'cms',
  
  // Mobile
  'react-native-expo': 'mobile',
  'flutter': 'mobile',
  'capacitor-vue': 'mobile',
  'kotlin-multiplatform': 'mobile',
  'swiftui': 'mobile',
  'jetpack-compose': 'mobile',
  'pwa-mobile': 'mobile',
};
