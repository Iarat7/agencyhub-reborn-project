
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
    console.log('Generate strategy function called');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { clientName, segment, budget, objectives, challenges, implementationTime } = requestBody;

    // Validação mais rigorosa dos parâmetros
    if (!clientName) {
      throw new Error('Nome do cliente é obrigatório');
    }
    if (!segment) {
      throw new Error('Segmento é obrigatório');
    }
    if (!objectives) {
      throw new Error('Objetivos são obrigatórios');
    }
    if (!challenges) {
      throw new Error('Desafios são obrigatórios');
    }

    console.log('All parameters validated successfully');

    const prompt = `
Você é um consultor estratégico sênior especializado em transformação digital e crescimento de negócios. 

Crie uma estratégia DETALHADA e IMPLEMENTÁVEL para:

**CLIENTE:** ${clientName}
**SEGMENTO:** ${segment}  
**ORÇAMENTO:** R$ ${budget ? budget.toLocaleString('pt-BR') : 'Não informado'}
**OBJETIVOS:** ${objectives}
**DESAFIOS:** ${challenges}
**PRAZO:** ${implementationTime || 'Não especificado'}

IMPORTANTE: Gere uma estratégia completamente NOVA e PERSONALIZADA baseada nestas informações específicas. NÃO repita os dados fornecidos.

**ESTRUTURA DA RESPOSTA:**

# ESTRATÉGIA PERSONALIZADA PARA ${clientName.toUpperCase()}

## 1. ANÁLISE SITUACIONAL
[Análise do cenário atual considerando o segmento ${segment} e os desafios específicos]

## 2. OBJETIVOS SMART RECOMENDADOS
[Transforme os objetivos em metas SMART específicas com métricas quantificáveis]

## 3. ESTRATÉGIAS PRINCIPAIS (3-5 estratégias)

### Estratégia 1: [Nome específico]
- **Descrição:** [Detalhes específicos da implementação]
- **Orçamento sugerido:** [% do orçamento total]
- **Cronograma:** [Timeline específico]
- **KPIs:** [Métricas mensuráveis]

### Estratégia 2: [Nome específico]
- **Descrição:** [Detalhes específicos da implementação] 
- **Orçamento sugerido:** [% do orçamento total]
- **Cronograma:** [Timeline específico]
- **KPIs:** [Métricas mensuráveis]

[Continue para outras estratégias...]

## 4. PLANO DE IMPLEMENTAÇÃO

### Fase 1 (Primeiro Mês):
- [ ] [Ação específica 1]
- [ ] [Ação específica 2]
- [ ] [Ação específica 3]

### Fase 2 (Segundo Mês):
- [ ] [Ação específica 1]
- [ ] [Ação específica 2]

[Continue cronograma...]

## 5. SOLUÇÕES PARA DESAFIOS IDENTIFICADOS
[Para cada desafio, apresente solução específica e recursos necessários]

## 6. MÉTRICAS DE SUCESSO
- [KPI 1]: Meta específica em X meses
- [KPI 2]: Meta específica em X meses  
- [KPI 3]: Meta específica em X meses

## 7. PRÓXIMOS PASSOS IMEDIATOS
1. [Primeira ação para próxima semana]
2. [Segunda ação para próxima semana]
3. [Terceira ação para próxima semana]
4. [Quarta ação para próxima semana]
5. [Quinta ação para próxima semana]

## 8. PROJEÇÃO DE ROI
${budget ? `
- ROI esperado em 6 meses: [X]%
- ROI esperado em 12 meses: [X]%  
- Payback estimado: [X] meses
- Retorno financeiro projetado: R$ [valor]
` : `
- Definir orçamento para calcular ROI específico
- Potencial de crescimento: [percentual]%
`}

GERE CONTEÚDO NOVO E ESPECÍFICO - NÃO REPITA OS DADOS DE ENTRADA!
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
            content: `Você é um consultor estratégico experiente que cria estratégias únicas e implementáveis. Sempre gere conteúdo novo e específico, nunca repita os dados de entrada. Suas estratégias são detalhadas, práticas e incluem cronogramas, orçamentos e KPIs específicos.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.8,
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

    const generatedStrategy = data.choices[0].message.content;
    
    console.log('Generated strategy preview:', generatedStrategy.substring(0, 200) + '...');

    return new Response(JSON.stringify({ strategy: generatedStrategy }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-strategy function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
