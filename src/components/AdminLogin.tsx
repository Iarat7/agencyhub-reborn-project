
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Shield, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminService } from '@/services/api/adminService';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, signIn, signOut } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(true);
  
  const [loginForm, setLoginForm] = useState({
    email: 'admin@agencyhub.com', // Pré-preenchido para facilitar teste
    password: 'admin123' // Pré-preenchido para facilitar teste
  });

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Verificar se existe admin no sistema
  useEffect(() => {
    const checkAdmin = async () => {
      const adminExists = await AdminService.hasAdminUser();
      setHasAdmin(adminExists);
    };
    checkAdmin();
  }, []);

  const handleCreateAdmin = async () => {
    setCreatingAdmin(true);
    
    try {
      const result = await AdminService.createAdminUser();
      
      if (result.success) {
        toast({
          title: "Usuário admin criado!",
          description: "Email: admin@agencyhub.com | Senha: admin123"
        });
        setHasAdmin(true);
      } else {
        toast({
          title: "Erro ao criar admin",
          description: result.error || "Erro desconhecido",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar admin",
        description: error.message || "Erro inesperado",
        variant: "destructive"
      });
    } finally {
      setCreatingAdmin(false);
    }
  };

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
              {hasAdmin ? 'Entre com suas credenciais de admin' : 'Primeiro, crie um usuário admin'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!hasAdmin && (
              <div className="mb-6">
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <UserPlus className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Nenhum admin encontrado
                      </h3>
                      <p className="text-blue-700 text-sm mb-4">
                        Crie um usuário administrador para começar a usar o sistema
                      </p>
                      <Button 
                        onClick={handleCreateAdmin}
                        disabled={creatingAdmin}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {creatingAdmin ? 'Criando...' : 'Criar Admin'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {hasAdmin && (
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
            )}
            
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => navigate('/auth')}
                className="text-gray-600"
              >
                ← Login normal
              </Button>
            </div>

            {hasAdmin && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                  <strong>Credenciais de teste:</strong><br />
                  Email: admin@agencyhub.com<br />
                  Senha: admin123
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
