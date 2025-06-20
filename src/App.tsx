
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NewLayout } from "@/components/NewLayout";

// Pages
import { Landing } from "@/pages/Landing";
import { Auth } from "@/pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { Clientes } from "./pages/Clientes";
import { Oportunidades } from "./pages/Oportunidades";
import { Relatorios } from "./pages/Relatorios";
import { Configuracoes } from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Rotas protegidas com layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <NewLayout>
                  <Dashboard />
                </NewLayout>
              </ProtectedRoute>
            } />
            <Route path="/clientes" element={
              <ProtectedRoute>
                <NewLayout>
                  <Clientes />
                </NewLayout>
              </ProtectedRoute>
            } />
            <Route path="/oportunidades" element={
              <ProtectedRoute>
                <NewLayout>
                  <Oportunidades />
                </NewLayout>
              </ProtectedRoute>
            } />
            <Route path="/relatorios" element={
              <ProtectedRoute>
                <NewLayout>
                  <Relatorios />
                </NewLayout>
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute>
                <NewLayout>
                  <Configuracoes />
                </NewLayout>
              </ProtectedRoute>
            } />
            
            {/* Rota antiga para compatibilidade */}
            <Route path="/index" element={
              <ProtectedRoute>
                <NewLayout>
                  <Index />
                </NewLayout>
              </ProtectedRoute>
            } />
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
