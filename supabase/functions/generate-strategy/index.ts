
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
    const { clientName, segment, budget, objectives, challenges, implementationTime } = await req.json();

    const prompt = `
Você é um especialista em estratégias de negócio. Gere uma estratégia completa baseada nas seguintes informações:

Cliente: ${clientName}
Segmento: ${segment}
Orçamento: R$ ${budget}
Objetivos: ${objectives}
Principais Desafios: ${challenges}
Tempo de Implementação: ${implementationTime}

Por favor, forneça uma estratégia detalhada que inclua:
1. Análise do cenário atual
2. Estratégias específicas para atingir os objetivos
3. Plano de ação com etapas claras
4. Soluções para os desafios identificados
5. Métricas de sucesso
6. Cronograma de implementação

Seja específico e prático, considerando o orçamento e tempo disponíveis.
`;

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
            content: 'Você é um consultor estratégico experiente que cria estratégias de negócio detalhadas e práticas.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    const generatedStrategy = data.choices[0].message.content;

    return new Response(JSON.stringify({ strategy: generatedStrategy }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-strategy function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
