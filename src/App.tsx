
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { OrganizationProvider } from '@/contexts/OrganizationContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { PWAProvider } from '@/contexts/PWAContext';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Auth from '@/pages/Auth';
import Landing from '@/pages/Landing';
import Organizations from '@/pages/Organizations';
import Clientes from '@/pages/Clientes';
import Oportunidades from '@/pages/Oportunidades';
import Tarefas from '@/pages/Tarefas';
import Agenda from '@/pages/Agenda';
import Financeiro from '@/pages/Financeiro';
import Contratos from '@/pages/Contratos';
import Estrategias from '@/pages/Estrategias';
import Relatorios from '@/pages/Relatorios';
import Configuracoes from '@/pages/Configuracoes';
import Equipe from '@/pages/Equipe';
import Integracoes from '@/pages/Integracoes';
import ClienteDashboard from '@/pages/ClienteDashboard';
import ClienteAssociacoes from '@/pages/ClienteAssociacoes';
import NotFound from '@/pages/NotFound';

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
      <PWAProvider>
        <NotificationProvider>
          <OrganizationProvider>
            <Router>
              <Routes>
                <Route path="/landing" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <AuthGuard>
                      <Index />
                    </AuthGuard>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="organizations" element={<Organizations />} />
                  <Route path="clientes" element={<Clientes />} />
                  <Route path="clientes/:clientId" element={<ClienteDashboard />} />
                  <Route path="clientes/:clientId/associacoes" element={<ClienteAssociacoes />} />
                  <Route path="oportunidades" element={<Oportunidades />} />
                  <Route path="tarefas" element={<Tarefas />} />
                  <Route path="agenda" element={<Agenda />} />
                  <Route path="financeiro" element={<Financeiro />} />
                  <Route path="contratos" element={<Contratos />} />
                  <Route path="estrategias" element={<Estrategias />} />
                  <Route path="relatorios" element={<Relatorios />} />
                  <Route path="configuracoes" element={<Configuracoes />} />
                  <Route path="equipe" element={<Equipe />} />
                  <Route path="integracoes" element={<Integracoes />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Toaster />
          </OrganizationProvider>
        </NotificationProvider>
      </PWAProvider>
    </QueryClientProvider>
  );
}

export default App;
