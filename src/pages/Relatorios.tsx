
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

const vendasPorMes = [
  { mes: 'Jan', vendas: 12, receita: 45000 },
  { mes: 'Fev', vendas: 19, receita: 68000 },
  { mes: 'Mar', vendas: 15, receita: 52000 },
  { mes: 'Abr', vendas: 22, receita: 78000 },
  { mes: 'Mai', vendas: 18, receita: 64000 },
  { mes: 'Jun', vendas: 25, receita: 89000 },
];

const clientesPorStatus = [
  { name: 'Ativos', value: 68, color: '#22c55e' },
  { name: 'Inativos', value: 22, color: '#ef4444' },
  { name: 'Prospects', value: 10, color: '#f59e0b' },
];

const oportunidadesPorEstagio = [
  { estagio: 'Qualificação', quantidade: 15 },
  { estagio: 'Proposta', quantidade: 8 },
  { estagio: 'Negociação', quantidade: 12 },
  { estagio: 'Fechamento', quantidade: 5 },
];

export const Relatorios = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Relatórios</h1>
          <p className="text-slate-600 mt-2">Análise detalhada do desempenho</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download size={16} className="mr-2" />
          Exportar Relatórios
        </Button>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-600">Vendas este Mês</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">25</p>
            <p className="text-sm text-green-600 mt-1">+12% vs mês anterior</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-slate-600">Receita Mensal</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">R$ 89.000</p>
            <p className="text-sm text-green-600 mt-1">+18% vs mês anterior</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-slate-600">Taxa de Conversão</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">68%</p>
            <p className="text-sm text-red-600 mt-1">-2% vs mês anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas e Receita por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendasPorMes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="vendas" fill="#2563eb" name="Vendas" />
                <Bar yAxisId="right" dataKey="receita" fill="#16a34a" name="Receita (R$)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Tooltip />
                <RechartsPieChart data={clientesPorStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={120}>
                  {clientesPorStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {clientesPorStatus.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Oportunidades por Estágio</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={oportunidadesPorEstagio} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="estagio" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="quantidade" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
