
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { User } from '@/services/api/types';

interface TeamPerformanceCardProps {
  users: User[];
}

export const TeamPerformanceCard = ({ users }: TeamPerformanceCardProps) => {
  // Dados mockados para demonstração
  const performanceData = users.map(user => ({
    name: user.full_name || 'Usuário',
    vendas: Math.floor(Math.random() * 50) + 10,
    tarefas: Math.floor(Math.random() * 30) + 5,
    eficiencia: Math.floor(Math.random() * 40) + 60
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="vendas" fill="#3b82f6" name="Vendas" />
                <Bar dataKey="tarefas" fill="#10b981" name="Tarefas" />
                <Bar dataKey="eficiencia" fill="#f59e0b" name="Eficiência %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {performanceData.slice(0, 3).map((member, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{member.name}</h3>
                  <Badge variant="outline">{member.eficiencia}% eficiência</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Vendas</span>
                    <span className="font-medium">{member.vendas}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tarefas</span>
                    <span className="font-medium">{member.tarefas}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
