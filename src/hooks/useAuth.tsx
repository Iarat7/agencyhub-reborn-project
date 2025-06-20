
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '@/services';
import type { User } from '@/services/api/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Verificar usuário atual na inicialização
    authService.getCurrentUser().then(({ user }) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    return result;
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    const result = await authService.signUp(email, password, userData);
    return result;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const result = await authService.resetPassword(email);
    return result;
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword
  };

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
