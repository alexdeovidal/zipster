
import React from 'react';
import { useProjectCreator } from '@/hooks/useProjectCreator';
import { useProjectSelector } from '@/hooks/useProjectSelector';
import ProjectHeader from './project/ProjectHeader';
import ProjectNameInput from './project/ProjectNameInput';
import ProjectSearch from './project/ProjectSearch';
import CategoryTabs from './project/CategoryTabs';
import FrameworksView from './project/FrameworksView';
import CreateProjectButton from './project/CreateProjectButton';
import { Framework } from '@/data/framework-types';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectSelectorProps {
  frameworks: Framework[];
}

const ITEMS_PER_PAGE = 6;

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ frameworks: initialFrameworks }) => {
  const { createProject, isCreating } = useProjectCreator();
  const isMobile = useIsMobile();
  
  const {
    selectedFramework,
    projectName,
    setProjectName,
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
    hasMoreFrameworks
  } = useProjectSelector({ 
    itemsPerPage: ITEMS_PER_PAGE,
    initialFrameworks
  });

  const handleCreateProject = async () => {
    if (!selectedFramework) {
      return;
    }
    
    await createProject(projectName, selectedFramework);
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col gap-8">
      <ProjectHeader />
      
      <div className="flex flex-col gap-4">
        <ProjectNameInput 
          projectName={projectName}
          onChange={setProjectName}
        />
        
        <ProjectSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Escolha uma tecnologia</h2>
        </div>
        
        <CategoryTabs 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <FrameworksView 
          isLoading={isLoading}
          filteredFrameworks={filteredFrameworks}
          displayedFrameworks={displayedFrameworks}
          selectedFramework={selectedFramework}
          onSelectFramework={handleSelectFramework}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          loadMore={loadMore}
          hasMoreFrameworks={hasMoreFrameworks}
          searchQuery={searchQuery}
        />
      </div>
      
      <div>
        <CreateProjectButton 
          onClick={handleCreateProject}
          disabled={!selectedFramework}
          isCreating={isCreating}
        />
      </div>
    </div>
  );
};

export default ProjectSelector;
