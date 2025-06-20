
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AuthProvider } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { PWAProvider } from "@/contexts/PWAContext";
import Index from "./pages/Index";
import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Clientes } from "./pages/Clientes";
import { ClienteDashboard } from "./pages/ClienteDashboard";
import { Oportunidades } from "./pages/Oportunidades";
import { Tarefas } from "./pages/Tarefas";
import Agenda from "./pages/Agenda";
import { Relatorios } from "./pages/Relatorios";
import { Configuracoes } from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PWAProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/app" element={
                  <AuthGuard>
                    <AppLayout>
                      <Index />
                    </AppLayout>
                  </AuthGuard>
                } />
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
                <Route path="/clientes/:clientId/dashboard" element={
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
                <Route path="/configuracoes" element={
                  <AuthGuard>
                    <AppLayout>
                      <Configuracoes />
                    </AppLayout>
                  </AuthGuard>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </PWAProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
