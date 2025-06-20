
import React from 'react';
import { Users, Target, DollarSign, TrendingUp } from 'lucide-react';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const salesData = [
  { name: 'Jan', vendas: 4000 },
  { name: 'Fev', vendas: 3000 },
  { name: 'Mar', vendas: 5000 },
  { name: 'Abr', vendas: 4500 },
  { name: 'Mai', vendas: 6000 },
  { name: 'Jun', vendas: 5500 },
];

const opportunityData = [
  { name: 'Jan', oportunidades: 24 },
  { name: 'Fev', oportunidades: 18 },
  { name: 'Mar', oportunidades: 32 },
  { name: 'Abr', oportunidades: 28 },
  { name: 'Mai', oportunidades: 35 },
  { name: 'Jun', oportunidades: 42 },
];

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Visão geral do seu negócio</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total de Clientes"
          value="1,247"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          className="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <DashboardCard
          title="Oportunidades Ativas"
          value="89"
          icon={Target}
          trend={{ value: 8, isPositive: true }}
          className="bg-gradient-to-br from-green-50 to-green-100"
        />
        <DashboardCard
          title="Receita do Mês"
          value="R$ 124,580"
          icon={DollarSign}
          trend={{ value: 15, isPositive: true }}
          className="bg-gradient-to-br from-purple-50 to-purple-100"
        />
        <DashboardCard
          title="Taxa de Conversão"
          value="68%"
          icon={TrendingUp}
          trend={{ value: -2, isPositive: false }}
          className="bg-gradient-to-br from-orange-50 to-orange-100"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendas" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Oportunidades por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={opportunityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="oportunidades" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de atividades recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Novo cliente cadastrado', client: 'Tech Solutions Ltda', time: '2 horas atrás' },
              { action: 'Oportunidade fechada', client: 'Marketing Pro', time: '4 horas atrás' },
              { action: 'Reunião agendada', client: 'Startup ABC', time: '1 dia atrás' },
              { action: 'Proposta enviada', client: 'E-commerce XYZ', time: '2 dias atrás' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-600">{activity.client}</p>
                </div>
                <span className="text-sm text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
