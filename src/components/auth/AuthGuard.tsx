
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, loading } = useAuth();

  console.log('🛡️ AuthGuard check:', { user: user ? 'Present' : 'Null', loading });

  if (loading) {
    console.log('⏳ AuthGuard: Loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🚫 AuthGuard: No user, redirecting to auth...');
    return <Navigate to="/auth" replace />;
  }

  console.log('✅ AuthGuard: User authenticated, rendering children...');
  return <>{children}</>;
};
