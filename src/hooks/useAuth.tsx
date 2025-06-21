
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
      // Em dispositivos móveis, não deixar erro de perfil bloquear a aplicação
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        console.log('📱 Mobile device detected, continuing without full profile...');
      }
    }
  };

  useEffect(() => {
    console.log('🚀 Initializing auth...');
    console.log('📱 Device info:', {
      userAgent: navigator.userAgent,
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
      screen: { width: screen.width, height: screen.height }
    });
    
    let mounted = true;
    
    // Configurar listener de mudanças de autenticação
    const unsubscribe = authService.onAuthStateChange(async (authUser) => {
      if (!mounted) return;
      
      console.log('🔄 Auth state changed:', authUser ? 'User logged in' : 'User logged out');
      
      if (authUser) {
        console.log('👤 User found, refreshing profile...');
        // Usar timeout para evitar bloqueios em dispositivos móveis
        setTimeout(async () => {
          if (mounted) {
            await refreshProfile();
            if (mounted) {
              setLoading(false);
            }
          }
        }, 100);
      } else {
        console.log('👤 No user, clearing state...');
        setUser(null);
        setLoading(false);
      }
    });

    // Verificar usuário atual na inicialização
    authService.getCurrentUser().then(async ({ user: authUser }) => {
      if (!mounted) return;
      
      console.log('🔍 Checking current user:', authUser ? 'Found' : 'Not found');
      
      if (authUser) {
        console.log('👤 Current user found, refreshing profile...');
        setTimeout(async () => {
          if (mounted) {
            await refreshProfile();
            if (mounted) {
              setLoading(false);
            }
          }
        }, 100);
      } else {
        console.log('👤 No current user');
        setUser(null);
        setLoading(false);
      }
    }).catch((error) => {
      console.error('❌ Error checking current user:', error);
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting sign in...');
    const result = await authService.signIn(email, password);
    
    if (result.user && !result.error) {
      console.log('✅ Sign in successful, refreshing profile...');
      // Buscar dados completos do perfil após login
      setTimeout(async () => {
        await refreshProfile();
      }, 100);
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

  console.log('🔄 Auth state:', { 
    user: user ? 'Present' : 'Null', 
    loading,
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  });

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
