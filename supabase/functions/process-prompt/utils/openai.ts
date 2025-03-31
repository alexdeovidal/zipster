
/**
 * Functions to interact with the OpenAI API
 */

import { prepareSystemPrompt } from './systemMessages.ts';

/**
 * Calls the OpenAI API with configured parameters
 * @param openAIApiKey OpenAI API Key
 * @param messages Array of messages to send to the API
 * @param hasImage Whether an image is included in the prompt
 * @returns Response content from the OpenAI API
 */
export async function callOpenAI(openAIApiKey: string, messages: any[], hasImage: boolean) {
  console.log("Sending to OpenAI with configuration:", {
    model: hasImage ? 'gpt-4o' : 'gpt-4o-mini',
    messagesCount: messages.length,
    temperature: 0.7,
    hasImage
  });

  // Add an extra instruction to enforce strict JSON format and high-quality output
  const jsonSystemMessage = {
    role: 'system',
    content: `
Always reply in strict JSON format with two fields:
- "reply": a short explanation of the generated content
- "files": an array of files, each containing:
  - "path": the full file path (e.g., "resources/views/pages/home.blade.php")
  - "content": the full content of the file
  - "language": the file language (e.g., "php", "blade", "javascript", "typescript")
  - "description": a brief summary of what the file does

⚠️ IMPORTANT:
- Build fully structured and modern projects
- Always use layouts, reusable components, and proper MVC structure
- For Laravel, use Blade, TailwindCSS, Vite, and optionally Breeze or Jetstream
- Include modern UI, responsiveness, and accessibility
- When the user asks for something like "clothing store", assume it's an e-commerce and generate a complete structure like a professional development team would
- Include pages like Home, Products, Contact, About, etc.
- Use dummy images and real-world sample content
- Never return partial or sample code — always generate complete production-ready files
- Be aware of uploaded ZIP files and their contents

When refactoring code:
- Generate improved versions of files
- Suggest removing obsolete files that are being replaced
- Make sure new implementations maintain all existing functionality
`
  };

  // Add this system message to the request
  messages.push(jsonSystemMessage);

  // Call the OpenAI API
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: hasImage ? 'gpt-4o' : 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('OpenAI API Error:', errorData);
    throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Export the system prompt function
export { prepareSystemPrompt };
