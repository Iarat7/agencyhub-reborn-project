
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useUsers } from '@/hooks/useUsers';

export interface CalendarFilters {
  eventTypes: string[];
  clients: string[];
  assignees: string[];
}

interface CalendarFiltersProps {
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
}

export const CalendarFilters = ({ filters, onFiltersChange }: CalendarFiltersProps) => {
  const { data: clients = [] } = useClients();
  const { data: users = [] } = useUsers();

  const eventTypes = [
    { value: 'meeting', label: 'Reunião' },
    { value: 'call', label: 'Chamada' },
    { value: 'deadline', label: 'Prazo' },
    { value: 'reminder', label: 'Lembrete' },
  ];

  const addEventTypeFilter = (eventType: string) => {
    if (!filters.eventTypes.includes(eventType)) {
      const newFilters = {
        ...filters,
        eventTypes: [...filters.eventTypes, eventType],
      };
      onFiltersChange(newFilters);
    }
  };

  const removeEventTypeFilter = (eventType: string) => {
    const newFilters = {
      ...filters,
      eventTypes: filters.eventTypes.filter(t => t !== eventType),
    };
    onFiltersChange(newFilters);
  };

  const addClientFilter = (clientId: string) => {
    if (!filters.clients.includes(clientId)) {
      const newFilters = {
        ...filters,
        clients: [...filters.clients, clientId],
      };
      onFiltersChange(newFilters);
    }
  };

  const removeClientFilter = (clientId: string) => {
    const newFilters = {
      ...filters,
      clients: filters.clients.filter(c => c !== clientId),
    };
    onFiltersChange(newFilters);
  };

  const addAssigneeFilter = (assigneeId: string) => {
    if (!filters.assignees.includes(assigneeId)) {
      const newFilters = {
        ...filters,
        assignees: [...filters.assignees, assigneeId],
      };
      onFiltersChange(newFilters);
    }
  };

  const removeAssigneeFilter = (assigneeId: string) => {
    const newFilters = {
      ...filters,
      assignees: filters.assignees.filter(a => a !== assigneeId),
    };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({
      eventTypes: [],
      clients: [],
      assignees: [],
    });
  };

  const hasActiveFilters = filters.eventTypes.length > 0 || filters.clients.length > 0 || filters.assignees.length > 0;

  return (
    <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Filter className="w-3 h-3" />
          Filtros
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-medium mb-1 block">Tipo de Evento</label>
          <Select onValueChange={addEventTypeFilter} value="">
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Selecionar tipo" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes
                .filter(type => !filters.eventTypes.includes(type.value))
                .map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block">Cliente</label>
          <Select onValueChange={addClientFilter} value="">
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Selecionar cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients
                .filter(client => !filters.clients.includes(client.id))
                .map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block">Responsável</label>
          <Select onValueChange={addAssigneeFilter} value="">
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Selecionar responsável" />
            </SelectTrigger>
            <SelectContent>
              {users
                .filter(user => !filters.assignees.includes(user.id))
                .map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name || user.email || 'Usuário'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="space-y-2">
          {filters.eventTypes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-muted-foreground">Tipos:</span>
              {filters.eventTypes.map((type) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {eventTypes.find(t => t.value === type)?.label}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => removeEventTypeFilter(type)}
                  />
                </Badge>
              ))}
            </div>
          )}

          {filters.clients.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-muted-foreground">Clientes:</span>
              {filters.clients.map((clientId) => {
                const client = clients.find(c => c.id === clientId);
                return (
                  <Badge key={clientId} variant="secondary" className="text-xs">
                    {client?.name}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer"
                      onClick={() => removeClientFilter(clientId)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}

          {filters.assignees.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-muted-foreground">Responsáveis:</span>
              {filters.assignees.map((assigneeId) => {
                const user = users.find(u => u.id === assigneeId);
                return (
                  <Badge key={assigneeId} variant="secondary" className="text-xs">
                    {user?.full_name || user?.email || 'Usuário'}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer"
                      onClick={() => removeAssigneeFilter(assigneeId)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
