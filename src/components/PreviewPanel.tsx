
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PreviewPanelProps {
  projectFiles: {
    path: string;
    content: string;
  }[];
  refreshPreview: number;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ projectFiles, refreshPreview }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    updatePreview();
  }, [refreshPreview]);
  
  const updatePreview = () => {
    if (!iframeRef.current) return;
    
    // Find HTML files that could be used as entry points
    const htmlFiles = projectFiles.filter(file => file.path.endsWith('.html'));
    
    if (htmlFiles.length === 0) {
      showNoPreviewMessage("Nenhum arquivo HTML encontrado no projeto");
      return;
    }
    
    // Use index.html if available, otherwise use the first HTML file
    const indexHtml = htmlFiles.find(file => file.path.includes('index.html')) || htmlFiles[0];
    
    // Create a blob from the HTML content
    const htmlContent = processHtmlForPreview(indexHtml.content, projectFiles);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Set the iframe src to the blob URL
    iframeRef.current.src = url;
    
    // Clean up the blob URL when done
    return () => URL.revokeObjectURL(url);
  };
  
  const processHtmlForPreview = (htmlContent: string, files: { path: string, content: string }[]) => {
    // Substitute external CSS and JS references with inline content
    let processedHtml = htmlContent;
    
    // Process CSS link tags
    const cssLinkRegex = /<link[^>]*href=["']([^"']+\.css)["'][^>]*>/g;
    let cssMatch;
    
    while ((cssMatch = cssLinkRegex.exec(htmlContent)) !== null) {
      const cssPath = cssMatch[1];
      const cssFile = files.find(file => file.path.endsWith(cssPath));
      
      if (cssFile) {
        const inlineStyle = `<style>${cssFile.content}</style>`;
        processedHtml = processedHtml.replace(cssMatch[0], inlineStyle);
      }
    }
    
    // Process JS script tags
    const jsScriptRegex = /<script[^>]*src=["']([^"']+\.js)["'][^>]*><\/script>/g;
    let jsMatch;
    
    while ((jsMatch = jsScriptRegex.exec(htmlContent)) !== null) {
      const jsPath = jsMatch[1];
      const jsFile = files.find(file => file.path.endsWith(jsPath));
      
      if (jsFile) {
        const inlineScript = `<script>${jsFile.content}</script>`;
        processedHtml = processedHtml.replace(jsMatch[0], inlineScript);
      }
    }
    
    return processedHtml;
  };
  
  const showNoPreviewMessage = (message: string) => {
    if (!iframeRef.current) return;
    
    const noPreviewHtml = `
      <html>
        <head>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background-color: #1e1e2e;
              color: #cdd6f4;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              padding: 20px;
              text-align: center;
            }
            .message {
              background-color: rgba(49, 50, 68, 0.7);
              border-radius: 8px;
              padding: 20px;
              max-width: 500px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h3 {
              margin-top: 0;
              color: #f38ba8;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <h3>Visualização não disponível</h3>
            <p>${message}</p>
            <p>Você pode continuar desenvolvendo seu projeto e a visualização será atualizada quando houver um arquivo HTML válido.</p>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([noPreviewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
    
    return () => URL.revokeObjectURL(url);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-semibold">Visualização</h2>
        <Button variant="outline" size="sm" onClick={() => updatePreview()}>
          Atualizar
        </Button>
      </div>
      
      <div className="flex-1 bg-slate-950">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-none"
          title="Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

export default PreviewPanel;
