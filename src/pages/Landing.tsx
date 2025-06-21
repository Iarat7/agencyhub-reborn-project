
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Target, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Gestão de Clientes',
      description: 'Centralize todas as informações dos seus clientes em um só lugar'
    },
    {
      icon: Target,
      title: 'Pipeline de Vendas',
      description: 'Acompanhe suas oportunidades desde o primeiro contato até o fechamento'
    },
    {
      icon: Calendar,
      title: 'Agenda Integrada',
      description: 'Organize suas tarefas e compromissos de forma eficiente'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Avançados',
      description: 'Tome decisões baseadas em dados com nossos relatórios detalhados'
    },
    {
      icon: DollarSign,
      title: 'Controle Financeiro',
      description: 'Gerencie receitas, despesas e acompanhe a saúde financeira'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Seus dados protegidos com criptografia de ponta'
    }
  ];

  const benefits = [
    'Interface intuitiva e fácil de usar',
    'Acesso em qualquer dispositivo',
    'Sincronização em tempo real',
    'Suporte técnico especializado',
    'Atualizações automáticas',
    'Backup seguro na nuvem'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">InflowHub</span>
          </div>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Entrar
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Transforme sua gestão empresarial com 
            <span className="text-blue-600"> InflowHub</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            A plataforma completa para gerenciar clientes, vendas, tarefas e muito mais. 
            Tudo em um só lugar, simples e poderoso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8 py-3">
              <Zap className="mr-2 h-5 w-5" />
              Começar Agora
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Recursos Poderosos
          </h2>
          <p className="text-lg text-slate-600">
            Descubra como o InflowHub pode revolucionar sua empresa
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Por que escolher o InflowHub?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Aumente sua produtividade em até 40%
                </h3>
                <p className="text-slate-600 mb-6">
                  Empresas que usam o InflowHub relatam um aumento significativo 
                  na eficiência e organização dos processos.
                </p>
                <Button size="lg" onClick={() => navigate('/auth')}>
                  Experimentar Grátis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para transformar sua empresa?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Junte-se a milhares de empresas que já confiam no InflowHub
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate('/auth')} className="text-lg px-8 py-3">
              Começar Gratuitamente
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-6 w-6 bg-blue-600 rounded flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">InflowHub</span>
          </div>
          <p className="text-slate-400">
            © 2024 InflowHub. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
