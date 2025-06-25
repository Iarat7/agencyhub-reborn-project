
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

interface PremiumFeatureGuardProps {
  children: React.ReactNode;
  featureName: string;
  description?: string;
  showUpgrade?: boolean;
}

export const PremiumFeatureGuard = ({ 
  children, 
  featureName, 
  description, 
  showUpgrade = true 
}: PremiumFeatureGuardProps) => {
  const { isActive } = useSubscription();

  if (isActive) {
    return <>{children}</>;
  }

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-gray-600">
          <Lock className="h-5 w-5" />
          {featureName}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-gray-500">
          {description || `Esta funcionalidade está disponível apenas para assinantes premium.`}
        </div>
        
        {showUpgrade && (
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Crown className="h-4 w-4 mr-2" />
            Fazer Upgrade
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
