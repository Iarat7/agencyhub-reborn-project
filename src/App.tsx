
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from '@/components/Layout';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { PWAProvider } from '@/contexts/PWAContext';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Auth from '@/pages/Auth';
import Clientes from '@/pages/Clientes';
import ClienteDashboard from '@/pages/ClienteDashboard';
import ClienteAssociacoes from '@/pages/ClienteAssociacoes';
import Oportunidades from '@/pages/Oportunidades';
import Tarefas from '@/pages/Tarefas';
import Agenda from '@/pages/Agenda';
import Relatorios from '@/pages/Relatorios';
import Estrategias from '@/pages/Estrategias';
import Contratos from '@/pages/Contratos';
import Financeiro from '@/pages/Financeiro';
import Equipe from '@/pages/Equipe';
import Configuracoes from '@/pages/Configuracoes';
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
      <PWAProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <AuthGuard>
                    <Layout>
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/clientes" element={<Clientes />} />
                        <Route path="/clientes/:id" element={<ClienteDashboard />} />
                        <Route path="/clientes/:id/associacoes" element={<ClienteAssociacoes />} />
                        <Route path="/oportunidades" element={<Oportunidades />} />
                        <Route path="/tarefas" element={<Tarefas />} />
                        <Route path="/agenda" element={<Agenda />} />
                        <Route path="/relatorios" element={<Relatorios />} />
                        <Route path="/estrategias" element={<Estrategias />} />
                        <Route path="/contratos" element={<Contratos />} />
                        <Route path="/financeiro" element={<Financeiro />} />
                        <Route path="/equipe" element={<Equipe />} />
                        <Route path="/configuracoes" element={<Configuracoes />} />
                        <Route path="/integracoes" element={<Integracoes />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Layout>
                  </AuthGuard>
                }
              />
            </Routes>
            <Toaster />
          </Router>
        </NotificationProvider>
      </PWAProvider>
    </QueryClientProvider>
  );
}

export default App;
