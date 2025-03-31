
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, X } from 'lucide-react';
import { toast } from 'sonner';

interface ChatInputFormProps {
  onSubmit: (prompt: string, image?: File) => Promise<void>;
  loading: boolean;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({ onSubmit, loading }) => {
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const lastPromptRef = useRef<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Add a ref to track the last submit time to prevent rapid submissions
  const lastSubmitTimeRef = useRef<number>(0);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error('O arquivo selecionado não é uma imagem');
      return;
    }
    
    // Check if file size is less than 4MB
    if (file.size > 4 * 1024 * 1024) {
      toast.error('A imagem deve ter menos de 4MB');
      return;
    }
    
    setSelectedImage(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for empty prompt or already loading/submitting
    if (!prompt.trim() && !selectedImage) {
      toast.error('Digite uma mensagem ou selecione uma imagem');
      return;
    }
    
    if (loading || isSubmitting) {
      console.log("Skipping submit - already loading or submitting");
      return;
    }
    
    // Avoid duplicate submissions of the same prompt in quick succession
    if (prompt === lastPromptRef.current && Date.now() - lastSubmitTimeRef.current < 2000) {
      console.log("Preventing duplicate prompt submission:", prompt);
      return;
    }
    
    try {
      setIsSubmitting(true);
      const currentPrompt = prompt.trim();
      lastPromptRef.current = currentPrompt;
      lastSubmitTimeRef.current = Date.now();
      
      // Clear prompt immediately to prevent duplicate submissions
      setPrompt(''); 
      
      console.log("ChatInputForm submitting prompt with image:", selectedImage ? selectedImage.name : "none");
      await onSubmit(currentPrompt, selectedImage || undefined);
      
      // Clear the image after successful submission
      handleRemoveImage();
    } catch (error) {
      console.error("Error submitting prompt:", error);
      // Only restore prompt if there was an error
      setPrompt(lastPromptRef.current);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      // Small delay before allowing new submissions
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="p-4 border-t border-border bg-card/30 backdrop-blur-md relative">
      {imagePreview && (
        <div className="relative mb-2 inline-block">
          <div className="relative border border-border rounded-md overflow-hidden">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="h-24 object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-background"
              aria-label="Remover imagem"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
      <div className="flex gap-2">
        <div className="flex-1 flex flex-col">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Descreva o que você deseja criar ou envie uma imagem para análise..."
            className="resize-none min-h-[80px] bg-background/20 backdrop-blur-sm"
            disabled={loading || isSubmitting}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }
            }}
          />
          
          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-secondary transition-colors"
              disabled={loading || isSubmitting}
            >
              <Image size={16} />
              <span>Adicionar imagem</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={loading || isSubmitting}
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={loading || isSubmitting || (!prompt.trim() && !selectedImage)} 
          className={`self-end ${isSubmitting ? 'opacity-70' : 'gradient-bg'}`}
        >
          {isSubmitting ? 'Enviando...' : loading ? 'Processando...' : 'Enviar'}
        </Button>
      </div>
      
      {loading && !isSubmitting && (
        <div className="absolute bottom-[calc(100%+4px)] right-4 bg-brand-purple/90 text-white px-3 py-1 rounded-t-md text-sm font-medium shadow-md animate-pulse">
          Processando...
        </div>
      )}
    </form>
  );
};

export default React.memo(ChatInputForm);
