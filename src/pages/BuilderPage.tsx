
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBuilderPage } from '@/hooks/useBuilderPage';
import BuilderLayout from '@/components/builder/BuilderLayout';

const BuilderPage = () => {
  const {
    projectId,
    project,
    handleDownloadZip,
    handleGithubConnect,
    isGithubModalOpen,
    setIsGithubModalOpen,
    handleGithubOAuth,
    isSupabaseConnected,
    isSupabaseModalOpen,
    setIsSupabaseModalOpen,
    supabaseProjectId,
    files,
    currentFile,
    refreshPreview,
    handleChangeFile,
    handleUpdateFileContent,
    messages,
    loading,
    handleSendPrompt,
    applyGeneratedFiles,
    handleSendCustomPrompt,
    handleSupabaseSuccess,
    // GitHub sync related
    isSyncing,
    hasExternalChanges,
    handlePullChanges,
    // Template related
    handleLoadTemplate,
    // ZIP upload related
    handleUploadZip,
    isUploadingZip
  } = useBuilderPage();
  
  // Redirect if no projectId
  if (!projectId) {
    return <Navigate to="/" />;
  }

  const handleSupabaseConnect = () => {
    setIsSupabaseModalOpen(true);
  };
  
  return (
    <BuilderLayout
      projectId={projectId}
      project={{
        name: project.name,
        githubUrl: project.githubUrl,
        framework: project.framework
      }}
      projectHeader={{
        onDownloadZip: handleDownloadZip,
        onGithubConnect: handleGithubConnect,
        isSupabaseConnected,
        onSupabaseConnect: handleSupabaseConnect,
        supabaseProjectId,
        onLoadTemplate: handleLoadTemplate,
        // GitHub sync related
        isSyncing,
        hasExternalChanges,
        onPullChanges: handlePullChanges,
        // ZIP upload related
        onUploadZip: handleUploadZip,
        isUploadingZip
      }}
      workspace={{
        files,
        currentFile,
        messages,
        loading,
        refreshPreview,
        onChangeFile: handleChangeFile,
        onUpdateFileContent: handleUpdateFileContent,
        onSendPrompt: handleSendPrompt,
        onApplyGeneratedFiles: applyGeneratedFiles
      }}
      modals={{
        github: {
          isOpen: isGithubModalOpen,
          onOpenChange: setIsGithubModalOpen,
          onConnect: handleGithubOAuth
        },
        supabase: {
          isOpen: isSupabaseModalOpen,
          onOpenChange: setIsSupabaseModalOpen,
          onSuccess: handleSupabaseSuccess,
          onSendPrompt: handleSendCustomPrompt
        }
      }}
    />
  );
};

export default BuilderPage;
