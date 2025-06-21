
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  ExternalLink, 
  Settings, 
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

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

interface IntegrationCardProps {
  integration: Integration;
  isActive: boolean;
  onToggle: (id: string, active: boolean) => void;
}

export const IntegrationCard = ({ integration, isActive, onToggle }: IntegrationCardProps) => {
  const [isConfiguring, setIsConfiguring] = useState(false);

  const getStatusIcon = () => {
    switch (integration.status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'available':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'coming-soon':
        return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusText = () => {
    switch (integration.status) {
      case 'connected': return 'Conectado';
      case 'available': return 'Disponível';
      case 'coming-soon': return 'Em Breve';
    }
  };

  const getStatusColor = () => {
    switch (integration.status) {
      case 'connected': return 'default';
      case 'available': return 'secondary';
      case 'coming-soon': return 'outline';
    }
  };

  const handleConnect = () => {
    if (integration.status === 'available') {
      setIsConfiguring(true);
      // Simular configuração
      setTimeout(() => {
        setIsConfiguring(false);
        onToggle(integration.id, true);
      }, 2000);
    }
  };

  return (
    <Card className={`transition-all hover:shadow-md ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${integration.color}-100`}>
              {integration.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <Badge variant={getStatusColor()} className="mt-1 gap-1">
                {getStatusIcon()}
                {getStatusText()}
              </Badge>
            </div>
          </div>
          {integration.status === 'connected' && (
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => onToggle(integration.id, checked)}
            />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {integration.description}
        </p>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Recursos:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {integration.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex gap-2 pt-2">
          {integration.status === 'connected' ? (
            <>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </>
          ) : integration.status === 'available' ? (
            <Button 
              onClick={handleConnect}
              disabled={isConfiguring}
              className="w-full"
              size="sm"
            >
              {isConfiguring ? 'Conectando...' : 'Conectar'}
            </Button>
          ) : (
            <Button disabled className="w-full" size="sm">
              Em Breve
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
