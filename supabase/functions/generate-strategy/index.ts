
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Base de conhecimento para contexto de mercado
const getMarketContext = (segment: string) => {
  const marketData = {
    'e-commerce': {
      trends: ['Mobile-first', 'Personalização por IA', 'Sustentabilidade', 'Social commerce'],
      challenges: ['Competição acirrada', 'CAC crescente', 'Logística', 'Retenção de clientes'],
      opportunities: ['Omnichannel', 'Marketplace', 'Automação', 'Internacional'],
      metrics: ['Conversion rate', 'AOV', 'LTV', 'Cart abandonment'],
      seasonality: 'Alto impacto em Black Friday, Natal, Dia das Mães'
    },
    'saas': {
      trends: ['Product-led growth', 'IA integrada', 'No-code/Low-code', 'API-first'],
      challenges: ['Churn rate', 'Escalabilidade', 'Segurança', 'Competição'],
      opportunities: ['Vertical SaaS', 'Integração com IA', 'Mercados emergentes', 'Enterprise'],
      metrics: ['MRR', 'Churn rate', 'LTV/CAC', 'Product adoption'],
      seasonality: 'Q4 forte para vendas B2B, Q1 renovações'
    },
    'varejo': {
      trends: ['Omnichannel', 'Experiência phygital', 'Cashless', 'Sustentabilidade'],
      challenges: ['Margem apertada', 'Concorrência online', 'Estoque', 'Experiência'],
      opportunities: ['Digital transformation', 'Data analytics', 'Loyalty programs', 'Local commerce'],
      metrics: ['Footfall', 'Conversion rate', 'Basket size', 'Inventory turnover'],
      seasonality: 'Sazonal forte - dezembro, março, junho'
    },
    'consultoria': {
      trends: ['Especialização vertical', 'Delivery remoto', 'Automação', 'Resultados garantidos'],
      challenges: ['Escalabilidade', 'Diferenciação', 'Pricing', 'Pipeline'],
      opportunities: ['Productização', 'Parcerias estratégicas', 'Nichos emergentes', 'Digital products'],
      metrics: ['Utilization rate', 'Project margin', 'Client retention', 'Referral rate'],
      seasonality: 'Q1 e Q3 melhores para novos projetos'
    },
    'default': {
      trends: ['Transformação digital', 'Experiência do cliente', 'Automação', 'Sustentabilidade'],
      challenges: ['Concorrência', 'Inovação', 'Talentos', 'Eficiência operacional'],
      opportunities: ['Digitalização', 'Novos mercados', 'Parcerias', 'Inovação'],
      metrics: ['Revenue growth', 'Market share', 'Customer satisfaction', 'Operational efficiency'],
      seasonality: 'Varia por setor'
    }
  };
  
  return marketData[segment.toLowerCase()] || marketData.default;
};

// Metodologias estratégicas disponíveis
const getMethodologyFramework = (objectives: string, challenges: string) => {
  const frameworks = [];
  
  if (objectives.toLowerCase().includes('crescimento') || objectives.toLowerCase().includes('expansão')) {
    frameworks.push('Growth Hacking Framework');
  }
  
  if (challenges.toLowerCase().includes('competição') || challenges.toLowerCase().includes('mercado')) {
    frameworks.push('Blue Ocean Strategy');
  }
  
  if (objectives.toLowerCase().includes('eficiência') || challenges.toLowerCase().includes('processo')) {
    frameworks.push('Lean Methodology');
  }
  
  if (objectives.toLowerCase().includes('digital') || challenges.toLowerCase().includes('tecnologia')) {
    frameworks.push('Digital Transformation Framework');
  }
  
  frameworks.push('OKRs (Objectives and Key Results)');
  frameworks.push('SMART Goals Framework');
  
  return frameworks;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generate strategy function called with enhanced AI');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not configured');
    }

    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { clientName, segment, budget, objectives, challenges, implementationTime } = requestBody;

    // Validação rigorosa
    if (!clientName || !segment || !objectives || !challenges) {
      throw new Error('Parâmetros obrigatórios: clientName, segment, objectives, challenges');
    }

    console.log('All parameters validated successfully');

    // Obter contexto de mercado
    const marketContext = getMarketContext(segment);
    const methodologies = getMethodologyFramework(objectives, challenges);
    
    // Determinar foco sazonal
    const currentMonth = new Date().getMonth();
    const currentQuarter = Math.floor(currentMonth / 3) + 1;
    const seasonalFocus = currentMonth >= 10 ? 'fim de ano' : 
                        currentMonth <= 2 ? 'início de ano' : 
                        currentMonth >= 5 && currentMonth <= 7 ? 'meio do ano' : 'período regular';

    const enhancedPrompt = `
Você é um CONSULTOR ESTRATÉGICO SÊNIOR com 15+ anos de experiência em ${segment}, especializado em:
- Transformação digital e crescimento exponencial
- Análise de mercado e inteligência competitiva  
- Implementação de metodologias ágeis e frameworks estratégicos
- ROI mensurável e resultados comprovados

**MISSÃO:** Criar uma estratégia INOVADORA e IMPLEMENTÁVEL que supere as expectativas e gere resultados mensuráveis.

**CONTEXTO DO CLIENTE:**
- **Empresa:** ${clientName}
- **Segmento:** ${segment}
- **Orçamento:** R$ ${budget ? budget.toLocaleString('pt-BR') : 'A definir'}
- **Objetivos:** ${objectives}
- **Desafios:** ${challenges}
- **Prazo:** ${implementationTime || 'Flexível'}
- **Período:** ${seasonalFocus} (Q${currentQuarter}/2025)

**CONTEXTO DE MERCADO - ${segment.toUpperCase()}:**
- **Tendências:** ${marketContext.trends.join(', ')}
- **Desafios do Setor:** ${marketContext.challenges.join(', ')}
- **Oportunidades:** ${marketContext.opportunities.join(', ')}
- **KPIs Críticos:** ${marketContext.metrics.join(', ')}
- **Sazonalidade:** ${marketContext.seasonality}

**METODOLOGIAS APLICÁVEIS:** ${methodologies.join(', ')}

**ESTRUTURA OBRIGATÓRIA DA RESPOSTA:**

# 🎯 ESTRATÉGIA TRANSFORMACIONAL PARA ${clientName.toUpperCase()}

## 📊 EXECUTIVE SUMMARY
- Visão estratégica em 3 linhas
- ROI projetado e timeline de resultados
- Diferencial competitivo único

## 🔍 ANÁLISE SITUACIONAL 360°

### Diagnóstico Atual
- Posicionamento no mercado ${segment}
- Gap analysis vs. líderes do setor
- Mapeamento de stakeholders

### Cenário Competitivo
- Análise dos 3 principais concorrentes
- Oportunidades de diferenciação
- Ameaças e riscos identificados

## 🚀 ESTRATÉGIAS CORE (Máximo 4)

### 🎯 Estratégia 1: [Nome Específico e Impactante]
- **Objetivo SMART:** [Meta específica, mensurável, atingível, relevante, temporal]
- **Metodologia:** ${methodologies[0] || 'Framework customizado'}
- **Investimento:** [% do orçamento] - R$ [valor]
- **Timeline:** [Fases detalhadas por mês]
- **KPIs Principais:** [3-4 métricas específicas]
- **Quick Wins (30 dias):** [Ações imediatas]
- **Recursos Necessários:** [Time, tecnologia, parceiros]

### 🎯 Estratégia 2: [Nome Específico e Impactante]
[Mesma estrutura da Estratégia 1]

### 🎯 Estratégia 3: [Nome Específico e Impactante]
[Mesma estrutura da Estratégia 1]

## 📈 ROADMAP DE IMPLEMENTAÇÃO

### 🚀 Sprint 1 (Semanas 1-4): FUNDAÇÃO
- [ ] [Ação específica com responsável]
- [ ] [Ação específica com responsável]
- [ ] [Marco de validação]

### ⚡ Sprint 2 (Semanas 5-8): ACELERAÇÃO
- [ ] [Ação específica com responsável]
- [ ] [Ação específica com responsável]
- [ ] [Marco de validação]

### 🎯 Sprint 3 (Semanas 9-12): OTIMIZAÇÃO
- [ ] [Ação específica com responsável]
- [ ] [Ação específica com responsável]
- [ ] [Marco de validação]

## 🛡️ MITIGAÇÃO DE RISCOS E DESAFIOS

${challenges.split('.').map(challenge => 
  challenge.trim() ? `
### Desafio: ${challenge.trim()}
- **Impacto:** [Alto/Médio/Baixo]
- **Probabilidade:** [%]
- **Solução:** [Estratégia específica]
- **Plano B:** [Alternativa]
- **Recursos:** [Necessários para mitigar]
` : ''
).join('')}

## 📊 DASHBOARD DE PERFORMANCE

### KPIs Primários (Acompanhamento Semanal)
- **${marketContext.metrics[0]}:** Meta em 30/60/90 dias
- **${marketContext.metrics[1]}:** Meta em 30/60/90 dias
- **${marketContext.metrics[2]}:** Meta em 30/60/90 dias

### KPIs Secundários (Acompanhamento Mensal)
- **${marketContext.metrics[3] || 'Customer Satisfaction'}:** Meta trimestral
- **Eficiência Operacional:** Meta semestral
- **Market Share:** Meta anual

## 💰 PROJEÇÃO FINANCEIRA DETALHADA

${budget ? `
### Investimento Total: R$ ${budget.toLocaleString('pt-BR')}

**Distribuição por Estratégia:**
- Estratégia 1: 40% (R$ ${(budget * 0.4).toLocaleString('pt-BR')})
- Estratégia 2: 30% (R$ ${(budget * 0.3).toLocaleString('pt-BR')})
- Estratégia 3: 20% (R$ ${(budget * 0.2).toLocaleString('pt-BR')})
- Contingência: 10% (R$ ${(budget * 0.1).toLocaleString('pt-BR')})

**ROI Projetado:**
- 3 meses: +${Math.round(budget * 0.15).toLocaleString('pt-BR')} (15% ROI)
- 6 meses: +${Math.round(budget * 0.45).toLocaleString('pt-BR')} (45% ROI)
- 12 meses: +${Math.round(budget * 1.2).toLocaleString('pt-BR')} (120% ROI)

**Payback:** 4-6 meses
**Break-even:** Mês 3
` : `
### Investimento: A DEFINIR

**Recomendação de Orçamento:**
- Mínimo para impacto: R$ 25.000
- Recomendado para crescimento: R$ 50.000
- Ideal para transformação: R$ 100.000+

**ROI Esperado:** 80-150% em 12 meses
`}

## 🎯 PRÓXIMOS PASSOS CRÍTICOS (Esta Semana)

1. **Hoje:** [Ação específica - 2h]
2. **Amanhã:** [Ação específica - 4h] 
3. **Esta semana:** [Ação específica - 1 dia]
4. **Próxima semana:** [Ação específica - 2 dias]
5. **Este mês:** [Marco importante]

## 🤝 PARCEIROS E RECURSOS RECOMENDADOS

### Tecnologia
- [Ferramentas específicas para ${segment}]
- [Plataformas de automação]
- [Analytics e BI]

### Parceiros Estratégicos
- [Tipo de parceiro] para [objetivo específico]
- [Tipo de parceiro] para [objetivo específico]

### Capacitação de Time
- [Treinamento específico]
- [Certificações relevantes]

---
**💡 Esta estratégia foi desenvolvida especificamente para ${clientName} considerando o contexto atual do mercado ${segment} e as tendências de ${seasonalFocus} 2025.**

**🔄 Revisão estratégica recomendada: Mensal**
**📞 Próxima reunião de alinhamento: Em 15 dias**

IMPORTANTE: Gere conteúdo ESPECÍFICO e NOVO. NÃO repita informações do briefing. Seja CRIATIVO e ESTRATÉGICO!
`;

    console.log('Sending enhanced request to OpenAI...');

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
            content: `Você é um consultor estratégico senior com 15+ anos de experiência. Sua especialidade é criar estratégias únicas, implementáveis e de alto ROI. 

REGRAS CRÍTICAS:
1. SEMPRE gere conteúdo novo e específico - NUNCA repita dados de entrada
2. Use metodologias comprovadas (OKRs, SMART, Blue Ocean, etc.)
3. Inclua números específicos e metas mensuráveis
4. Foque em quick wins e resultados de curto prazo
5. Seja detalhado em cronogramas e responsabilidades
6. Inclua análise de riscos e planos de contingência
7. Use o contexto de mercado para decisões estratégicas
8. Priorize ações que gerem ROI imediato

CONTEXTO DE SAZONALIDADE:
- Período atual: ${seasonalFocus}
- Quarter: Q${currentQuarter}
- Tendências do período: ${marketContext.seasonality}

Gere estratégias INOVADORAS que aproveitem o momento atual do mercado.`
          },
          { role: 'user', content: enhancedPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.2
      }),
    });

    console.log('OpenAI response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Enhanced strategy generated successfully');

    const generatedStrategy = data.choices[0].message.content;
    
    // Log de qualidade da resposta
    const qualityMetrics = {
      wordCount: generatedStrategy.split(' ').length,
      hasROI: generatedStrategy.includes('ROI'),
      hasTimeline: generatedStrategy.includes('Timeline') || generatedStrategy.includes('Cronograma'),
      hasKPIs: generatedStrategy.includes('KPI'),
      hasActionItems: generatedStrategy.includes('Ação') || generatedStrategy.includes('Sprint'),
    };
    
    console.log('Strategy quality metrics:', qualityMetrics);
    console.log('Generated strategy preview:', generatedStrategy.substring(0, 300) + '...');

    return new Response(JSON.stringify({ 
      strategy: generatedStrategy,
      metadata: {
        marketContext: marketContext,
        methodologies: methodologies,
        qualityScore: Object.values(qualityMetrics).filter(Boolean).length / Object.keys(qualityMetrics).length,
        generatedAt: new Date().toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhanced generate-strategy function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: 'Enhanced strategy generation failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
