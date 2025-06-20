
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error, user: loggedUser } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        toast({
          title: "Erro no login",
          description: error,
          variant: "destructive"
        });
      } else if (loggedUser) {
        // Verificar se o usuário tem permissão de admin
        if (loggedUser.role === 'admin') {
          toast({
            title: "Login de admin realizado!",
            description: "Bem-vindo ao painel administrativo"
          });
          navigate('/dashboard');
        } else {
          toast({
            title: "Acesso negado",
            description: "Você não tem permissões de administrador",
            variant: "destructive"
          });
          // Fazer logout se não for admin
          await signOut();
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">Admin Panel</span>
          </div>
          <p className="text-gray-300">
            Acesso restrito a administradores
          </p>
        </div>

        <Card className="border-red-200 shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900">
              Login de Administrador
            </CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais de admin
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-email">Email do Administrador</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@agencyhub.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  required
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
              </div>
              
              <div>
                <Label htmlFor="admin-password">Senha</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    required
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Entrar como Admin'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => navigate('/auth')}
                className="text-gray-600"
              >
                ← Login normal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
