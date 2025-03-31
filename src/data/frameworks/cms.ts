
import { Framework } from '../framework-types';

export const cmsFrameworks: Framework[] = [
  {
    id: 'wordpress-theme',
    name: 'WordPress Custom Theme',
    description: 'Estrutura mínima com functions.php, style.css, templates e suporte a blocos.',
    stars: 4.5,
    tags: ['CMS', 'PHP', 'Themes'],
    logo: 'https://s.w.org/style/images/about/WordPress-logotype-standard.png',
    color: 'from-blue-500/20 to-blue-400/20',
    textColor: 'text-blue-400'
  },
  {
    id: 'wordpress-elementor',
    name: 'WordPress com Elementor',
    description: 'Geração de arquivos JSON para importação visual e criação facilitada.',
    stars: 4.6,
    tags: ['CMS', 'PHP', 'Visual Builder'],
    logo: 'https://s.w.org/style/images/about/WordPress-logotype-standard.png',
    color: 'from-pink-500/20 to-purple-400/20',
    textColor: 'text-pink-400'
  }
];
