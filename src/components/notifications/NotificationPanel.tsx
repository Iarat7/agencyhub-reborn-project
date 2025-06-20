
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationList } from './NotificationList';
import { NotificationSettings } from './NotificationSettings';
import { Settings, List } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
}

export const NotificationPanel = ({ onClose }: NotificationPanelProps) => {
  return (
    <div className="w-96 h-96">
      <Tabs defaultValue="list" className="w-full h-full">
        <div className="p-4 border-b">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="list" className="mt-0 h-full">
          <NotificationList onClose={onClose} />
        </TabsContent>

        <TabsContent value="settings" className="mt-0 p-4 overflow-auto">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
