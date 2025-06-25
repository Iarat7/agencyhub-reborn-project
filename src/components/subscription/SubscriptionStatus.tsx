
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Clock, AlertTriangle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

export const SubscriptionStatus = () => {
  const { subscription, isPremium, isActive, isTrialExpired, daysLeftInTrial } = useSubscription();

  if (!subscription) {
    return null;
  }

  const getPlanIcon = () => {
    if (isPremium) return <Crown className="h-4 w-4" />;
    if (subscription.plan_type === 'trial') return <Clock className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const getPlanBadge = () => {
    if (subscription.plan_type === 'premium') {
      return <Badge className="bg-purple-100 text-purple-800">Premium</Badge>;
    }
    if (subscription.plan_type === 'enterprise') {
      return <Badge className="bg-indigo-100 text-indigo-800">Enterprise</Badge>;
    }
    if (subscription.plan_type === 'trial') {
      return (
        <Badge className={isTrialExpired ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}>
          Trial {isTrialExpired ? 'Expirado' : `(${daysLeftInTrial} dias restantes)`}
        </Badge>
      );
    }
    return <Badge className="bg-gray-100 text-gray-800">Básico</Badge>;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getPlanIcon()}
          Status da Assinatura
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getPlanBadge()}
            <span className="text-sm text-muted-foreground">
              {isActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          
          {subscription.plan_type === 'trial' && !isTrialExpired && (
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              Fazer Upgrade
            </Button>
          )}
          
          {(isTrialExpired || subscription.plan_type === 'basic') && (
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              Assinar Premium
            </Button>
          )}
        </div>
        
        {subscription.plan_type === 'trial' && daysLeftInTrial <= 3 && !isTrialExpired && (
          <div className="mt-3 p-3 background-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Seu período de teste expira em {daysLeftInTrial} dia(s). 
              Faça upgrade para continuar usando todas as funcionalidades.
            </p>
          </div>
        )}
        
        {isTrialExpired && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ⚠️ Seu período de teste expirou. Assine um plano para continuar usando o sistema.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
