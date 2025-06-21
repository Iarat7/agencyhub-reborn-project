
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Settings, Zap } from 'lucide-react';

interface GoogleIntegrationCardProps {
  title: string;
  description: string;
  isConnected?: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  icon: React.ReactNode;
}

export const GoogleIntegrationCard = ({
  title,
  description,
  isConnected = false,
  onConnect,
  onDisconnect,
  icon
}: GoogleIntegrationCardProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Aqui será implementada a lógica de conexão com Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação
      onConnect();
      toast({
        title: "Integração conectada",
        description: `${title} foi conectado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar a integração.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulação
      onDisconnect();
      toast({
        title: "Integração desconectada",
        description: `${title} foi desconectado.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível desconectar a integração.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Conectado" : "Desconectado"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected && (
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            )}
          </div>
          
          {isConnected ? (
            <Button
              variant="outline"
              onClick={handleDisconnect}
              disabled={isLoading}
              size="sm"
            >
              Desconectar
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={isLoading}
              size="sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              Conectar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
