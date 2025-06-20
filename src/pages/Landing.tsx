
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Target, Calendar, DollarSign, Shield } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AgencyHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost"
                onClick={() => navigate('/auth')}
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Começar Agora
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/admin')}
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Sistema Completo para
            <span className="text-blue-600 block">Agências Digitais</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gerencie clientes, oportunidades, tarefas e muito mais em uma única plataforma. 
            Otimize seus processos e aumente a produtividade da sua agência.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              Começar Gratuitamente
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/admin')}
              className="border-red-500 text-red-600 hover:bg-red-50 text-lg px-8 py-3"
            >
              <Shield className="h-5 w-5 mr-2" />
              Acesso Admin
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tudo que sua agência precisa
          </h2>
          <p className="text-xl text-gray-600">
            Ferramentas poderosas para gerenciar todos os aspectos do seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Gestão de Clientes</CardTitle>
              <CardDescription>
                Mantenha todos os dados dos seus clientes organizados e acessíveis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Pipeline de Vendas</CardTitle>
              <CardDescription>
                Acompanhe oportunidades e feche mais negócios com eficiência
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Gestão de Tarefas</CardTitle>
              <CardDescription>
                Organize projetos e mantenha sua equipe sempre produtiva
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <CardTitle>Controle Financeiro</CardTitle>
              <CardDescription>
                Monitore receitas, despesas e a saúde financeira da agência
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <CardTitle>Relatórios Avançados</CardTitle>
              <CardDescription>
                Análises detalhadas para tomar decisões baseadas em dados
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Painel Administrativo</CardTitle>
              <CardDescription>
                Controle total com acesso especial para administradores
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para transformar sua agência?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a centenas de agências que já otimizaram seus processos
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Criar Conta Gratuitamente
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AgencyHub</span>
          </div>
          <p className="text-center text-gray-400">
            © 2024 AgencyHub. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
