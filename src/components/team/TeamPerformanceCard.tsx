
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';

interface User {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

interface TeamPerformanceCardProps {
  users: User[];
}

export const TeamPerformanceCard = ({ users }: TeamPerformanceCardProps) => {
  // Mock data para demonstrar funcionalidade
  const performanceData = users.map((user, index) => ({
    ...user,
    tasksCompleted: Math.floor(Math.random() * 20) + 5,
    tasksTotal: Math.floor(Math.random() * 10) + 15,
    clientsManaged: Math.floor(Math.random() * 8) + 2,
    revenue: Math.floor(Math.random() * 50000) + 10000,
    efficiency: Math.floor(Math.random() * 30) + 70,
  }));

  const topPerformer = performanceData.reduce((top, current) => 
    current.efficiency > top.efficiency ? current : top
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-blue-600';
    if (efficiency >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Resumo geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {performanceData.reduce((sum, user) => sum + user.tasksCompleted, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {performanceData.reduce((sum, user) => sum + user.clientsManaged, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Clientes Ativos</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  R$ {(performanceData.reduce((sum, user) => sum + user.revenue, 0) / 1000).toFixed(0)}k
                </p>
                <p className="text-sm text-muted-foreground">Receita Gerada</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(performanceData.reduce((sum, user) => sum + user.efficiency, 0) / performanceData.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Eficiência Média</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Destaque do mês */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Destaque do Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border">
            <Avatar className="h-16 w-16">
              <AvatarImage src={topPerformer.avatar_url} />
              <AvatarFallback className="text-lg">
                {getInitials(topPerformer.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{topPerformer.full_name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {topPerformer.role === 'admin' ? 'Administrador' : 
                 topPerformer.role === 'manager' ? 'Gerente' : 'Usuário'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">{topPerformer.tasksCompleted}</p>
                  <p className="text-muted-foreground">Tarefas</p>
                </div>
                <div>
                  <p className="font-medium">{topPerformer.clientsManaged}</p>
                  <p className="text-muted-foreground">Clientes</p>
                </div>
                <div>
                  <p className="font-medium">R$ {(topPerformer.revenue / 1000).toFixed(0)}k</p>
                  <p className="text-muted-foreground">Receita</p>
                </div>
                <div>
                  <p className={`font-medium ${getEfficiencyColor(topPerformer.efficiency)}`}>
                    {topPerformer.efficiency}%
                  </p>
                  <p className="text-muted-foreground">Eficiência</p>
                </div>
              </div>
            </div>
            <Badge variant="default" className="bg-yellow-500">
              <Trophy className="h-4 w-4 mr-1" />
              Top
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Performance individual */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Individual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {performanceData.map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <Avatar>
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>
                    {getInitials(user.full_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{user.full_name}</h4>
                    <span className={`text-sm font-medium ${getEfficiencyColor(user.efficiency)}`}>
                      {user.efficiency}% eficiência
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        {user.tasksCompleted}/{user.tasksTotal + user.tasksCompleted} tarefas
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{user.clientsManaged} clientes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">R$ {(user.revenue / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  
                  <Progress value={user.efficiency} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
