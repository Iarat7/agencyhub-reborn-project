
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target, 
  User, 
  Calendar, 
  DollarSign, 
  Brain,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Strategy } from '@/hooks/useStrategies';
import { useClients } from '@/hooks/useClients';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StrategyDetailsDialogProps {
  strategy: Strategy | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StrategyDetailsDialog = ({ strategy, open, onOpenChange }: StrategyDetailsDialogProps) => {
  const { data: clients = [] } = useClients();

  if (!strategy) return null;

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      created: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.created;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      created: 'Criada',
      approved: 'Aprovada',
      in_progress: 'Em Execução',
      completed: 'Executada',
      cancelled: 'Cancelada',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'created':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <AlertTriangle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {strategy.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{strategy.client_id ? getClientName(strategy.client_id) : 'Estratégia Geral'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={`${getStatusColor(strategy.status || 'created')} flex items-center gap-1 w-fit`}>
                    {getStatusIcon(strategy.status || 'created')}
                    {getStatusLabel(strategy.status || 'created')}
                  </Badge>
                </div>

                {strategy.budget && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Orçamento</label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{formatCurrency(strategy.budget)}</span>
                    </div>
                  </div>
                )}

                {strategy.deadline && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Prazo</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(strategy.deadline), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                  </div>
                )}
              </div>

              {strategy.ai_generated && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Estratégia Gerada por IA</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Esta estratégia foi automaticamente gerada pela nossa IA com base na análise dos dados do cliente.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Objetivos */}
          {strategy.objectives && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Objetivos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{strategy.objectives}</p>
              </CardContent>
            </Card>
          )}

          {/* Desafios */}
          {strategy.challenges && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Desafios</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{strategy.challenges}</p>
              </CardContent>
            </Card>
          )}

          {/* Público-Alvo */}
          {strategy.target_audience && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Público-Alvo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{strategy.target_audience}</p>
              </CardContent>
            </Card>
          )}

          {/* Conteúdo da IA */}
          {strategy.ai_strategy_content && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Estratégia Recomendada pela IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {strategy.ai_strategy_content}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações da Criação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Criada em: </span>
                  <span>{format(new Date(strategy.created_at!), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                </div>
                {strategy.updated_at && strategy.updated_at !== strategy.created_at && (
                  <div>
                    <span className="font-medium text-muted-foreground">Última atualização: </span>
                    <span>{format(new Date(strategy.updated_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
