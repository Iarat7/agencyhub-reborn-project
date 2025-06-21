
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Target,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react';
import { useStrategies, Strategy } from '@/hooks/useStrategies';
import { useClients } from '@/hooks/useClients';
import { StrategyDetailsDialog } from './StrategyDetailsDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ClientStrategiesTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  const { data: strategies = [], isLoading } = useStrategies();
  const { data: clients = [] } = useClients();

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

  const handleViewStrategy = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setDetailsDialogOpen(true);
  };

  const filteredStrategies = strategies.filter(strategy =>
    strategy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getClientName(strategy.client_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <span>Carregando estratégias...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Estratégias de Clientes
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar estratégias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStrategies.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Nenhuma estratégia encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando sua primeira estratégia personalizada
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Orçamento</TableHead>
                    <TableHead>Prazo</TableHead>
                    <TableHead>Criada em</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStrategies.map((strategy) => (
                    <TableRow key={strategy.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{strategy.title}</p>
                          {strategy.ai_generated && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              IA Generated
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {strategy.client_id ? getClientName(strategy.client_id) : 'Geral'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(strategy.status || 'created')}>
                          {getStatusLabel(strategy.status || 'created')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {strategy.budget ? (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            {formatCurrency(strategy.budget)}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {strategy.deadline ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {format(new Date(strategy.deadline), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(strategy.created_at!), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewStrategy(strategy)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <StrategyDetailsDialog
        strategy={selectedStrategy}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />
    </>
  );
};
