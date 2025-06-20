
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Eye, EyeOff, GripVertical } from 'lucide-react';
import { DashboardMetrics } from './DashboardMetrics';
import { PredictiveAnalytics } from './PredictiveAnalytics';
import { SmartInsights } from './SmartInsights';
import { NotificationAlerts } from './NotificationAlerts';

interface Widget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  visible: boolean;
  order: number;
}

interface DashboardWidgetsProps {
  metrics?: any;
  predictiveData?: any;
  insights?: any;
}

export const DashboardWidgets = ({ metrics, predictiveData, insights }: DashboardWidgetsProps) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: 'notifications',
      title: 'Alertas e Notificações',
      component: NotificationAlerts,
      visible: true,
      order: 1
    },
    {
      id: 'metrics',
      title: 'Métricas Principais',
      component: DashboardMetrics,
      visible: true,
      order: 2
    },
    {
      id: 'predictive',
      title: 'Análise Preditiva',
      component: PredictiveAnalytics,
      visible: true,
      order: 3
    },
    {
      id: 'insights',
      title: 'Insights Inteligentes',
      component: SmartInsights,
      visible: true,
      order: 4
    }
  ]);

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, visible: !widget.visible }
          : widget
      )
    );
  };

  const visibleWidgets = widgets
    .filter(widget => widget.visible)
    .sort((a, b) => a.order - b.order);

  const getWidgetProps = (widgetId: string) => {
    switch (widgetId) {
      case 'metrics':
        return { metrics };
      case 'predictive':
        return { metrics: predictiveData };
      case 'insights':
        return { insights };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com controles de customização */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dashboard Personalizado</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {isCustomizing ? 'Finalizar' : 'Personalizar'}
        </Button>
      </div>

      {/* Painel de customização */}
      {isCustomizing && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configurar Widgets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {widgets.map((widget) => (
                <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <Label htmlFor={`widget-${widget.id}`} className="font-medium">
                      {widget.title}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    {widget.visible ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Switch
                      id={`widget-${widget.id}`}
                      checked={widget.visible}
                      onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Renderização dos widgets visíveis */}
      <div className="space-y-6">
        {visibleWidgets.map((widget) => {
          const WidgetComponent = widget.component;
          const props = getWidgetProps(widget.id);
          
          return (
            <div key={widget.id} className="relative">
              {isCustomizing && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleWidgetVisibility(widget.id)}
                  >
                    <EyeOff className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <WidgetComponent {...props} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
