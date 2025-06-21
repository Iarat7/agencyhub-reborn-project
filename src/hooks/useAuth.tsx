
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/services';
import { ProfilesApi } from '@/services/api/profilesApi';
import type { User } from '@/services/api/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const profilesApi = new ProfilesApi();

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    try {
      console.log('🔄 Refreshing profile...');
      const profile = await profilesApi.getCurrentUserProfile();
      console.log('✅ Profile refreshed:', profile);
      setUser(profile);
    } catch (error) {
      console.error('❌ Error refreshing profile:', error);
    }
  };

  useEffect(() => {
    console.log('🚀 Initializing auth...');
    
    // Configurar listener de mudanças de autenticação
    const unsubscribe = authService.onAuthStateChange(async (authUser) => {
      console.log('🔄 Auth state changed:', authUser ? 'User logged in' : 'User logged out');
      
      if (authUser) {
        console.log('👤 User found, refreshing profile...');
        // Buscar dados completos do perfil
        await refreshProfile();
      } else {
        console.log('👤 No user, clearing state...');
        setUser(null);
      }
      setLoading(false);
    });

    // Verificar usuário atual na inicialização
    authService.getCurrentUser().then(async ({ user: authUser }) => {
      console.log('🔍 Checking current user:', authUser ? 'Found' : 'Not found');
      
      if (authUser) {
        console.log('👤 Current user found, refreshing profile...');
        await refreshProfile();
      } else {
        console.log('👤 No current user');
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting sign in...');
    const result = await authService.signIn(email, password);
    
    if (result.user && !result.error) {
      console.log('✅ Sign in successful, refreshing profile...');
      // Buscar dados completos do perfil após login
      await refreshProfile();
    } else if (result.error) {
      console.error('❌ Sign in error:', result.error);
    }
    
    return {
      ...result,
      user: user // Retornar o user com dados completos do perfil
    };
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    console.log('📝 Attempting sign up...');
    const result = await authService.signUp(email, password, userData);
    console.log('📝 Sign up result:', result.error ? 'Error' : 'Success');
    return result;
  };

  const signOut = async () => {
    console.log('🚪 Signing out...');
    await authService.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    console.log('🔑 Resetting password for:', email);
    const result = await authService.resetPassword(email);
    return result;
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    refreshProfile
  };

  console.log('🔄 Auth state:', { user: user ? 'Present' : 'Null', loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
