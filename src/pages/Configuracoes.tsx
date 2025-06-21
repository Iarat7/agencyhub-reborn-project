
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ProfileEditDialog } from '@/components/profile/ProfileEditDialog';
import { useAuth } from '@/hooks/useAuth';
import { User, Bell, Shield, Database, Edit } from 'lucide-react';

const Configuracoes = () => {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
        <p className="text-slate-600 mt-2">Gerencie as configurações do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Perfil do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" value={user?.full_name || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa</Label>
              <Input id="empresa" value={user?.company_name || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" value={user?.phone || ''} disabled />
            </div>
            <Button 
              className="w-full" 
              onClick={() => setProfileDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Email de novos clientes</Label>
                <p className="text-sm text-slate-600">Receber email quando um novo cliente for cadastrado</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Email de oportunidades</Label>
                <p className="text-sm text-slate-600">Receber email sobre mudanças nas oportunidades</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Relatórios semanais</Label>
                <p className="text-sm text-slate-600">Receber relatório semanal por email</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senha-atual">Senha Atual</Label>
              <Input id="senha-atual" type="password" placeholder="Digite sua senha atual" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nova-senha">Nova Senha</Label>
              <Input id="nova-senha" type="password" placeholder="Digite uma nova senha" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmar-senha">Confirmar Nova Senha</Label>
              <Input id="confirmar-senha" type="password" placeholder="Confirme a nova senha" />
            </div>
            <Button className="w-full" variant="outline">Alterar Senha</Button>
          </CardContent>
        </Card>

        {/* Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database size={20} />
              Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Versão do Sistema</Label>
              <Input value="InflowHub v1.0.0" disabled />
            </div>
            <div className="space-y-2">
              <Label>Último Backup</Label>
              <Input value="15/01/2024 - 14:30" disabled />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">Fazer Backup</Button>
              <Button variant="outline" className="flex-1">Restaurar Backup</Button>
            </div>
            <Separator />
            <div className="pt-2">
              <Button variant="destructive" className="w-full">
                Limpar Dados do Sistema
              </Button>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Esta ação não pode ser desfeita
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProfileEditDialog 
        open={profileDialogOpen} 
        onOpenChange={setProfileDialogOpen} 
      />
    </div>
  );
};

export default Configuracoes;
