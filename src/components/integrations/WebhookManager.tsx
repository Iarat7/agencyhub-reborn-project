
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Trash2, 
  Edit, 
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const WebhookManager = () => {
  const [webhooks, setWebhooks] = useState([
    {
      id: '1',
      name: 'Zapier - Novo Cliente',
      url: 'https://hooks.zapier.com/hooks/catch/12345/abcdef',
      events: ['client.created', 'client.updated'],
      status: 'active',
      lastTriggered: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Slack - Notificações',
      url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
      events: ['opportunity.created', 'task.completed'],
      status: 'active',
      lastTriggered: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      name: 'Discord - Alertas',
      url: 'https://discord.com/api/webhooks/123456789/XXXXXXXXXXXXXXXXXXXXXXXXX',
      events: ['contract.signed'],
      status: 'inactive',
      lastTriggered: null
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[]
  });

  const availableEvents = [
    'client.created',
    'client.updated',
    'client.deleted',
    'opportunity.created',
    'opportunity.updated',
    'opportunity.won',
    'opportunity.lost',
    'task.created',
    'task.completed',
    'contract.signed',
    'payment.received'
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const handleCreateWebhook = () => {
    if (newWebhook.name && newWebhook.url && newWebhook.events.length > 0) {
      const webhook = {
        id: Date.now().toString(),
        ...newWebhook,
        status: 'active',
        lastTriggered: null
      };
      setWebhooks([...webhooks, webhook]);
      setNewWebhook({ name: '', url: '', events: [] });
      setIsCreating(false);
    }
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
  };

  const toggleEventSelection = (event: string) => {
    const events = newWebhook.events.includes(event)
      ? newWebhook.events.filter(e => e !== event)
      : [...newWebhook.events, event];
    setNewWebhook({ ...newWebhook, events });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Webhooks</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure webhooks para receber notificações em tempo real
              </p>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Criar Webhook</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="webhook-name">Nome</Label>
                    <Input
                      id="webhook-name"
                      value={newWebhook.name}
                      onChange={(e) => setNewWebhook({...newWebhook, name: e.target.value})}
                      placeholder="Ex: Zapier - Novos Clientes"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="webhook-url">URL</Label>
                    <Input
                      id="webhook-url"
                      value={newWebhook.url}
                      onChange={(e) => setNewWebhook({...newWebhook, url: e.target.value})}
                      placeholder="https://hooks.zapier.com/..."
                    />
                  </div>
                  
                  <div>
                    <Label>Eventos</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {availableEvents.map((event) => (
                        <Button
                          key={event}
                          variant={newWebhook.events.includes(event) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => toggleEventSelection(event)}
                          className="text-xs"
                        >
                          {event}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateWebhook}>
                      Criar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-8">
              <ExternalLink className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Nenhum webhook configurado</h3>
              <p className="text-muted-foreground">
                Crie webhooks para receber notificações em outras plataformas
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Eventos</TableHead>
                    <TableHead>Última Execução</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{webhook.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {webhook.url}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(webhook.status)} className="gap-1">
                          {getStatusIcon(webhook.status)}
                          {webhook.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {webhook.events.slice(0, 2).map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                          {webhook.events.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{webhook.events.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {webhook.lastTriggered 
                            ? new Date(webhook.lastTriggered).toLocaleString('pt-BR')
                            : 'Nunca'
                          }
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteWebhook(webhook.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
