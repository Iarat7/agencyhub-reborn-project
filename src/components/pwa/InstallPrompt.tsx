
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface InstallPromptProps {
  onDismiss: () => void;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({ onDismiss }) => {
  const { installPWA } = usePWA();

  const handleInstall = async () => {
    await installPWA();
    onDismiss();
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 mx-auto max-w-md z-50 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Instalar AgencyHub</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Instale o app para acesso rápido e funcionamento offline
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex space-x-2">
          <Button onClick={handleInstall} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Instalar
          </Button>
          <Button variant="outline" onClick={onDismiss}>
            Agora não
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
