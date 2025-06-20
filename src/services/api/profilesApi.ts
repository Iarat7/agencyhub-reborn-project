
import { SupabaseApi } from './supabaseApi';
import type { User } from './types';

export class ProfilesApi extends SupabaseApi<User> {
  constructor() {
    super('profiles');
  }

  async getCurrentUserProfile(): Promise<User | null> {
    const { data: user } = await this.supabase.auth.getUser();
    
    if (!user.user) return null;

    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as User;
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data as User;
  }

  async createAdminUser(): Promise<void> {
    const { error } = await this.supabase.rpc('create_admin_user');
    
    if (error) {
      console.error('Error creating admin user:', error);
      throw error;
    }
  }
}
