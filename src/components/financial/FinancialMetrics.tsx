
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { FinancialEntry } from '@/services/api/types';

interface FinancialMetricsProps {
  entries: FinancialEntry[];
}

export const FinancialMetrics = ({ entries }: FinancialMetricsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Cálculos das métricas
  const totalIncome = entries
    .filter(entry => entry.type === 'income' && entry.status === 'paid')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpenses = entries
    .filter(entry => entry.type === 'expense' && entry.status === 'paid')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const profit = totalIncome - totalExpenses;

  const pendingIncome = entries
    .filter(entry => entry.type === 'income' && entry.status === 'pending')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const pendingExpenses = entries
    .filter(entry => entry.type === 'expense' && entry.status === 'pending')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const overdueEntries = entries
    .filter(entry => entry.status === 'overdue').length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receitas Recebidas</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-green-700 mt-1">
            {formatCurrency(pendingIncome)} pendentes
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas Pagas</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-900">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-red-700 mt-1">
            {formatCurrency(pendingExpenses)} pendentes
          </p>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-br ${profit >= 0 ? 'from-blue-50 to-blue-100' : 'from-orange-50 to-orange-100'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
          <DollarSign className={`h-4 w-4 ${profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${profit >= 0 ? 'text-blue-900' : 'text-orange-900'}`}>
            {formatCurrency(profit)}
          </div>
          <p className={`text-xs mt-1 ${profit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
            {profit >= 0 ? 'Positivo' : 'Negativo'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Movimentações Vencidas</CardTitle>
          <Calendar className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-900">{overdueEntries}</div>
          <p className="text-xs text-yellow-700 mt-1">
            Requerem atenção
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
