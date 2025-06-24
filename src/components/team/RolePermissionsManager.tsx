
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Crown, 
  Users, 
  Settings,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ModulePermission {
  module: string;
  name: string;
  actions: {
    action: string;
    name: string;
    description: string;
  }[];
}

const modulePermissions: ModulePermission[] = [
  {
    module: 'clients',
    name: 'Clientes',
    actions: [
      { action: 'view', name: 'Visualizar', description: 'Ver lista e detalhes dos clientes' },
      { action: 'create', name: 'Criar', description: 'Adicionar novos clientes' },
      { action: 'edit', name: 'Editar', description: 'Modificar dados dos clientes' },
      { action: 'delete', name: 'Excluir', description: 'Remover clientes do sistema' },
      { action: 'export', name: 'Exportar', description: 'Baixar dados dos clientes' },
    ]
  },
  {
    module: 'opportunities',
    name: 'Oportunidades',
    actions: [
      { action: 'view', name: 'Visualizar', description: 'Ver oportunidades de venda' },
      { action: 'create', name: 'Criar', description: 'Adicionar novas oportunidades' },
      { action: 'edit', name: 'Editar', description: 'Modificar oportunidades existentes' },
      { action: 'delete', name: 'Excluir', description: 'Remover oportunidades' },
      { action: 'export', name: 'Exportar', description: 'Baixar dados das oportunidades' },
    ]
  },
  {
    module: 'tasks',
    name: 'Tarefas',
    actions: [
      { action: 'view', name: 'Visualizar', description: 'Ver tarefas do sistema' },
      { action: 'create', name: 'Criar', description: 'Criar novas tarefas' },
      { action: 'edit', name: 'Editar', description: 'Modificar tarefas existentes' },
      { action: 'delete', name: 'Excluir', description: 'Remover tarefas' },
      { action: 'assign', name: 'Atribuir', description: 'Designar tarefas para outros usuários' },
    ]
  },
  {
    module: 'financial',
    name: 'Financeiro',
    actions: [
      { action: 'view', name: 'Visualizar', description: 'Ver dados financeiros' },
      { action: 'create', name: 'Criar', description: 'Adicionar entradas financeiras' },
      { action: 'edit', name: 'Editar', description: 'Modificar registros financeiros' },
      { action: 'delete', name: 'Excluir', description: 'Remover registros financeiros' },
      { action: 'export', name: 'Exportar', description: 'Baixar relatórios financeiros' },
    ]
  },
  {
    module: 'team',
    name: 'Equipe',
    actions: [
      { action: 'view', name: 'Visualizar', description: 'Ver membros da equipe' },
      { action: 'invite', name: 'Convidar', description: 'Enviar convites para novos membros' },
      { action: 'edit', name: 'Editar', description: 'Modificar dados dos membros' },
      { action: 'delete', name: 'Remover', description: 'Remover membros da equipe' },
      { action: 'manage_roles', name: 'Gerenciar Funções', description: 'Alterar funções dos membros' },
    ]
  },
  {
    module: 'reports',
    name: 'Relatórios',
    actions: [
      { action: 'view', name: 'Visualizar', description: 'Ver relatórios básicos' },
      { action: 'export', name: 'Exportar', description: 'Baixar relatórios' },
      { action: 'advanced', name: 'Avançados', description: 'Acessar relatórios avançados' },
    ]
  }
];

export const RolePermissionsManager = () => {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState({
    admin: modulePermissions.reduce((acc, module) => ({
      ...acc,
      [module.module]: module.actions.map(a => a.action)
    }), {}),
    manager: {
      clients: ['view', 'create', 'edit', 'export'],
      opportunities: ['view', 'create', 'edit', 'export'],
      tasks: ['view', 'create', 'edit', 'assign'],
      financial: ['view', 'export'],
      team: ['view', 'invite'],
      reports: ['view', 'export']
    },
    user: {
      clients: ['view', 'create', 'edit'],
      opportunities: ['view', 'create', 'edit'],
      tasks: ['view', 'create', 'edit'],
      financial: ['view'],
      team: ['view'],
      reports: ['view']
    }
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'manager': return <Shield className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'user': return 'Usuário';
      default: return 'Usuário';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'manager': return 'default';
      case 'user': return 'secondary';
      default: return 'outline';
    }
  };

  const handlePermissionToggle = (role: string, module: string, action: string) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [module]: prev[role][module]?.includes(action)
          ? prev[role][module].filter(a => a !== action)
          : [...(prev[role][module] || []), action]
      }
    }));
  };

  const handleSave = () => {
    // Aqui você salvaria as permissões no backend
    console.log('Saving permissions:', permissions);
    toast({
      title: "Permissões atualizadas",
      description: "As permissões foram salvas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Permissões</h2>
          <p className="text-muted-foreground">
            Configure o que cada função pode acessar no sistema
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="admin" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          {['admin', 'manager', 'user'].map((role) => (
            <TabsTrigger key={role} value={role} className="flex items-center gap-2">
              {getRoleIcon(role)}
              {getRoleLabel(role)}
            </TabsTrigger>
          ))}
        </TabsList>

        {['admin', 'manager', 'user'].map((role) => (
          <TabsContent key={role} value={role} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getRoleIcon(role)}
                    Permissões para {getRoleLabel(role)}
                  </CardTitle>
                  <Badge variant={getRoleColor(role)}>
                    {getRoleLabel(role)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {modulePermissions.map((module) => (
                  <div key={module.module} className="space-y-3">
                    <h4 className="font-semibold text-lg">{module.name}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {module.actions.map((action) => (
                        <div key={action.action} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="space-y-1">
                            <div className="font-medium">{action.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {action.description}
                            </div>
                          </div>
                          <Switch
                            checked={permissions[role][module.module]?.includes(action.action) || false}
                            onCheckedChange={() => handlePermissionToggle(role, module.module, action.action)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
