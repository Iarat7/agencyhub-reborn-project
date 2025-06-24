
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Shield, 
  Users, 
  Settings,
  UserPlus,
  Lock
} from 'lucide-react';
import { RolePermissionsManager } from './RolePermissionsManager';

export const TeamRolesCard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const roles = [
    {
      name: 'Administrador',
      icon: Crown,
      color: 'destructive' as const,
      permissions: [
        'Acesso total ao sistema',
        'Gerenciar usuários e permissões',
        'Configurações avançadas',
        'Relatórios administrativos'
      ],
      count: 2
    },
    {
      name: 'Gerente',
      icon: Shield,
      color: 'default' as const,
      permissions: [
        'Gerenciar equipe',
        'Visualizar relatórios',
        'Aprovar transações',
        'Configurar processos'
      ],
      count: 5
    },
    {
      name: 'Usuário',
      icon: Users,
      color: 'secondary' as const,
      permissions: [
        'Gerenciar clientes',
        'Criar oportunidades',
        'Executar tarefas',
        'Visualizar dados próprios'
      ],
      count: 12
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Funções e Permissões</h2>
          <p className="text-muted-foreground">
            Configure as permissões de acesso para cada função
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Gerenciar Permissões
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.name} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <role.icon className="h-5 w-5" />
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                    </div>
                    <Badge variant={role.color}>
                      {role.count} usuários
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Permissões:</h4>
                    <ul className="space-y-1">
                      {role.permissions.map((permission, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Usuário
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button onClick={() => setActiveTab('permissions')}>
              <Settings className="h-4 w-4 mr-2" />
              Configurar Permissões Detalhadas
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <RolePermissionsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
