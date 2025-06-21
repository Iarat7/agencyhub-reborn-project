
import React from 'react';

interface MobileOptimizedLoaderProps {
  message?: string;
}

export const MobileOptimizedLoader = ({ message = "Carregando..." }: MobileOptimizedLoaderProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-sm">{message}</p>
        <div className="mt-4 text-xs text-gray-400">
          Aguarde um momento...
        </div>
      </div>
    </div>
  );
};
