
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
Você é um consultor estratégico sênior com mais de 15 anos de experiência em transformação digital e crescimento de negócios. 

Baseado nas informações fornecidas, crie uma estratégia DETALHADA e IMPLEMENTÁVEL:

**INFORMAÇÕES DO CLIENTE:**
- Cliente: ${clientName}
- Segmento: ${segment}
- Orçamento disponível: R$ ${budget?.toLocaleString('pt-BR') || 'Não informado'}
- Objetivos principais: ${objectives}
- Principais desafios: ${challenges}
- Prazo de implementação: ${implementationTime}

**ESTRUTURA DA ESTRATÉGIA (seja específico e prático):**

## 1. ANÁLISE SITUACIONAL
Faça uma análise do cenário atual do cliente considerando o segmento de atuação e os desafios apresentados.

## 2. OBJETIVOS SMART
Transforme os objetivos apresentados em metas SMART (Específicas, Mensuráveis, Atingíveis, Relevantes, Temporais).

## 3. ESTRATÉGIAS PRINCIPAIS
Liste 3-5 estratégias principais que abordem os objetivos e superem os desafios:

### Estratégia 1: [Nome da estratégia]
- **Descrição:** [Detalhes da estratégia]
- **Orçamento estimado:** [Porcentagem do orçamento total]
- **Prazo:** [Cronograma específico]
- **KPIs:** [Métricas de sucesso]

### Estratégia 2: [Nome da estratégia]
- **Descrição:** [Detalhes da estratégia]
- **Orçamento estimado:** [Porcentagem do orçamento total]
- **Prazo:** [Cronograma específico]
- **KPIs:** [Métricas de sucesso]

[Continue para outras estratégias...]

## 4. PLANO DE AÇÃO DETALHADO
Crie um cronograma de implementação:

### Primeiro Mês:
- [ ] Ação específica 1
- [ ] Ação específica 2
- [ ] Ação específica 3

### Segundo Mês:
- [ ] Ação específica 1
- [ ] Ação específica 2

[Continue para outros meses...]

## 5. SOLUÇÕES PARA DESAFIOS
Para cada desafio identificado, apresente uma solução específica:

**Desafio:** [Desafio específico]
**Solução:** [Solução detalhada]
**Recursos necessários:** [Lista de recursos]
**Prazo:** [Tempo para implementação]

## 6. MÉTRICAS DE SUCESSO
Liste KPIs específicos para medir o sucesso:
- [KPI 1]: Meta específica em X meses
- [KPI 2]: Meta específica em X meses
- [KPI 3]: Meta específica em X meses

## 7. PRÓXIMOS PASSOS IMEDIATOS
Liste as 5 primeiras ações que devem ser tomadas na primeira semana:
1. [Ação específica]
2. [Ação específica]
3. [Ação específica]
4. [Ação específica]
5. [Ação específica]

## 8. ESTIMATIVA DE ROI
Baseado no orçamento de R$ ${budget?.toLocaleString('pt-BR')}, projete:
- ROI esperado em 6 meses: [Percentual]%
- ROI esperado em 12 meses: [Percentual]%
- Payback estimado: [X] meses

**IMPORTANTE:** Seja específico, use números reais, forneça cronogramas detalhados e certifique-se de que tudo seja implementável dentro do orçamento e prazo estabelecidos.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: `Você é um consultor estratégico experiente especializado em criar estratégias de negócio detalhadas, práticas e implementáveis. Suas estratégias sempre incluem cronogramas específicos, alocação de orçamento, KPIs mensuráveis e próximos passos claros. Você adapta suas recomendações ao segmento de mercado e porte da empresa.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }

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
