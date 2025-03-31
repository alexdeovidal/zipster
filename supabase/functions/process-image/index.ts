
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    // Tentar processar como FormData
    let imageFile, prompt;
    try {
      const formData = await req.formData();
      imageFile = formData.get('image');
      prompt = formData.get('prompt') || "Analise esta imagem";
      
      if (!imageFile || !(imageFile instanceof File)) {
        throw new Error('Imagem não encontrada no FormData');
      }
    } catch (formError) {
      console.error('Erro ao processar FormData:', formError);
      return new Response(
        JSON.stringify({ error: 'Formato de requisição inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Processando imagem:", imageFile.name, "com prompt:", prompt);

    // Gerar um nome de arquivo único com timestamp
    const fileExtension = imageFile.name.split('.').pop();
    const fileName = `upload_${Date.now()}.${fileExtension}`;
    
    // Configurar o cliente Supabase para Storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Variáveis de ambiente do Supabase não configuradas');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar se o bucket 'ai-images' existe ou criá-lo
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'ai-images');
    
    if (!bucketExists) {
      console.log("Bucket 'ai-images' não existe. Criando...");
      const { error: createError } = await supabase.storage.createBucket('ai-images', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        throw new Error(`Erro ao criar bucket: ${createError.message}`);
      }
    }

    // Fazer upload da imagem
    const buffer = await imageFile.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('ai-images')
      .upload(fileName, buffer, {
        contentType: imageFile.type,
        upsert: true
      });
    
    if (uploadError) {
      throw new Error(`Erro no upload da imagem: ${uploadError.message}`);
    }
    
    console.log("Imagem enviada com sucesso:", uploadData?.path);
    
    // Obter a URL pública da imagem
    const { data: publicUrl } = supabase.storage
      .from('ai-images')
      .getPublicUrl(fileName);
    
    if (!publicUrl?.publicUrl) {
      throw new Error('Falha ao gerar URL pública da imagem');
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Imagem processada com sucesso',
        imageUrl: publicUrl.publicUrl,
        prompt: prompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro na função process-image:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erro desconhecido ao processar a imagem' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
