// Map of framework identifiers to their specific instructions
const frameworkPrompts: Record<string, string> = {
  // Laravel
  'laravel': `
Use Laravel 12+ with Blade templates and modular, reusable structure.

- Views:
  - Use layouts/app.blade.php for master layout
  - Create components in views/components (e.g., header, footer, product-card)
  - Use @include and @yield/@section properly
- TailwindCSS:
  - Use via Laravel Breeze, Jetstream ou Vite (resources/css/app.css)
- Structure:
  - Pages: home, products, contact, about
  - Routes: web.php with named routes and groupings
  - Controllers: use proper resource controllers
  - Models: include fillables and relationships
  - Migrations: complete fields with nullable and defaults
  - Seeders: create dummy products and categories
- Public assets: store sample images in public/images
- Use responsive design and accessibility practices
`,

  'laravel-react': `
Use Laravel 12+ as backend and React (with Vite) as frontend using Inertia.js.
- React components in resources/js/Pages and components in resources/js/Components
- Routes in routes/web.php using Inertia::render
- Use Laravel as API/data layer with Eloquent models
- CSRF token and route helpers for API calls
- TailwindCSS and shadcn/ui for styling
- Use React Router only if needed
`,

  'laravel-vue': `
Use Laravel 12+ as backend and Vue 3 (with Vite) as frontend using Inertia.js.
- Vue components in resources/js/Pages and resources/js/Components
- Composition API with <script setup> and Pinia for state
- TailwindCSS for UI
- Routes in Laravel, rendered via Inertia
`,

  'laravel-livewire': `
Use Laravel 11+ with Livewire 3 and Alpine.js.
- Components in app/Livewire
- Views in resources/views/livewire
- Use wire:model, wire:click, wire:submit etc. for interactivity
- Use TailwindCSS and Flowbite/Alpine.js for UI
- Keep each Livewire component small and reusable
- Use Events and Lifecycle Hooks for advanced behavior
`,

  // WordPress
  'wordpress': `
Create a modern WordPress theme with support for the block editor.
- Use PHP and TailwindCSS
- Respect WordPress template hierarchy (index.php, single.php, etc.)
- Use functions.php for asset enqueuing
- Register custom post types and ACF fields if needed
- Use theme.json to define styles
`,

  'wordpress-elementor': `
Build custom Elementor-compatible templates or widgets.
- Use Elementor's API for registering widgets
- Export JSON templates with dynamic content support
- Use Tailwind or custom CSS in Elementor
- Focus on responsive layout and clean section structure
`,

  // React
  'react-vite': `
Use React 18+ with Vite and TypeScript.
- TailwindCSS and shadcn/ui for UI
- React Router DOM for navigation
- Framer Motion for animations
- Structure:
  - src/pages: for route-based views
  - src/components: reusable components
  - src/hooks: custom hooks
  - src/lib or src/utils: helpers/services
- Use .tsx files and ESLint/Prettier for code quality
- Focus on accessibility and responsiveness
`,

  // Vue
  'vue': `
Use Vue 3 with Vite and the Composition API.
- Structure:
  - src/views: main pages
  - src/components: shared components
  - src/stores: Pinia for state management
- Use TailwindCSS and auto-imported components
- .vue files with <script setup> and ref/reactive for reactivity
`,

  // Svelte
  'svelte': `
Use SvelteKit with TypeScript and TailwindCSS.
- Structure:
  - src/routes: route-based pages
  - src/lib: reusable components and logic
- Use reactive declarations ($:) and scoped styles
- Use the store API for global state
`,

  // Next.js
  'nextjs': `
Use Next.js 14+ with App Router and TypeScript.
- TailwindCSS and shadcn/ui for UI
- Structure:
  - app/: route and layout structure
  - components/: shared UI
  - lib/: utilities and services
- Use metadata API for SEO
- Handle server actions and client components properly
`,

  // Nuxt
  'nuxt': `
Use Nuxt 3 with TypeScript and TailwindCSS.
- Structure:
  - pages/: route-level components
  - components/: reusable UI
  - composables/: reusable logic
- Use runtimeConfig and nuxt modules like @nuxt/image
`,

  // WordPress basic
  'wordpress-theme': `
Create a WordPress theme with PHP and TailwindCSS.
- Template files: index.php, page.php, single.php, etc.
- Use get_template_part() for modular layout
- Use functions.php to register menus, widgets, and enqueue assets
- Apply ACF or Gutenberg blocks for dynamic content
`,

  // Fallback
  'html-css-js': `
Crie um site moderno, responsivo e visualmente atraente, inspirado no template "Stellar" da Cruip (https://preview.cruip.com/stellar/). Utilize apenas HTML, TailwindCSS (via CDN), Flowbite (via CDN) e JavaScript puro para interatividade mínima. Todos os ativos devem ser importados via CDN.

**Diretrizes de Design:**
- **Tema Escuro:** Adote uma paleta de cores escuras modernas, garantindo alto contraste entre o plano de fundo e o texto para legibilidade.
- **Componentes UI:** Utilize TailwindCSS com Flowbite para todos os componentes e layouts da interface.
- **Ícones:** Use Heroicons para todos os ícones, importados via CDN.
- **Tipografia:** Importe fontes modernas sem serifa, como "Poppins" ou "Inter", via Google Fonts (CDN).
- **Paleta de Cores Vibrantes:** Aplique gradientes utilizando as classes \`bg-gradient-to-r\`, \`from-*\` e \`to-*\` do TailwindCSS.
- **Estilo Moderno:** Implemente design com cantos arredondados, sombras (\`shadow-xl\`, \`drop-shadow\`), efeitos de hover vibrantes, transições sutis e animações.
- **Glassmorphism e Neumorphism:** Onde aplicável, utilize estilos de glassmorphism e neumorphism com \`backdrop-blur\`, \`bg-opacity\` e \`shadow-inner\`.
- **Caixas de Conteúdo:** Crie caixas de conteúdo visualmente atraentes com iconografia e botões de chamada para ação (CTA).

**Seções da Página a Incluir:**
1. **Cabeçalho/Navbar:** Navbar fixa no topo com logo, links de navegação e menu responsivo tipo "hamburger" utilizando Flowbite. Inclua um toggle para modos claro/escuro.
2. **Seção Hero:** Seção de largura total com gradiente de fundo, título impactante, subtítulo, botões CTA com ícones e uma ilustração SVG animada ou imagem.
3. **Seção de Recursos:** Grade de 3 a 6 cartões usando componentes do Flowbite. Cada cartão deve conter um ícone, título, descrição e efeito de hover (escala ou brilho).
4. **Seção Interativa:** Implemente um sistema de abas, cartões alternáveis ou acordeão de FAQ utilizando JavaScript puro em conjunto com Flowbite.
5. **Carrossel de Depoimentos:** Utilize o carrossel do Flowbite com avatares, nomes, citações e ícones de avaliação (estrelas).
6. **Planos de Preços:** Seção estilizada com 3 caixas (Básico, Pro, Empresarial), com fundos em gradiente, contrastes ricos e interações nos botões.
7. **Formulário de Contato:** Formulário estilizado com validação utilizando HTML5 e estilos do Flowbite. Inclua campos para e-mail, nome, mensagem e um botão de envio com indicador de carregamento.
8. **Rodapé:** Rodapé responsivo com 4 colunas (Sobre, Links, Serviços, Mídias Sociais) com animações de hover nos ícones.

**Requisitos Técnicos:**
- **Efeitos e Transições:** Utilize classes como \`transition\`, \`hover:scale\`, \`hover:bg-opacity\` e \`duration-300\` para transições suaves.
- **Animações de Rolagem:** Implemente pelo menos uma seção com animação de parallax ou acionada por rolagem utilizando JavaScript básico.
- **Acessibilidade:** Garanta acessibilidade utilizando atributos \`aria\`, contraste adequado e tamanhos de fonte legíveis.
- **Qualidade do Código:** O código deve ser HTML5 válido, bem indentado, pronto para copiar e colar, e contido em um único arquivo \`.html\`.

**Observações Adicionais:**
- **Paleta de Cores e Contraste:** Preste atenção especial à paleta de cores e ao contraste entre o plano de fundo e o texto para garantir uma experiência de leitura confortável.
- **Inspiração:** O design deve refletir a estética moderna e escura do template "Stellar" da Cruip, adaptando-se às necessidades específicas do projeto.

`,
};

/**
 * Returns specific prompt instructions for a given framework
 * @param framework The framework identifier
 * @returns String containing framework-specific instructions
 */
export function getFrameworkPrompt(framework: string): string {
  // Check full key
  if (frameworkPrompts[framework]) {
    return frameworkPrompts[framework];
  }

  // Fallback to base key (e.g. laravel-react → laravel)
  const base = framework.split('-')[0];
  if (frameworkPrompts[base]) {
    return frameworkPrompts[base];
  }

  // Default
  return `
Use modern development practices based on the chosen framework.
Focus on clean architecture, reusable components, responsiveness, accessibility, and performance.
Use TypeScript when possible and TailwindCSS for styling.
`;
}
