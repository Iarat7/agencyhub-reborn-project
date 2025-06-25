
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const { processInvite } = useOrganization();
  const { toast } = useToast();

  // Verificar se há parâmetros de convite
  const inviteToken = searchParams.get('invite_token');
  const isInvite = !!inviteToken;

  useEffect(() => {
    // Se há convite, pré-definir email e forçar cadastro
    if (isInvite) {
      const inviteEmail = searchParams.get('email');
      if (inviteEmail) {
        setEmail(inviteEmail);
      }
      setActiveTab('signup');
    }
  }, [isInvite, searchParams]);

  // Processar convite após login/cadastro
  useEffect(() => {
    const handleInviteProcessing = async () => {
      if (user && inviteToken) {
        console.log('Processing invite token:', inviteToken);
        const result = await processInvite(inviteToken);
        
        if (result.success) {
          toast({
            title: "✅ Convite aceito!",
            description: result.message,
          });
          // Remover parâmetros da URL e redirecionar
          navigate('/dashboard', { replace: true });
        } else {
          toast({
            title: "Erro ao processar convite",
            description: result.message,
            variant: "destructive",
          });
        }
      }
    };

    handleInviteProcessing();
  }, [user, inviteToken, processInvite, navigate, toast]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      
      if (!isInvite) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });
        navigate('/dashboard');
      }
      // Se há convite, o processamento será feito no useEffect
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await signUp(email, password, { full_name: fullName });
      
      if (!isInvite) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar a conta.",
        });
      }
      // Se há convite, o processamento será feito no useEffect
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Erro ao criar conta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">InflowHub</h1>
          <p className="text-slate-600 mt-2">Sistema de Gestão Empresarial</p>
        </div>

        {isInvite && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <UserPlus className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              Você foi convidado para integrar uma equipe! Complete o cadastro ou faça login para aceitar o convite.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              {isInvite ? 'Aceitar Convite' : 'Acesse sua conta'}
            </CardTitle>
            <CardDescription>
              {isInvite 
                ? 'Complete seu cadastro ou faça login para aceitar o convite da equipe'
                : 'Entre com suas credenciais ou crie uma nova conta'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isInvite} // Desabilitar se é convite
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Entrando..." : (isInvite ? "Entrar e Aceitar Convite" : "Entrar")}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isInvite} // Desabilitar se é convite
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Crie uma senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : (isInvite ? "Criar Conta e Aceitar Convite" : "Criar conta")}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
