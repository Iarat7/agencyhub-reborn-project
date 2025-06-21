
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Users, Check, X } from 'lucide-react';

export const TeamRolesCard = () => {
  const roles = [
    {
      id: 'admin',
      name: 'Administrador',
      icon: <Crown className="h-5 w-5" />,
      color: 'destructive' as const,
      description: 'Acesso total ao sistema',
      permissions: [
        'Gerenciar usuários e permissões',
        'Configurar sistema',
        'Acessar relatórios financeiros',
        'Gerenciar integrações',
        'Deletar dados',
        'Exportar dados',
      ]
    },
    {
      id: 'manager',
      name: 'Gerente',
      icon: <Shield className="h-5 w-5" />,
      color: 'default' as const,
      description: 'Gerenciamento de equipe e projetos',
      permissions: [
        'Gerenciar projetos',
        'Visualizar relatórios',
        'Gerenciar tarefas da equipe',
        'Acessar dashboard completo',
        'Criar contratos',
        'Gerenciar clientes',
      ]
    },
    {
      id: 'user',
      name: 'Usuário',
      icon: <Users className="h-5 w-5" />,
      color: 'secondary' as const,
      description: 'Acesso básico para executar tarefas',
      permissions: [
        'Visualizar tarefas próprias',
        'Atualizar status de tarefas',
        'Acessar calendário',
        'Visualizar clientes',
        'Criar oportunidades',
        'Visualizar dashboard básico',
      ]
    }
  ];

  const restrictedPermissions = [
    'Deletar dados do sistema',
    'Alterar configurações globais',
    'Gerenciar faturamento',
    'Acessar logs do sistema',
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {role.icon}
                {role.name}
                <Badge variant={role.color} className="ml-auto">
                  {role.id.toUpperCase()}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {role.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Permissões:</h4>
                <ul className="space-y-2">
                  {role.permissions.map((permission, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {permission}
                    </li>
                  ))}
                </ul>
                
                {role.id !== 'admin' && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      Sem acesso a:
                    </h4>
                    <ul className="space-y-1">
                      {restrictedPermissions.slice(0, role.id === 'user' ? 4 : 2).map((permission, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <X className="h-4 w-4 text-red-500" />
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Permissões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Políticas de Segurança</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Autenticação obrigatória para todos os usuários</li>
                  <li>• Sessões expiram após 24 horas de inatividade</li>
                  <li>• Logs de auditoria para ações administrativas</li>
                  <li>• Validação de permissões em tempo real</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Hierarquia de Acesso</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Administrador: Acesso total</li>
                  <li>• Gerente: Acesso de supervisão</li>
                  <li>• Usuário: Acesso operacional</li>
                  <li>• Convidado: Somente leitura (se habilitado)</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
