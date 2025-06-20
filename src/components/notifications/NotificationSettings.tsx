
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings, Bell, Calendar, Target, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  tasks_due_soon: boolean;
  tasks_overdue: boolean;
  opportunities_closing: boolean;
  new_clients: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
}

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>({
    tasks_due_soon: true,
    tasks_overdue: true,
    opportunities_closing: true,
    new_clients: true,
    email_notifications: false,
    push_notifications: true,
  });

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Aqui você salvaria no banco ou localStorage
    localStorage.setItem('notification_settings', JSON.stringify(settings));
    toast({
      title: 'Configurações salvas',
      description: 'Suas preferências de notificação foram atualizadas.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações de Notificações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Tipos de Notificação
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <Label htmlFor="tasks_due_soon">Tarefas próximas do vencimento</Label>
              </div>
              <Switch
                id="tasks_due_soon"
                checked={settings.tasks_due_soon}
                onCheckedChange={(value) => handleSettingChange('tasks_due_soon', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-500" />
                <Label htmlFor="tasks_overdue">Tarefas vencidas</Label>
              </div>
              <Switch
                id="tasks_overdue"
                checked={settings.tasks_overdue}
                onCheckedChange={(value) => handleSettingChange('tasks_overdue', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                <Label htmlFor="opportunities_closing">Oportunidades próximas do fechamento</Label>
              </div>
              <Switch
                id="opportunities_closing"
                checked={settings.opportunities_closing}
                onCheckedChange={(value) => handleSettingChange('opportunities_closing', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <Label htmlFor="new_clients">Novos clientes</Label>
              </div>
              <Switch
                id="new_clients"
                checked={settings.new_clients}
                onCheckedChange={(value) => handleSettingChange('new_clients', value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Métodos de Entrega</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="push_notifications">Notificações no navegador</Label>
              <Switch
                id="push_notifications"
                checked={settings.push_notifications}
                onCheckedChange={(value) => handleSettingChange('push_notifications', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="email_notifications">Notificações por email</Label>
              <Switch
                id="email_notifications"
                checked={settings.email_notifications}
                onCheckedChange={(value) => handleSettingChange('email_notifications', value)}
              />
            </div>
          </div>
        </div>

        <Button onClick={saveSettings} className="w-full">
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};
