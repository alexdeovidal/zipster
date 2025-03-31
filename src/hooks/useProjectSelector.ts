
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Framework } from '@/data/framework-types';
import { 
  frontendFrameworks, 
  backendFrameworks, 
  fullstackFrameworks, 
  cmsFrameworks, 
  mobileFrameworks,
  allFrameworks
} from '@/data/frameworksData';
import { FrameworkCategory, categoryMap } from '@/data/framework-types';

export type { FrameworkCategory };

export interface UseProjectSelectorOptions {
  itemsPerPage?: number;
  initialFrameworks?: Framework[];
}

export function useProjectSelector({ 
  itemsPerPage = 6,
  initialFrameworks = []
}: UseProjectSelectorOptions = {}) {
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('Meu Projeto');
  const [selectedCategory, setSelectedCategory] = useState<FrameworkCategory>('all');
  const [activeTab, setActiveTab] = useState<FrameworkCategory>('all');
  const [filteredFrameworks, setFilteredFrameworks] = useState<Framework[]>([]);
  const [displayedFrameworks, setDisplayedFrameworks] = useState<Framework[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    
    let results: Framework[] = [];
    
    if (selectedCategory === 'all') {
      results = allFrameworks;
    } else {
      results = allFrameworks.filter(framework => 
        categoryMap[framework.id] === selectedCategory
      );
    }
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(framework => 
        framework.name.toLowerCase().includes(query) || 
        framework.description.toLowerCase().includes(query) ||
        (framework.tags && framework.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    setFilteredFrameworks(results);
    setCurrentPage(1);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedFrameworks(filteredFrameworks.slice(startIndex, endIndex));
  }, [filteredFrameworks, currentPage, itemsPerPage]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const frameworkId = searchParams.get('framework');
    
    if (frameworkId && allFrameworks.some(f => f.id === frameworkId)) {
      setSelectedFramework(frameworkId);
      
      const category = categoryMap[frameworkId] || 'all';
      setSelectedCategory(category);
      setActiveTab(category);
    } else if (initialFrameworks.length === 1) {
      setSelectedFramework(initialFrameworks[0].id);
    }
  }, [location.search, initialFrameworks]);

  const handleSelectFramework = (frameworkId: string) => {
    setSelectedFramework(frameworkId);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as FrameworkCategory);
    setSelectedCategory(value as FrameworkCategory);
  };

  const loadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const hasMoreFrameworks = filteredFrameworks.length > displayedFrameworks.length;

  return {
    selectedFramework,
    setSelectedFramework,
    projectName,
    setProjectName,
    selectedCategory,
    activeTab,
    filteredFrameworks,
    displayedFrameworks,
    searchQuery,
    setSearchQuery,
    isLoading,
    currentPage,
    setCurrentPage,
    handleSelectFramework,
    handleTabChange,
    loadMore,
    hasMoreFrameworks,
    allFrameworks
  };
}
