
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Crown, Shield, Users, Mail, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/contexts/OrganizationContext';

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: string;
}

export const InviteUserDialog = ({ open, onOpenChange, defaultRole }: InviteUserDialogProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();

  // Set default role when dialog opens
  useEffect(() => {
    if (open && defaultRole) {
      setRole(defaultRole);
    }
  }, [open, defaultRole]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setEmail('');
      setRole('');
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Starting invite submission...', { email, role, organizationId: currentOrganization?.id });
    
    if (!email || !role) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (!user || !currentOrganization) {
      toast({
        title: "Erro de contexto",
        description: "Usuário ou organização não encontrados",
        variant: "destructive",
      });
      return;
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um endereço de email válido",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Calling send-team-invite function...');
      
      const { data, error } = await supabase.functions.invoke('send-team-invite', {
        body: {
          email: email.toLowerCase().trim(),
          role,
          organizationId: currentOrganization.id,
          inviterName: user.full_name || user.email || 'Membro da equipe',
          organizationName: currentOrganization.name
        }
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Erro ao enviar convite');
      }

      console.log('Invite sent successfully!');

      toast({
        title: "✅ Convite enviado!",
        description: `Convite enviado para ${email} com função de ${getRoleLabel(role)}. O convite é válido por 7 dias.`,
      });
      
      setEmail('');
      setRole('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error sending invite:', error);
      
      let errorMessage = "Ocorreu um erro ao enviar o convite. Tente novamente.";
      
      if (error.message?.includes('Já existe um convite pendente')) {
        errorMessage = "Já existe um convite pendente para este email nesta organização.";
      } else if (error.message?.includes('RESEND_API_KEY')) {
        errorMessage = "Configuração de email não encontrada. Entre em contato com o administrador.";
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = "Email inválido. Verifique o endereço e tente novamente.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro ao enviar convite",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = (roleValue: string) => {
    switch (roleValue) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gerente';
      case 'user': return 'Usuário';
      default: return 'Usuário';
    }
  };

  const getRoleDescription = (roleValue: string) => {
    switch (roleValue) {
      case 'admin': return 'Acesso total ao sistema, pode gerenciar usuários e configurações';
      case 'manager': return 'Pode gerenciar equipe, ver relatórios e aprovar transações';
      case 'user': return 'Acesso básico para gerenciar clientes, oportunidades e tarefas';
      default: return '';
    }
  };

  if (!currentOrganization) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Convidar Novo Membro
          </DialogTitle>
          <DialogDescription>
            Envie um convite por e-mail para adicionar um novo membro à organização "{currentOrganization.name}"
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Função *</Label>
              <Select value={role} onValueChange={setRole} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Usuário</div>
                        <div className="text-xs text-muted-foreground">Acesso básico ao sistema</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="manager">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Gerente</div>
                        <div className="text-xs text-muted-foreground">Pode gerenciar equipe e relatórios</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Administrador</div>
                        <div className="text-xs text-muted-foreground">Acesso total ao sistema</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {role && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <strong>{getRoleLabel(role)}:</strong> {getRoleDescription(role)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !email || !role}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Convite
                