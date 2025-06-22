
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Clock } from 'lucide-react';

export const CalendarIntegrations = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="w-5 h-5" />
          Integrações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="font-medium mb-2">Em Manutenção</h3>
          <p className="text-sm">
            As integrações de calendário estão temporariamente indisponíveis.
          </p>
          <p className="text-xs mt-2">
            Implementação prevista para próximas versões.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
