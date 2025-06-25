import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import { OrganizationProvider } from '@/contexts/OrganizationContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import Landing from '@/pages/Landing';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Clientes from '@/pages/Clientes';
import ClienteDashboard from '@/pages/ClienteDashboard';
import ClienteAssociacoes from '@/pages/ClienteAssociacoes';
import Oportunidades from '@/pages/Oportunidades';
import Tarefas from '@/pages/Tarefas';
import Equipe from '@/pages/Equipe';
import Financeiro from '@/pages/Financeiro';
import Contratos from '@/pages/Contratos';
import Relatorios from '@/pages/Relatorios';
import Configuracoes from '@/pages/Configuracoes';
import Agenda from '@/pages/Agenda';
import Estrategias from '@/pages/Estrategias';
import Integracoes from '@/pages/Integracoes';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OrganizationProvider>
          <BrowserRouter>
            <div className="App">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/dashboard"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/clientes"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <Clientes />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/cliente/:id"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <ClienteDashboard />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/cliente/:id/associacoes"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <ClienteAssociacoes />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/oportunidades"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <Oportunidades />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/tarefas"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <Tarefas />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/equipe"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <Equipe />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/financeiro"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <Financeiro />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/contratos"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <Contratos />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/relatorios"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <Relatorios />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/configuracoes"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <Configuracoes />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/agenda"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <Agenda />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/estrategias"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <Estrategias />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/integracoes"
                  element={
                    <AuthGuard>
                      <AppLayout>
                        <Integracoes />
                      </AppLayout>
                    </AuthGuard>
                  }
                />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
              <Toaster />
            </div>
          </BrowserRouter>
        </OrganizationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
