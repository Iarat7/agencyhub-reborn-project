
import { supabase } from '@/integrations/supabase/client';
import type { IBaseApi, IAuthApi, IFileApi } from './baseApi';
import type { User, AuthResponse } from './types';
import { Database } from '@/integrations/supabase/types';

// Implementação Supabase para autenticação
export class SupabaseAuthApi implements IAuthApi {
  async signUp(email: string, password: string, userData?: any): Promise<AuthResponse> {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });

    return {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email,
        ...userData
      } : null,
      session: data.session,
      error: error?.message
    };
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email
      } : null,
      session: data.session,
      error: error?.message
    };
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<AuthResponse> {
    const { data } = await supabase.auth.getUser();
    const { data: session } = await supabase.auth.getSession();
    
    return {
      user: data.user ? {
        id: data.user.id,
        email: data.user.email
      } : null,
      session: session.session
    };
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const user = session?.user ? {
          id: session.user.id,
          email: session.user.email
        } : null;
        callback(user);
      }
    );

    return () => subscription.unsubscribe();
  }

  async resetPassword(email: string): Promise<AuthResponse> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    return {
      user: null,
      session: null,
      error: error?.message
    };
  }
}

// Implementação Supabase para operações CRUD genéricas
export class SupabaseApi<T extends { id: string }> implements IBaseApi {
  constructor(private tableName: keyof Database['public']['Tables']) {}

  async get<T>(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching ${this.tableName}:`, error);
      return null;
    }

    return data as T;
  }

  async list<T>(filters?: Record<string, any>): Promise<T[]> {
    let query = supabase.from(this.tableName as any).select('*');

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error listing ${this.tableName}:`, error);
      return [];
    }

    return (data || []) as T[];
  }

  async create<T>(data: Partial<T>): Promise<T | null> {
    const { data: result, error } = await supabase
      .from(this.tableName as any)
      .insert(data as any)
      .select()
      .single();

    if (error) {
      console.error(`Error creating ${this.tableName}:`, error);
      return null;
    }

    return result as T;
  }

  async update<T>(id: string, data: Partial<T>): Promise<T | null> {
    const { data: result, error } = await supabase
      .from(this.tableName as any)
      .update(data as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${this.tableName}:`, error);
      return null;
    }

    return result as T;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.tableName as any)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting ${this.tableName}:`, error);
      return false;
    }

    return true;
  }
}

// Implementação Supabase para upload de arquivos
export class SupabaseFileApi implements IFileApi {
  constructor(private bucketName: string) {}

  async upload(file: File, path: string): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .upload(path, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    return data.path;
  }

  async delete(path: string): Promise<boolean> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([path]);

    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }

    return true;
  }

  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path);

    return data.publicUrl;
  }
}
