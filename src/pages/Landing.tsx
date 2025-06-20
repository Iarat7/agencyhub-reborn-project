
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  DollarSign, 
  Target, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Dashboard Inteligente",
      description: "Visualize métricas importantes, receita e performance em tempo real"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Gestão de Clientes",
      description: "CRM completo para gerenciar relacionamentos e histórico de clientes"
    },
    {
      icon: <Target className="h-8 w-8 text-purple-600" />,
      title: "Pipeline Comercial",
      description: "Acompanhe oportunidades de venda do primeiro contato ao fechamento"
    },
    {
      icon: <Calendar className="h-8 w-8 text-orange-600" />,
      title: "Calendário Integrado",
      description: "Agende reuniões e compromissos com clientes automaticamente"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-emerald-600" />,
      title: "Controle Financeiro",
      description: "Monitore receitas, despesas e fluxo de caixa da sua agência"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Estratégias com IA",
      description: "Gere estratégias personalizadas para clientes usando inteligência artificial"
    }
  ];

  const benefits = [
    "Redução de 60% no tempo gasto em tarefas administrativas",
    "Aumento de 40% na taxa de conversão de leads",
    "Controle total sobre o fluxo financeiro da agência",
    "Relatórios automáticos para clientes",
    "Integração com Meta, Google Ads e principais plataformas",
    "Interface intuitiva e fácil de usar"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AgencyHub</span>
          </div>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Fazer Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            O sistema completo para
            <span className="text-blue-600 block">sua agência digital</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gerencie clientes, projetos, finanças e estratégias em uma única plataforma. 
            Automatize processos e foque no que realmente importa: fazer sua agência crescer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-4"
            >
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tudo que sua agência precisa
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas profissionais para otimizar cada aspecto do seu negócio
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Resultados que você pode esperar
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Mais de 500 agências já transformaram seus resultados usando o AgencyHub
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white border-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-4">Pronto para começar?</h3>
                  <p className="text-blue-100 mb-6">
                    Junte-se às agências que já estão crescendo mais rápido com o AgencyHub
                  </p>
                  <Button 
                    size="lg" 
                    variant="secondary"
                    onClick={() => navigate('/auth')}
                    className="w-full"
                  >
                    Criar Conta Grátis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">AgencyHub</span>
          </div>
          <p className="text-gray-400">
            © 2024 AgencyHub. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
