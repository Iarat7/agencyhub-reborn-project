
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Mail, 
  MessageSquare, 
  Calendar, 
  CreditCard,
  Database,
  Settings,
  CheckCircle,
  AlertCircle,
  Plus,
  Link2,
  Chrome,
  Facebook,
  Instagram,
  TrendingUp
} from 'lucide-react';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { WebhookManager } from '@/components/integrations/WebhookManager';
import { APIKeysManager } from '@/components/integrations/APIKeysManager';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  status: 'connected' | 'available' | 'coming-soon';
  color: string;
  features: string[];
}

export default function Integracoes() {
  const [activeIntegrations, setActiveIntegrations] = useState<string[]>([]);

  const availableIntegrations: Integration[] = [
    {
      id: 'google-ads',
      name: 'Google Ads',
      description: 'Conecte contas do Google Ads para importar campanhas e métricas',
      icon: <Chrome className="h-8 w-8" />,
      category: 'advertising',
      status: 'available',
      color: 'blue',
      features: ['Métricas de campanhas', 'Performance de anúncios', 'Custos e conversões']
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Integre com Google Analytics para insights detalhados',
      icon: <TrendingUp className="h-8 w-8" />,
      category: 'analytics',
      status: 'available',
      color: 'orange',
      features: ['Tráfego do site', 'Conversões', 'Comportamento do usuário']
    },
    {
      id: 'facebook-ads',
      name: 'Facebook Ads',
      description: 'Conecte suas contas do Facebook Ads para métricas completas',
      icon: <Facebook className="h-8 w-8" />,
      category: 'advertising',
      status: 'available',
      color: 'blue',
      features: ['Campanhas Facebook', 'ROI e métricas', 'Audiências']
    },
    {
      id: 'instagram-insights',
      name: 'Instagram Insights',
      description: 'Analise o desempenho das páginas do Instagram dos clientes',
      icon: <Instagram className="h-8 w-8" />,
      category: 'social-media',
      status: 'available',
      color: 'pink',
      features: ['Métricas de posts', 'Crescimento de seguidores', 'Engagement']
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Automatize fluxos de trabalho conectando com mais de 5000 apps',
      icon: <Zap className="h-8 w-8" />,
      category: 'automation',
      status: 'available',
      color: 'orange',
      features: ['Automação de tarefas', 'Triggers personalizados', 'Conecta 5000+ apps']
    },
    {
      id: 'email',
      name: 'Email Marketing',
      description: 'Integração com provedores de email como Mailchimp, SendGrid',
      icon: <Mail className="h-8 w-8" />,
      category: 'marketing',
      status: 'available',
      color: 'blue',
      features: ['Campanhas automáticas', 'Segmentação', 'Analytics']
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Envie mensagens e notificações via WhatsApp',
      icon: <MessageSquare className="h-8 w-8" />,
      category: 'communication',
      status: 'available',
      color: 'green',
      features: ['Mensagens automáticas', 'Templates', 'Chat bot']
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sincronize eventos e reuniões com Google Calendar',
      icon: <Calendar className="h-8 w-8" />,
      category: 'productivity',
      status: 'available',
      color: 'red',
      features: ['Sync bidirecional', 'Lembretes', 'Convites automáticos']
    }
  ];

  const categories = [
    { id: 'all', name: 'Todas', icon: <Settings className="h-4 w-4" /> },
    { id: 'advertising', name: 'Publicidade', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'social-media', name: 'Redes Sociais', icon: <Instagram className="h-4 w-4" /> },
    { id: 'analytics', name: 'Analytics', icon: <Database className="h-4 w-4" /> },
    { id: 'automation', name: 'Automação', icon: <Zap className="h-4 w-4" /> },
    { id: 'marketing', name: 'Marketing', icon: <Mail className="h-4 w-4" /> },
    { id: 'communication', name: 'Comunicação', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'productivity', name: 'Produtividade', icon: <Calendar className="h-4 w-4" /> },
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredIntegrations = selectedCategory === 'all' 
    ? availableIntegrations 
    : availableIntegrations.filter(integration => integration.category === selectedCategory);

  const connectedCount = availableIntegrations.filter(i => i.status === 'connected').length;
  const availableCount = availableIntegrations.filter(i => i.status === 'available').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrações</h1>
          <p className="text-muted-foreground">
            Conecte seu CRM com Google Ads, Facebook, Instagram e outras ferramentas
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Solicitar Integração
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{connectedCount}</p>
                <p className="text-sm text-muted-foreground">Conectadas</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{availableCount}</p>
                <p className="text-sm text-muted-foreground">Disponíveis</p>
              </div>
              <Link2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{availableIntegrations.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <Settings className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">0</p>
                <p className="text-sm text-muted-foreground">Em Breve</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api-keys">Chaves API</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          {/* Filtros por categoria */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>

          {/* Lista de integrações */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                isActive={activeIntegrations.includes(integration.id)}
                onToggle={(id, active) => {
                  if (active) {
                    setActiveIntegrations([...activeIntegrations, id]);
                  } else {
                    setActiveIntegrations(activeIntegrations.filter(i => i !== id));
                  }
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookManager />
        </TabsContent>

        <TabsContent value="api-keys">
          <APIKeysManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
