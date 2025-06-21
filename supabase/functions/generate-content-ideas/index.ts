
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generate content ideas function called');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { clientName, businessType, contentType, targetAudience, objectives, tone } = requestBody;

    // Validação dos parâmetros
    if (!clientName) {
      throw new Error('Nome do cliente é obrigatório');
    }
    if (!businessType) {
      throw new Error('Tipo de negócio é obrigatório');
    }
    if (!contentType) {
      throw new Error('Tipo de conteúdo é obrigatório');
    }
    if (!targetAudience) {
      throw new Error('Público-alvo é obrigatório');
    }
    if (!objectives) {
      throw new Error('Objetivos são obrigatórios');
    }
    if (!tone) {
      throw new Error('Tom de voz é obrigatório');
    }

    console.log('All parameters validated successfully');

    const contentTypeMap = {
      instagram: 'Posts para Instagram',
      videos: 'Roteiros para Vídeos (YouTube/TikTok)',
      blog: 'Artigos de Blog',
      stories: 'Stories',
      reels: 'Reels',
      linkedin: 'Posts para LinkedIn',
      email: 'E-mail Marketing',
      mixed: 'Conteúdo para Múltiplas Plataformas'
    };

    const toneMap = {
      casual: 'casual e descontraído',
      professional: 'profissional',
      friendly: 'amigável',
      inspirational: 'inspiracional',
      educational: 'educativo',
      funny: 'divertido e humorístico',
      authoritative: 'autoritativo'
    };

    const prompt = `
Você é um especialista em marketing de conteúdo e criação de campanhas digitais. 

Gere 15 IDEIAS CRIATIVAS E ESPECÍFICAS de ${contentTypeMap[contentType as keyof typeof contentTypeMap] || contentType} para:

**CLIENTE:** ${clientName}
**NEGÓCIO:** ${businessType}
**PÚBLICO-ALVO:** ${targetAudience}
**OBJETIVOS:** ${objectives}
**TOM DE VOZ:** ${toneMap[tone as keyof typeof toneMap] || tone}

**INSTRUÇÕES ESPECÍFICAS:**

${contentType === 'instagram' ? `
- Forneça títulos/captions específicos
- Inclua sugestões de hashtags relevantes
- Sugira elementos visuais
- Varie entre posts educativos, promocionais e de engajamento
` : ''}

${contentType === 'videos' ? `
- Crie roteiros com gancho inicial
- Inclua duração sugerida
- Forneça estrutura: abertura, desenvolvimento, call-to-action
- Varie entre conteúdo educativo, entretenimento e promocional
` : ''}

${contentType === 'blog' ? `
- Forneça títulos SEO-friendly
- Inclua estrutura de tópicos
- Sugira palavras-chave
- Varie entre tutoriais, listas, estudos de caso e tendências
` : ''}

${contentType === 'stories' ? `
- Crie sequências de stories (3-5 cards)
- Inclua elementos interativos (enquetes, perguntas)
- Sugira elementos visuais
- Varie entre bastidores, dicas rápidas e promoções
` : ''}

${contentType === 'reels' ? `
- Forneça conceitos virais
- Inclua música/trend sugerida
- Sugira transições e efeitos
- Varie entre educativo, entretenimento e trending
` : ''}

${contentType === 'linkedin' ? `
- Crie posts profissionais e de networking
- Inclua insights do setor
- Sugira call-to-actions específicos
- Varie entre liderança de pensamento, casos de sucesso e dicas profissionais
` : ''}

${contentType === 'email' ? `
- Forneça subject lines atrativos
- Inclua estrutura de e-mail
- Sugira segmentação de audiência
- Varie entre newsletters, promoções e e-mails de relacionamento
` : ''}

**FORMATO DA RESPOSTA:**
Para cada ideia, forneça:

IDEIA [número]: [Título/Conceito]
• Descrição: [Explicação detalhada da ideia]
• Objetivo: [O que essa ideia visa alcançar]
• Execução: [Como implementar na prática]
${contentType === 'instagram' || contentType === 'reels' ? '• Hashtags: [Sugestões de hashtags]' : ''}
${contentType === 'videos' ? '• Duração: [Tempo sugerido]' : ''}
${contentType === 'blog' ? '• SEO: [Palavras-chave sugeridas]' : ''}

Seja ESPECÍFICO para o negócio ${businessType} e CRIATIVO nas abordagens. Cada ideia deve ser ÚNICA e ACIONÁVEL.
`;

    console.log('Sending request to OpenAI...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `Você é um especialista em marketing de conteúdo que cria ideias criativas, específicas e acionáveis. Sempre gere conteúdo novo e personalizado para o negócio específico. Seja prático e detalhado nas sugestões.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.9,
        max_tokens: 4000,
      }),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully');

    const generatedIdeas = data.choices[0].message.content;
    
    console.log('Generated ideas preview:', generatedIdeas.substring(0, 200) + '...');

    return new Response(JSON.stringify({ ideas: generatedIdeas }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-content-ideas function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
