
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Building2, Plus, Settings, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Organizations = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDescription, setNewOrgDescription] = useState('');
  
  const { user } = useAuth();
  const { organizations, currentOrganization, switchOrganization, refreshOrganizations } = useOrganization();
  const { toast } = useToast();

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newOrgName.trim()) return;

    setIsLoading(true);
    
    try {
      // Criar slug único
      const slug = `${newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
      
      const { data: newOrg, error } = await supabase
        .from('organizations')
        .insert({
          name: newOrgName.trim(),
          slug: slug,
          description: newOrgDescription.trim() || null,
          owner_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar organização:', error);
        toast({
          title: "Erro ao criar organização",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Adicionar usuário como admin da organização
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: newOrg.id,
          user_id: user.id,
          role: 'admin',
          status: 'active'
        });

      if (memberError) {
        console.error('Erro ao adicionar membro:', memberError);
        toast({
          title: "Organizaçao criada, mas erro ao adicionar membro",
          description: memberError.message,
          variant: "destructive", 
        });
      } else {
        toast({
          title: "Organização criada com sucesso!",
          description: `${newOrg.name} foi criada e você é o administrador.`,
        });
      }

      // Limpar formulário e fechar modal
      setNewOrgName('');
      setNewOrgDescription('');
      setIsCreateOpen(false);
      
      // Atualizar lista de organizações
      await refreshOrganizations();
      
    } catch (error) {
      console.error('Erro geral:', error);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao criar a organização.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchOrganization = (orgId: string) => {
    switchOrganization(orgId);
    toast({
      title: "Organização alterada",
      description: "Você alterou para uma nova organização.",
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Organizações</h1>
          <p className="text-slate-600 mt-2">Gerencie suas organizações e crie novas</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Organização
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Organização</DialogTitle>
              <DialogDescription>
                Crie uma nova organização para separar seus dados e equipes.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateOrganization} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Organização *</Label>
                <Input
                  id="name"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="Ex: Minha Empresa"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newOrgDescription}
                  onChange={(e) => setNewOrgDescription(e.target.value)}
                  placeholder="Descreva sua organização..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Criando...' : 'Criar Organização'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Organização Atual */}
      {currentOrganization && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-900">Organização Atual</CardTitle>
                <CardDescription className="text-blue-700">
                  Você está trabalhando nesta organização
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold text-lg text-blue-900 mb-2">
              {currentOrganization.name}
            </h3>
            {currentOrganization.description && (
              <p className="text-blue-700 mb-4">{currentOrganization.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Users className="h-4 w-4" />
              <span>Você é {currentOrganization.owner_id === user?.id ? 'proprietário' : 'membro'}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Organizações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {organizations.map((org) => (
          <Card 
            key={org.id} 
            className={`cursor-pointer transition-colors hover:shadow-lg ${
              currentOrganization?.id === org.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-slate-50'
            }`}
            onClick={() => {
              if (currentOrganization?.id !== org.id) {
                handleSwitchOrganization(org.id);
              }
            }}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-slate-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{org.name}</CardTitle>
                    {currentOrganization?.id === org.id && (
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1" />
                    )}
                  </div>
                </div>
                {org.owner_id === user?.id && (
                  <Settings className="h-4 w-4 text-slate-400" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {org.description && (
                <p className="text-sm text-slate-600 mb-3">{org.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {org.owner_id === user?.id ? 'Proprietário' : 'Membro'}
                </span>
                <span>
                  Criado em {new Date(org.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {organizations.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Nenhuma organização encontrada
            </h3>
            <p className="text-slate-600 mb-6">
              Você ainda não possui nenhuma organização. Crie uma para começar.
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Organização
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Organizations;
