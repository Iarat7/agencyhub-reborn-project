
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthProvider } from "@/hooks/useAuth";
import { AppLayout } from '@/components/layout/AppLayout';
import Landing from "./pages/Landing";

// Lazy loading das páginas
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Clientes = lazy(() => import("./pages/Clientes"));
const Oportunidades = lazy(() => import("./pages/Oportunidades"));
const Tarefas = lazy(() => import("./pages/Tarefas"));
const Agenda = lazy(() => import("./pages/Agenda"));
const Relatorios = lazy(() => import("./pages/Relatorios"));
const Financeiro = lazy(() => import("./pages/Financeiro"));
const Contratos = lazy(() => import("./pages/Contratos"));
const Estrategias = lazy(() => import("./pages/Estrategias"));
const Equipe = lazy(() => import("./pages/Equipe"));
const Integracoes = lazy(() => import("./pages/Integracoes"));
const Configuracoes = lazy(() => import("./pages/Configuracoes"));
const ClienteDashboard = lazy(() => import("./pages/ClienteDashboard"));
const Auth = lazy(() => import("./pages/Auth"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="flex items-center justify-center h-screen">Carregando...</div>}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/landing" element={<Navigate to="/" replace />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Rotas protegidas com layout */}
                <Route path="/dashboard" element={
                  <AuthGuard>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </AuthGuard>
                } />
                
                <Route path="/clientes" element={
                  <AuthGuard>
                    <AppLayout>
                      <Clientes />
                    </AppLayout>
                  </AuthGuard>
                } />
                
                <Route path="/clientes/:id" element={
                  <AuthGuard>
                    <AppLayout>
                      <ClienteDashboard />
                    </AppLayout>
                  </AuthGuard>
                } />
                
                <Route path="/oportunidades" element={
                  <AuthGuard>
                    <AppLayout>
                      <Oportunidades />
                    </AppLayout>
                  </AuthGuard>
                } />
                
                <Route path="/tarefas" element={
                  <AuthGuard>
                    <AppLayout>
                      <Tarefas />
                    </AppLayout>
                  </AuthGuard>
                } />
                
                <Route path="/agenda" element={
                  <AuthGuard>
                    <AppLayout>
                      <Agenda />
                    </AppLayout>
                  </AuthGuard>
                } />
                
                <Route path="/relatorios" element={
                  <AuthGuard>
                    <AppLayout>
                      <Relatorios />
                    </AppLayout>
                  </AuthGuard>
                } />
                
                <Route path="/financeiro" element={
                  <AuthGuard>
                    <AppLayout>
                      <Financeiro />
                    </AppLayout>
                  </AuthGuard>
                } />
                
                <Route path="/contratos" element={
                  <AuthGuard>
                    <AppLayout>
                      <Contratos />
                    </AppLayout>
                  </AuthGuard>
                } />
                
                <Route path="/estrategias" element={
                  <AuthGuard>
                    <AppLayout>
                      <Estrategias />
                    </AppLayout>
                  </AuthGuard>
                } />
                
                <Route path="/equipe" element={
                  <AuthGuard>
                    <AppLayout>
                      <Equipe />
                    </AppLayout>
                  </AuthGuard>
                } />
                
                <Route path="/integracoes" element={
                  <AuthGuard>
                    <AppLayout>
                      <Integracoes />
                    </AppLayout>
                  </AuthGuard>
                } />
                
                <Route path="/configuracoes" element={
                  <AuthGuard>
                    <AppLayout>
                      <Configuracoes />
                    </AppLayout>
                  </AuthGuard>
                } />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
