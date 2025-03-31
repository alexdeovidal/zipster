
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Importar utilitários
import { validateFileExtension, getFileDescription } from './utils/fileValidation.ts';
import { prepareSystemPrompt } from './utils/systemMessages.ts';
import { callOpenAI } from './utils/openai.ts';
import { processResponse } from './utils/responseProcessor.ts';
import { createResponse, createErrorResponse } from './utils/httpResponse.ts';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Lidar com solicitações CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Process-prompt function invoked");
    
    // Parse the request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return createErrorResponse('Invalid request format', 400, corsHeaders);
    }
    
    const { prompt, projectContext, messageHistory, imageUrl, currentFiles } = requestBody;
    
    if (!prompt && !imageUrl) {
      console.error('Missing required parameters: prompt or imageUrl');
      return createErrorResponse('Missing required parameters', 400, corsHeaders);
    }

    // Extract framework details from the project context with proper framework-specific variant handling
    let framework = 'react-vite';
    let frameworkSpecific = '';
    
    if (projectContext) {
      // Extract main framework
      const frameworkMatch = projectContext?.match(/\(([^)]+)\)/);
      if (frameworkMatch) {
        const frameworkValue = frameworkMatch[1];
        
        // Check if it's a compound framework (like laravel-react)
        if (frameworkValue.includes('-')) {
          const parts = frameworkValue.split('-');
          framework = parts[0]; // Base framework (e.g., laravel)
          frameworkSpecific = frameworkValue; // Specific variant (e.g., laravel-react)
        } else {
          framework = frameworkValue;
          frameworkSpecific = frameworkValue;
        }
      }
    }

    console.log("Request parameters:", { 
      promptLength: prompt?.length,
      hasProjectContext: !!projectContext,
      messageHistoryCount: messageHistory?.length,
      hasImageUrl: !!imageUrl,
      framework,
      frameworkSpecific,
      hasCurrentFiles: !!currentFiles,
      currentFilesCount: currentFiles?.length
    });

    // Add current files to the context if available
    let enhancedContext = projectContext || '';
    if (currentFiles && currentFiles.length > 0) {
      enhancedContext += `\n\nCurrently existing project files (NEVER delete or replace these unless explicitly requested):`;
      currentFiles.forEach((file: any) => {
        enhancedContext += `\n- ${file.path}`;
      });
      
      // Add content of important files to provide more context
      enhancedContext += `\n\nContent of key files:`;
      currentFiles.slice(0, 5).forEach((file: any) => {
        if (file.content && file.content.length < 5000) { // Only include smaller files
          enhancedContext += `\n\nFile: ${file.path}\n\`\`\`\n${file.content}\n\`\`\``;
        }
      });
    }

    // Pass both the main framework and specific framework variant to prepare the system prompt
    const systemMessage = prepareSystemPrompt(enhancedContext, framework, imageUrl, frameworkSpecific);

    // Create messages for the OpenAI API
    let messages = [systemMessage];

    // Add message history, limiting to the most recent relevant context
    if (messageHistory && messageHistory.length > 0) {
      // Get only the last 10 messages to maintain recent context
      const recentMessages = messageHistory.slice(-10);
      messages = [...messages, ...recentMessages];
    }

    // If there's an image, add it as a user message with the URL
    if (imageUrl) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt || 'Analise esta imagem e gere o código correspondente.' },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      });
    } else if (prompt) {
      // If there's no image, add only the prompt as text
      messages.push({
        role: 'user',
        content: prompt
      });
    }

    // Call the OpenAI API
    let generatedText;
    try {
      generatedText = await callOpenAI(openAIApiKey, messages, !!imageUrl);
    } catch (openAIError) {
      console.error('Error calling OpenAI API:', openAIError);
      return createErrorResponse(`Error calling OpenAI: ${openAIError.message}`, 502, corsHeaders);
    }
    
    // Process the response
    try {
      const processedResponse = processResponse(generatedText, frameworkSpecific || framework);
      
      // Return formatted response
      return createResponse(processedResponse, 200, corsHeaders);
    } catch (processingError) {
      console.error('Error processing OpenAI response:', processingError);
      // Return the raw response if processing fails
      return createResponse({ response: generatedText }, 200, corsHeaders);
    }
    
  } catch (error) {
    console.error('Erro na função process-prompt:', error);
    return createErrorResponse(error.message || 'Internal server error', 500, corsHeaders);
  }
});
