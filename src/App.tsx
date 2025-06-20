
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import { PWAProvider } from "@/contexts/PWAContext";
import { OfflineNotification } from "@/components/pwa/OfflineNotification";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { usePWAContext } from "@/contexts/PWAContext";

// Pages
import { Landing } from "@/pages/Landing";
import { Auth } from "@/pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Clientes } from "./pages/Clientes";
import { Oportunidades } from "./pages/Oportunidades";
import { Tarefas } from "./pages/Tarefas";
import { Relatorios } from "./pages/Relatorios";
import { Configuracoes } from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: (failureCount, error) => {
        // Não tentar novamente se estiver offline
        if (!navigator.onLine) return false;
        return failureCount < 3;
      },
    },
  },
});

const PWAComponents = () => {
  const { showInstallPrompt, dismissInstallPrompt } = usePWAContext();

  return (
    <>
      <OfflineNotification />
      {showInstallPrompt && (
        <InstallPrompt onDismiss={dismissInstallPrompt} />
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PWAProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <PWAComponents />
          <BrowserRouter>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Landing />} />
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
              
              {/* Rota antiga para compatibilidade */}
              <Route path="/index" element={
                <AuthGuard>
                  <AppLayout>
                    <Index />
                  </AppLayout>
                </AuthGuard>
              } />
              
              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </PWAProvider>
  </QueryClientProvider>
);

export default App;
