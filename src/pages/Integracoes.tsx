
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GoogleIntegrationCard } from '@/components/integrations/GoogleIntegrationCard';
import { 
  Zap, 
  Globe, 
  BarChart3,
  Instagram,
  Facebook,
  MessageSquare,
  Info
} from 'lucide-react';

export default function Integracoes() {
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>([]);

  const handleConnect = (integration: string) => {
    setConnectedIntegrations(prev => [...prev, integration]);
  };

  const handleDisconnect = (integration: string) => {
    setConnectedIntegrations(prev => prev.filter(item => item !== integration));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrações</h1>
          <p className="text-muted-foreground">
            Conecte suas ferramentas favoritas ao InflowHub
          </p>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          As integrações estão em desenvolvimento. Em breve você poderá conectar suas contas do Google Ads, Facebook e Instagram para importar dados automaticamente.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="marketing" className="space-y-6">
        <TabsList>
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Marketing Digital
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Redes Sociais
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <GoogleIntegrationCard
              title="Google Ads"
              description="Conecte suas campanhas do Google Ads para importar métricas e performance."
              isConnected={connectedIntegrations.includes('google-ads')}
              onConnect={() => handleConnect('google-ads')}
              onDisconnect={() => handleDisconnect('google-ads')}
              icon={<Zap className="h-5 w-5 text-blue-600" />}
            />

            <GoogleIntegrationCard
              title="Facebook Ads"
              description="Integre suas campanhas do Facebook para análise completa de performance."
              isConnected={connectedIntegrations.includes('facebook-ads')}
              onConnect={() => handleConnect('facebook-ads')}
              onDisconnect={() => handleDisconnect('facebook-ads')}
              icon={<Facebook className="h-5 w-5 text-blue-700" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <GoogleIntegrationCard
              title="Instagram Business"
              description="Conecte sua conta comercial do Instagram para insights e métricas."
              isConnected={connectedIntegrations.includes('instagram')}
              onConnect={() => handleConnect('instagram')}
              onDisconnect={() => handleDisconnect('instagram')}
              icon={<Instagram className="h-5 w-5 text-pink-600" />}
            />

            <GoogleIntegrationCard
              title="Facebook Pages"
              description="Integre suas páginas do Facebook para métricas de engajamento."
              isConnected={connectedIntegrations.includes('facebook-pages')}
              onConnect={() => handleConnect('facebook-pages')}
              onDisconnect={() => handleDisconnect('facebook-pages')}
              icon={<Facebook className="h-5 w-5 text-blue-600" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <GoogleIntegrationCard
              title="Google Analytics"
              description="Conecte o Google Analytics para dados completos de tráfego web."
              isConnected={connectedIntegrations.includes('google-analytics')}
              onConnect={() => handleConnect('google-analytics')}
              onDisconnect={() => handleDisconnect('google-analytics')}
              icon={<BarChart3 className="h-5 w-5 text-orange-600" />}
            />

            <GoogleIntegrationCard
              title="Google Search Console"
              description="Integre o Search Console para dados de SEO e performance de busca."
              isConnected={connectedIntegrations.includes('search-console')}
              onConnect={() => handleConnect('search-console')}
              onDisconnect={() => handleDisconnect('search-console')}
              icon={<Globe className="h-5 w-5 text-green-600" />}
            />
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Como funcionam as integrações?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">1</span>
              </div>
              <div>
                <p className="font-medium">Conecte suas contas</p>
                <p className="text-muted-foreground">Autentique suas contas do Google, Facebook e Instagram de forma segura.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">2</span>
              </div>
              <div>
                <p className="font-medium">Vincule aos clientes</p>
                <p className="text-muted-foreground">Associe as contas conectadas aos seus clientes no sistema.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">3</span>
              </div>
              <div>
                <p className="font-medium">Acesse os dados</p>
                <p className="text-muted-foreground">Visualize métricas e insights diretamente no dashboard de cada cliente.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
