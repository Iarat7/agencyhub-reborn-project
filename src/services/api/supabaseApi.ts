
import { supabase } from '@/integrations/supabase/client';
import type { IBaseApi, IAuthApi, IFileApi } from './baseApi';
import type { User, Client, Opportunity, Task } from './types';

// Implementação específica do Supabase
// No futuro, você pode criar uma FastApiImplementation que implementa as mesmas interfaces
export class SupabaseAuthApi implements IAuthApi {
  async signUp(email: string, password: string, userData?: any) {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    
    return { data, error: error?.message };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { data, error: error?.message };
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error: error?.message };
  }

  onAuthStateChange(callback: (user: any) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(session?.user || null);
      }
    );
    
    return () => subscription.unsubscribe();
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    return { error: error?.message };
  }
}

export class SupabaseApi<T> implements IBaseApi {
  constructor(private tableName: string) {}

  async get<T>(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw new Error(error.message);
    return data;
  }

  async list<T>(filters?: Record<string, any>): Promise<T[]> {
    let query = supabase.from(this.tableName).select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { data, error } = await query;
    
    if (error) throw new Error(error.message);
    return data || [];
  }

  async create<T>(data: Partial<T>): Promise<T | null> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return result;
  }

  async update<T>(id: string, data: Partial<T>): Promise<T | null> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
    return true;
  }
}

export class SupabaseFileApi implements IFileApi {
  constructor(private bucketName: string) {}

  async upload(file: File, path: string): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .upload(path, file);
    
    if (error) throw new Error(error.message);
    return data.path;
  }

  async delete(path: string): Promise<boolean> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([path]);
    
    if (error) throw new Error(error.message);
    return true;
  }

  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
}
