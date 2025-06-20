
import { supabase } from '@/integrations/supabase/client';

export class AdminService {
  // Criar usuário admin para testes
  static async createAdminUser(): Promise<{ success: boolean; error?: string }> {
    try {
      // Primeiro, verificar se o usuário admin já existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin')
        .single();

      if (existingProfile) {
        return { success: true }; // Admin já existe
      }

      // Criar o usuário admin
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'admin@agencyhub.com',
        password: 'admin123',
        options: {
          data: {
            full_name: 'Administrador'
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        // Atualizar o perfil para admin
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil para admin:', profileError);
        }
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Verificar se existe algum admin no sistema
  static async hasAdminUser(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (error) {
        console.error('Erro ao verificar admin:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Erro ao verificar admin:', error);
      return false;
    }
  }
}
