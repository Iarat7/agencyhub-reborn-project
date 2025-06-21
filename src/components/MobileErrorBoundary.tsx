
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export class MobileErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('🚨 Mobile Error Boundary caught error:', error);
    console.error('🚨 Error stack:', error.stack);
    console.error('🚨 Error message:', error.message);
    console.error('🚨 Error name:', error.name);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🚨 Error details:', error);
    console.error('🚨 Error info:', errorInfo);
    console.error('🚨 Component stack:', errorInfo.componentStack);
    console.log('📱 User agent:', navigator.userAgent);
    console.log('📱 Screen size:', screen.width, 'x', screen.height);
    console.log('📱 Available memory:', (navigator as any).deviceMemory || 'unknown');
    console.log('📱 Connection:', (navigator as any).connection || 'unknown');
    console.log('📱 Platform:', navigator.platform);
    console.log('📱 Languages:', navigator.languages);
    
    // Tentar identificar se é erro de memória ou performance
    if (error.message.includes('Maximum call stack') || error.message.includes('out of memory')) {
      console.error('🚨 MEMORY ERROR detected on mobile device');
    }
    
    // Tentar identificar se é erro de componente específico
    if (errorInfo.componentStack) {
      console.error('🚨 Error occurred in component:', errorInfo.componentStack.split('\n')[1]);
    }

    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="text-center max-w-md bg-white rounded-lg shadow-lg p-6">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Erro na aplicação</h2>
            <p className="text-gray-600 mb-4">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            
            {this.state.error && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                  Detalhes do erro (para suporte)
                </summary>
                <div className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                  <p><strong>Erro:</strong> {this.state.error.message}</p>
                  <p><strong>Tipo:</strong> {this.state.error.name}</p>
                  {this.state.error.stack && (
                    <p><strong>Stack:</strong> {this.state.error.stack.substring(0, 200)}...</p>
                  )}
                </div>
              </details>
            )}
            
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Recarregar página
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  // Limpar localStorage e tentar novamente
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.href = '/auth';
                }}
                className="w-full text-xs"
              >
                Limpar dados e fazer login novamente
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
