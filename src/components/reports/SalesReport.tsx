
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Target, Users } from 'lucide-react';

interface SalesReportProps {
  data: {
    opportunities: any[];
    clients: any[];
    contracts: any[];
  };
}

export const SalesReport = ({ data }: SalesReportProps) => {
  // Métricas de vendas
  const totalOpportunities = data.opportunities?.length || 0;
  const wonOpportunities = data.opportunities?.filter(o => o.stage === 'closed_won').length || 0;
  const totalValue = data.opportunities?.filter(o => o.stage === 'closed_won').reduce((sum, o) => sum + (o.value || 0), 0) || 0;
  const conversionRate = totalOpportunities > 0 ? (wonOpportunities / totalOpportunities * 100).toFixed(1) : 0;

  // Dados para gráfico de funil de vendas
  const funnelData = [
    { stage: 'Prospecção', count: data.opportunities?.filter(o => o.stage === 'prospection').length || 0 },
    { stage: 'Qualificação', count: data.opportunities?.filter(o => o.stage === 'qualification').length || 0 },
    { stage: 'Proposta', count: data.opportunities?.filter(o => o.stage === 'proposal').length || 0 },
    { stage: 'Negociação', count: data.opportunities?.filter(o => o.stage === 'negotiation').length || 0 },
    { stage: 'Fechado', count: wonOpportunities },
  ];

  // Dados para gráfico de vendas por mês
  const salesByMonth = data.opportunities?.filter(o => o.stage === 'closed_won')
    .reduce((acc, opp) => {
      const month = new Date(opp.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + (opp.value || 0);
      return acc;
    }, {});

  const monthlyData = Object.entries(salesByMonth || {}).map(([month, value]) => ({
    month,
    vendas: value
  }));

  // Cores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Oportunidades</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOpportunities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Fechadas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wonOpportunities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalValue.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funil de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle>Funil de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={400} height={300} data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0088FE" />
            </BarChart>
          </CardContent>
        </Card>

        {/* Vendas por Estágio */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Estágio</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={400} height={300}>
              <Pie
                data={funnelData}
                cx={200}
                cy={150}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>

        {/* Vendas por Mês */}
        {monthlyData.length > 0 && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Vendas por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart width={800} height={300} data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Vendas']} />
                <Line type="monotone" dataKey="vendas" stroke="#0088FE" strokeWidth={2} />
              </LineChart>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabela de oportunidades recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Oportunidades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Título</th>
                  <th className="text-left p-2">Valor</th>
                  <th className="text-left p-2">Estágio</th>
                  <th className="text-left p-2">Probabilidade</th>
                  <th className="text-left p-2">Data de Criação</th>
                </tr>
              </thead>
              <tbody>
                {data.opportunities?.slice(0, 10).map((opp) => (
                  <tr key={opp.id} className="border-b">
                    <td className="p-2">{opp.title}</td>
                    <td className="p-2">R$ {(opp.value || 0).toLocaleString('pt-BR')}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        opp.stage === 'closed_won' ? 'bg-green-100 text-green-800' :
                        opp.stage === 'closed_lost' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {opp.stage === 'prospection' ? 'Prospecção' :
                         opp.stage === 'qualification' ? 'Qualificação' :
                         opp.stage === 'proposal' ? 'Proposta' :
                         opp.stage === 'negotiation' ? 'Negociação' :
                         opp.stage === 'closed_won' ? 'Ganhou' :
                         opp.stage === 'closed_lost' ? 'Perdeu' : opp.stage}
                      </span>
                    </td>
                    <td className="p-2">{opp.probability || 0}%</td>
                    <td className="p-2">{new Date(opp.created_at).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
