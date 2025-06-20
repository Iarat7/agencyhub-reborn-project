
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, Users, Video, Mail, Smartphone, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'connected' | 'available' | 'coming-soon';
  features: string[];
}

export const CalendarIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sincronize eventos com sua conta Google',
      icon: <Calendar className="w-5 h-5" />,
      status: 'available',
      features: ['Sincronização bidirecional', 'Notificações', 'Convites automáticos']
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      description: 'Integração com Outlook e Exchange',
      icon: <Mail className="w-5 h-5" />,
      status: 'available',
      features: ['Emails de convite', 'Sincronização de calendário', 'Teams integration']
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Criação automática de reuniões',
      icon: <Video className="w-5 h-5" />,
      status: 'available',
      features: ['Links automáticos', 'Gravação', 'Sala de espera']
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Lembretes via WhatsApp',
      icon: <Smartphone className="w-5 h-5" />,
      status: 'coming-soon',
      features: ['Lembretes automáticos', 'Confirmação de presença', 'Reagendamento']
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Reuniões e colaboração',
      icon: <Users className="w-5 h-5" />,
      status: 'available',
      features: ['Reuniões online', 'Compartilhamento', 'Chat integrado']
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Conecte com 5000+ aplicativos',
      icon: <Zap className="w-5 h-5" />,
      status: 'available',
      features: ['Automações personalizadas', 'Triggers', 'Workflows']
    }
  ]);

  const { toast } = useToast();

  const handleToggleIntegration = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    if (integration.status === 'coming-soon') {
      toast({
        title: 'Em breve',
        description: 'Esta integração estará disponível em breve.',
        variant: 'destructive',
      });
      return;
    }

    // Simular conexão/desconexão
    setIntegrations(prev => prev.map(i => 
      i.id === integrationId 
        ? { ...i, status: i.status === 'connected' ? 'available' : 'connected' }
        : i
    ));

    toast({
      title: integration.status === 'connected' ? 'Desconectado' : 'Conectado',
      description: `${integration.name} foi ${integration.status === 'connected' ? 'desconectado' : 'conectado'} com sucesso.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800">Conectado</Badge>;
      case 'available':
        return <Badge variant="secondary">Disponível</Badge>;
      case 'coming-soon':
        return <Badge variant="outline">Em breve</Badge>;
      default:
        return null;
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Integrações do Calendário
          </CardTitle>
          <Badge variant="outline">
            {connectedCount} conectadas
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  {integration.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{integration.name}</h4>
                    {getStatusBadge(integration.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {integration.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integration.status !== 'coming-soon' && (
                  <Switch
                    checked={integration.status === 'connected'}
                    onCheckedChange={() => handleToggleIntegration(integration.id)}
                  />
                )}
                {integration.status === 'coming-soon' && (
                  <Button variant="ghost" size="sm" disabled>
                    Em breve
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Dica Inteligente</h4>
          <p className="text-sm text-blue-800">
            Conecte o Google Calendar para sincronização automática de eventos e o Zoom para criar links de reunião automaticamente ao agendar compromissos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
