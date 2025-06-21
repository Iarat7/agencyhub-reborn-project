
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Brain, 
  User, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Clock,
  PlayCircle,
  FileText,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Strategy } from '@/hooks/useStrategies';
import { useClients } from '@/hooks/useClients';
import { StrategyDetailsDialog } from './StrategyDetailsDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StrategiesKanbanProps {
  strategies: Strategy[];
  onStatusChange: (strategyId: string, newStatus: string) => void;
}

export const StrategiesKanban = ({ strategies, onStatusChange }: StrategiesKanbanProps) => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const { data: clients = [] } = useClients();

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleViewStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setDetailsDialogOpen(true);
  };

  const columns = [
    {
      id: 'created',
      title: 'Criadas',
      icon: FileText,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      id: 'approved',
      title: 'Aprovadas',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800 border-green-200',
    },
    {
      id: 'in_progress',
      title: 'Em Execução',
      icon: PlayCircle,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    },
    {
      id: 'completed',
      title: 'Executadas',
      icon: Clock,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
    },
  ];

  const getStrategiesByStatus = (status: string) => {
    return strategies.filter(strategy => strategy.status === status);
  };

  const getStatusOptions = (currentStatus: string) => {
    const statusFlow = ['created', 'approved', 'in_progress', 'completed'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    return statusFlow.filter((_, index) => index !== currentIndex);
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      created: 'Criada',
      approved: 'Aprovada',
      in_progress: 'Em Execução',
      completed: 'Executada',
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnStrategies = getStrategiesByStatus(column.id);
          const ColumnIcon = column.icon;
          
          return (
            <div key={column.id} className="space-y-4">
              <Card className={`border-2 ${column.color}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <ColumnIcon className="h-4 w-4" />
                    {column.title}
                    <Badge variant="secondary" className="ml-auto">
                      {columnStrategies.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
              </Card>

              <div className="space-y-3">
                {columnStrategies.map((strategy) => (
                  <Card key={strategy.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {strategy.title}
                          </h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewStrategy(strategy)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Visualizar
                              </DropdownMenuItem>
                              {getStatusOptions(strategy.status || 'created').map((status) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() => onStatusChange(strategy.id, status)}
                                >
                                  Mover para {getStatusLabel(status)}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            {strategy.client_id ? getClientName(strategy.client_id) : 'Geral'}
                          </div>

                          {strategy.budget && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <DollarSign className="h-3 w-3" />
                              {formatCurrency(strategy.budget)}
                            </div>
                          )}

                          {strategy.deadline && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(strategy.deadline), 'dd/MM/yyyy', { locale: ptBR })}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {strategy.ai_generated && (
                            <Badge variant="outline" className="text-xs">
                              <Brain className="h-3 w-3 mr-1" />
                              IA
                            </Badge>
                          )}
                          
                          <span className="text-xs text-muted-foreground ml-auto">
                            {format(new Date(strategy.created_at!), 'dd/MM', { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {columnStrategies.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center">
                      <ColumnIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Nenhuma estratégia {column.title.toLowerCase()}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <StrategyDetailsDialog
        strategy={selectedStrategy}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </>
  );
};
