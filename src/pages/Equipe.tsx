
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Shield,
  UserPlus,
  Crown,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { TeamMembersTable } from '@/components/team/TeamMembersTable';
import { TeamRolesCard } from '@/components/team/TeamRolesCard';
import { TeamPerformanceCard } from '@/components/team/TeamPerformanceCard';
import { useUsers } from '@/hooks/useUsers';

export default function Equipe() {
  const { data: users = [], isLoading } = useUsers();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'manager': return 'default';
      case 'user': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'user': return 'Usuário';
      default: return 'Indefinido';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'manager': return <Shield className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie sua equipe e configure permissões
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-700">
              Sistema de convites em manutenção
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Membros
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Funções
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{users.length}</p>
                    <p className="text-sm text-muted-foreground">Total de Membros</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {users.filter(u => u.role === 'admin').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Administradores</p>
                  </div>
                  <Crown className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {users.filter(u => u.role === 'manager').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Gerentes</p>
                  </div>
                  <Shield className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {users.filter(u => u.role === 'user').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Usuários</p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <TeamMembersTable users={users} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="roles">
          <TeamRolesCard />
        </TabsContent>

        <TabsContent value="performance">
          <TeamPerformanceCard users={users} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
