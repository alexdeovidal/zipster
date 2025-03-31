
import { Framework } from '../framework-types';

export const frontendFrameworks: Framework[] = [
  {
    id: 'react-vite',
    name: 'React 18 + Vite',
    description: 'Moderna stack com TypeScript, TailwindCSS, ShadCN UI, Lucide, React Hook Form, Zod, Framer Motion.',
    stars: 4.9,
    tags: ['Frontend', 'JavaScript', 'SPA'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
    color: 'from-blue-500/20 to-cyan-400/20',
    textColor: 'text-blue-400'
  },
  {
    id: 'vue3-vite',
    name: 'Vue 3 + Vite',
    description: 'Framework progressivo com TypeScript, Pinia, TailwindCSS, Vue Router e Composition API.',
    stars: 4.7,
    tags: ['Frontend', 'JavaScript', 'SPA'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png',
    color: 'from-green-500/20 to-teal-400/20',
    textColor: 'text-green-400'
  },
  {
    id: 'sveltekit',
    name: 'Svelte + SvelteKit',
    description: 'Framework para projetos rápidos, leves e ultra-performáticos com abordagem compilada.',
    stars: 4.8,
    tags: ['Frontend', 'JavaScript', 'SSR'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/1200px-Svelte_Logo.svg.png',
    color: 'from-orange-500/20 to-red-400/20',
    textColor: 'text-orange-400'
  },
  {
    id: 'astro',
    name: 'Astro',
    description: 'Framework para sites estáticos e conteúdo como blogs, documentação e landing pages.',
    stars: 4.6,
    tags: ['Frontend', 'JavaScript', 'Static'],
    logo: 'https://astro.build/assets/press/astro-icon-light-gradient.svg',
    color: 'from-purple-500/20 to-blue-400/20',
    textColor: 'text-purple-400'
  },
  {
    id: 'html-css-js',
    name: 'HTML + CSS + JS',
    description: 'Desenvolvimento web front-end com as tecnologias fundamentais da web.',
    stars: 4.5,
    tags: ['Frontend', 'Básico', 'Web'],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1200px-HTML5_logo_and_wordmark.svg.png',
    color: 'from-orange-500/20 to-red-400/20',
    textColor: 'text-orange-400'
  }
];
