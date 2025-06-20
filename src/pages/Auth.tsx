
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  // Formulário de login
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  // Formulário de cadastro
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        toast({
          title: "Erro no login",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta ao AgencyHub"
        });
        navigate('/dashboard');
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Erro no cadastro",
        description: "As senhas não coincidem",
        variant: "destructive"
      });
      return;
    }

    if (signupForm.password.length < 6) {
      toast({
        title: "Erro no cadastro",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(
        signupForm.email, 
        signupForm.password,
        {
          full_name: signupForm.fullName,
          company_name: signupForm.companyName
        }
      );
      
      if (error) {
        toast({
          title: "Erro no cadastro",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta"
        });
        setActiveTab('login');
      }
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!loginForm.email) {
      toast({
        title: "Email necessário",
        description: "Digite seu email para recuperar a senha",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await resetPassword(loginForm.email);
      
      if (error) {
        toast({
          title: "Erro",
          description: error,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email enviado!",
          description: "Verifique sua caixa de entrada para redefinir a senha"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">AgencyHub</span>
          </div>
          <p className="text-gray-600">
            Sistema completo para gestão de agências digitais
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {activeTab === 'login' ? 'Fazer Login' : 'Criar Conta'}
            </CardTitle>
            <CardDescription className="text-center">
              {activeTab === 'login' 
                ? 'Entre na sua conta para continuar' 
                : 'Crie sua conta e comece a usar o AgencyHub'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        required
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
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={handleForgotPassword}
                  >
                    Esqueceu sua senha?
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4 mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Nome completo</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Seu nome completo"
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm({...signupForm, fullName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="companyName">Nome da empresa</Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Nome da sua agência"
                      value={signupForm.companyName}
                      onChange={(e) => setSignupForm({...signupForm, companyName: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="signupPassword">Senha</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Digite a senha novamente"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <Button
            variant="link"
            onClick={() => navigate('/')}
            className="text-gray-600"
          >
            ← Voltar para o site
          </Button>
        </div>
      </div>
    </div>
  );
};
