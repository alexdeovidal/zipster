import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Layout, 
  Database, 
  Globe, 
  Paintbrush, 
  BookOpen, 
  Code, 
  Terminal,
  Cpu,
  Brain,
  Layers,
  Sparkles,
  PanelLeft,
  Bot,
  Cloud,
  ChevronRight
} from 'lucide-react';
import { Framework } from '@/data/framework-types';

interface FeaturesSectionProps {
  frameworks: Framework[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ frameworks }) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="mt-20 mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-full bg-brand-purple/20">
            <Cpu className="h-6 w-6 text-brand-purple" />
          </div>
          <h2 className="text-xl font-semibold text-brand-purple">TECNOLOGIAS AVANÇADAS</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="feature-card bg-gradient-to-br from-blue-500/10 to-blue-400/5 backdrop-blur-sm border border-blue-400/20 p-6 rounded-xl">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-brand-blue/20 mb-4">
              <Layout className="h-6 w-6 text-brand-blue" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-left">Frontend Moderno</h3>
            <p className="text-white/70 text-left">
              React, Vue, Svelte e mais para criar interfaces responsivas e interativas com design de última geração.
            </p>
          </div>
          
          <div className="feature-card bg-gradient-to-br from-green-500/10 to-green-400/5 backdrop-blur-sm border border-green-400/20 p-6 rounded-xl">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-brand-green/20 mb-4">
              <Database className="h-6 w-6 text-brand-green" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-left">Backend Robusto</h3>
            <p className="text-white/70 text-left">
              APIs com FastAPI, NestJS, Laravel e Go. Integrações com bancos de dados e serviços cloud prontos para uso.
            </p>
          </div>

          <div className="feature-card bg-gradient-to-br from-purple-500/10 to-purple-400/5 backdrop-blur-sm border border-purple-400/20 p-6 rounded-xl">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-brand-purple/20 mb-4">
              <Globe className="h-6 w-6 text-brand-purple" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-left">Full-Stack Completo</h3>
            <p className="text-white/70 text-left">
              Soluções integradas com Next.js, Nuxt, Laravel+React/Vue para aplicações completas de ponta a ponta.
            </p>
          </div>
          
          <div className="feature-card bg-gradient-to-br from-pink-500/10 to-pink-400/5 backdrop-blur-sm border border-pink-400/20 p-6 rounded-xl">
            <div className="rounded-full w-12 h-12 flex items-center justify-center bg-brand-green/20 mb-4">
              <Paintbrush className="h-6 w-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-left">CMS Avançado</h3>
            <p className="text-white/70 text-left">
              WordPress com temas customizados, integrações com Elementor e sistemas de gestão de conteúdo otimizados.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-20 mb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-full bg-brand-purple/20">
            <Brain className="h-6 w-6 text-brand-purple" />
          </div>
          <h2 className="text-xl font-semibold text-brand-purple">INTELIGÊNCIA ARTIFICIAL AVANÇADA</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 p-8 rounded-xl">
            <Sparkles className="h-10 w-10 text-brand-purple mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-left">Prompts para Desenvolvimento</h3>
            <p className="text-white/80 text-left mb-4 leading-relaxed">
              Simplesmente descreva o que você precisa criar e nossa IA especializada em desenvolvimento 
              web transformará suas ideias em código limpo e funcional.
            </p>
            <ul className="space-y-3 text-left">
              <li className="flex items-start gap-2">
                <Bot className="h-5 w-5 text-brand-blue mt-0.5" />
                <span className="text-white/70">Entende contexto e requisitos de negócio</span>
              </li>
              <li className="flex items-start gap-2">
                <PanelLeft className="h-5 w-5 text-brand-blue mt-0.5" />
                <span className="text-white/70">Gera layouts responsivos automaticamente</span>
              </li>
              <li className="flex items-start gap-2">
                <Layers className="h-5 w-5 text-brand-blue mt-0.5" />
                <span className="text-white/70">Cria componentes reutilizáveis e lógica de negócio</span>
              </li>
              <li className="flex items-start gap-2">
                <Cloud className="h-5 w-5 text-brand-blue mt-0.5" />
                <span className="text-white/70">Implementa integrações com APIs e serviços</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 bg-brand-blue/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-sm text-white/70 ml-2">terminal</span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 text-brand-purple mb-4">
                <Terminal className="h-5 w-5" />
                <span className="text-sm font-mono">zipster-builder &gt;</span>
              </div>
              <div className="space-y-3 text-sm font-mono text-left">
                <p className="text-white/90">
                  <span className="text-brand-green">user &gt;</span> Crie um site e-commerce para vender produtos artesanais
                </p>
                <p className="text-white/70">
                  <span className="text-brand-blue">ai &gt;</span> Gerando projeto com React e Supabase...
                </p>
                <p className="text-white/70">
                  <span className="text-brand-blue">ai &gt;</span> Criando componentes: Header, ProductGrid, Cart...
                </p>
                <p className="text-white/70">
                  <span className="text-brand-blue">ai &gt;</span> Configurando banco de dados e autenticação...
                </p>
                <p className="text-white/70">
                  <span className="text-brand-blue">ai &gt;</span> Implementando checkout seguro...
                </p>
                <p className="text-brand-purple">
                  <span className="text-brand-blue">ai &gt;</span> Projeto gerado com sucesso! Visualize na prévia ao lado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6 mt-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-full bg-brand-purple/20">
            <BookOpen className="h-6 w-6 text-brand-purple" />
          </div>
          <h2 className="text-xl font-semibold text-brand-purple">RECURSOS DISPONÍVEIS</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/docs')} 
            className="flex items-center justify-center gap-2 py-6 rounded-md bg-white/5 backdrop-blur-sm hover:bg-white/10 border-white/10 group"
          >
            <BookOpen className="h-5 w-5 text-brand-purple" />
            <span>Documentação</span>
            <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/frameworks')} 
            className="flex items-center justify-center gap-2 py-6 rounded-md bg-white/5 backdrop-blur-sm hover:bg-white/10 border-white/10 group"
          >
            <Code className="h-5 w-5 text-brand-blue" />
            <span>Frameworks</span>
            <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/terminal')} 
            className="flex items-center justify-center gap-2 py-6 rounded-md bg-white/5 backdrop-blur-sm hover:bg-white/10 border-white/10 group"
          >
            <Terminal className="h-5 w-5 text-brand-green" />
            <span>Terminal</span>
            <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3 mt-16">
        {frameworks.map(framework => (
          <span 
            key={framework.id} 
            className="bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-sm animate-float flex items-center gap-1"
          >
            <span className={`w-2 h-2 rounded-full ${framework.textColor.replace('text-', 'bg-')}`}></span>
            {framework.name}
          </span>
        ))}
      </div>
    </>
  );
};

export default FeaturesSection;
