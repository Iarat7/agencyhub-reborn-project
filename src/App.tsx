
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Landing from "./pages/Landing";

// Lazy loading das páginas - ajustando para named exports
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
                <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/app" element={
                  <AuthGuard>
                    <Index />
                  </AuthGuard>
                }>
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="clientes" element={<Clientes />} />
                  <Route path="clientes/:id" element={<ClienteDashboard />} />
                  <Route path="oportunidades" element={<Oportunidades />} />
                  <Route path="tarefas" element={<Tarefas />} />
                  <Route path="agenda" element={<Agenda />} />
                  <Route path="relatorios" element={<Relatorios />} />
                  <Route path="financeiro" element={<Financeiro />} />
                  <Route path="contratos" element={<Contratos />} />
                  <Route path="estrategias" element={<Estrategias />} />
                  <Route path="equipe" element={<Equipe />} />
                  <Route path="integracoes" element={<Integracoes />} />
                  <Route path="configuracoes" element={<Configuracoes />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
