
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MobileOptimizedLoader } from '@/components/MobileOptimizedLoader';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();

  console.log('🛡️ AuthGuard check:', { 
    user: user ? 'Present' : 'Null', 
    loading,
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  });

  if (loading) {
    console.log('⏳ AuthGuard: Loading...');
    return <MobileOptimizedLoader message="Verificando autenticação..." />;
  }

  if (!user) {
    console.log('🚫 AuthGuard: No user, redirecting to auth...');
    return <Navigate to="/auth" replace />;
  }

  console.log('✅ AuthGuard: User authenticated, rendering children...');
  return <>{children}</>;
};
