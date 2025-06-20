import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { AppLayout } from '@/components/layout/AppLayout';
import { Landing } from '@/pages/Landing';
import { Auth } from '@/pages/Auth';
import { Dashboard } from '@/pages/Dashboard';
import { Clientes } from '@/pages/Clientes';
import { ClienteDashboard } from '@/pages/ClienteDashboard';
import { Tarefas } from '@/pages/Tarefas';
import { Oportunidades } from '@/pages/Oportunidades';
import Contratos from '@/pages/Contratos';
import Financeiro from '@/pages/Financeiro';
import Agenda from '@/pages/Agenda';
import { Relatorios } from '@/pages/Relatorios';
import { Configuracoes } from '@/pages/Configuracoes';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
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
              path="/clientes/:id"
              element={
                <AuthGuard>
                  <AppLayout>
                    <ClienteDashboard />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
