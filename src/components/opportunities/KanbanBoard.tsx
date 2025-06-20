
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, DollarSign, Calendar, TrendingUp, ArrowRight, ArrowLeft, Trophy, X } from 'lucide-react';
import { Opportunity } from '@/services/api/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useUpdateOpportunity } from '@/hooks/useOpportunities';

interface KanbanBoardProps {
  opportunities: Opportunity[];
  onEdit: (opportunity: Opportunity) => void;
}

const stageConfig = {
  prospection: { 
    label: 'Prospecção', 
    color: 'bg-gray-100 border-gray-200',
    headerColor: 'bg-gray-50'
  },
  qualification: { 
    label: 'Qualificação', 
    color: 'bg-blue-100 border-blue-200',
    headerColor: 'bg-blue-50'
  },
  proposal: { 
    label: 'Proposta', 
    color: 'bg-yellow-100 border-yellow-200',
    headerColor: 'bg-yellow-50'
  },
  negotiation: { 
    label: 'Negociação', 
    color: 'bg-orange-100 border-orange-200',
    headerColor: 'bg-orange-50'
  },
  closed_won: { 
    label: 'Fechado - Ganho', 
    color: 'bg-green-100 border-green-200',
    headerColor: 'bg-green-50'
  },
  closed_lost: { 
    label: 'Fechado - Perdido', 
    color: 'bg-red-100 border-red-200',
    headerColor: 'bg-red-50'
  }
};

const stageOrder: (keyof typeof stageConfig)[] = [
  'prospection', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
];

export const KanbanBoard = ({ opportunities, onEdit }: KanbanBoardProps) => {
  const updateOpportunity = useUpdateOpportunity();

  const groupedOpportunities = opportunities.reduce((acc, opportunity) => {
    const stage = opportunity.stage;
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(opportunity);
    return acc;
  }, {} as Record<string, Opportunity[]>);

  const calculateStageValue = (opportunities: Opportunity[]) => {
    return opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
  };

  const moveOpportunity = (opportunity: Opportunity, newStage: Opportunity['stage']) => {
    updateOpportunity.mutate({
      id: opportunity.id,
      data: { stage: newStage }
    });
  };

  const getNextStage = (currentStage: Opportunity['stage']): Opportunity['stage'] | null => {
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex < 3) { // Only move forward until negotiation
      return stageOrder[currentIndex + 1];
    }
    return null;
  };

  const getPreviousStage = (currentStage: Opportunity['stage']): Opportunity['stage'] | null => {
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex > 0) {
      return stageOrder[currentIndex - 1];
    }
    return null;
  };

  const renderStageControls = (opportunity: Opportunity) => {
    const { stage } = opportunity;

    // For closed stages (won/lost), only show back to negotiation
    if (stage === 'closed_won' || stage === 'closed_lost') {
      return (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => moveOpportunity(opportunity, 'negotiation')}
            className="h-6 px-2"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Voltar
          </Button>
        </div>
      );
    }

    // For negotiation stage, show back button + won/lost buttons
    if (stage === 'negotiation') {
      const previousStage = getPreviousStage(stage);
      return (
        <div className="flex flex-col gap-1 pt-2">
          <div className="flex justify-center">
            {previousStage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveOpportunity(opportunity, previousStage)}
                className="h-6 px-2"
              >
                <ArrowLeft className="h-3 w-3 mr-1" />
                Voltar
              </Button>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveOpportunity(opportunity, 'closed_won')}
              className="h-6 px-2 flex-1 text-green-600 border-green-200 hover:bg-green-50"
            >
              <Trophy className="h-3 w-3 mr-1" />
              Ganho
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveOpportunity(opportunity, 'closed_lost')}
              className="h-6 px-2 flex-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="h-3 w-3 mr-1" />
              Perdido
            </Button>
          </div>
        </div>
      );
    }

    // For other stages (qualification, proposal), show both back and forward arrows
    if (stage === 'qualification' || stage === 'proposal') {
      const nextStage = getNextStage(stage);
      const previousStage = getPreviousStage(stage);
      
      return (
        <div className="flex justify-between pt-2 gap-1">
          {previousStage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveOpportunity(opportunity, previousStage)}
              className="h-6 px-2"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              Voltar
            </Button>
          )}
          {nextStage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveOpportunity(opportunity, nextStage)}
              className="h-6 px-2"
            >
              Avançar
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      );
    }

    // For prospection stage, only show forward arrow
    if (stage === 'prospection') {
      const nextStage = getNextStage(stage);
      if (nextStage) {
        return (
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveOpportunity(opportunity, nextStage)}
              className="h-6 px-2"
            >
              Avançar
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 min-w-fit lg:grid lg:grid-cols-6 lg:min-w-0">
        {Object.entries(stageConfig).map(([stage, config]) => {
          const stageOpportunities = groupedOpportunities[stage] || [];
          const stageValue = calculateStageValue(stageOpportunities);

          return (
            <div
              key={stage}
              className={`flex flex-col ${config.color} border-2 rounded-lg p-3 w-80 lg:w-auto flex-shrink-0`}
            >
              <div className={`${config.headerColor} rounded-md p-3 mb-3 border`}>
                <h3 className="font-semibold text-sm text-gray-800">
                  {config.label}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-600">
                    {stageOpportunities.length} oportunidade{stageOpportunities.length !== 1 ? 's' : ''}
                  </span>
                  {stageValue > 0 && (
                    <span className="text-xs font-medium text-green-600">
                      {stageValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  )}
                </div>
              </div>

              <ScrollArea className="flex-1 h-[500px]">
                <div className="space-y-3 pr-4">
                  {stageOpportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium line-clamp-2">
                          {opportunity.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {opportunity.value && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 text-green-600" />
                              <span className="text-xs font-medium text-green-600">
                                {opportunity.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                              </span>
                            </div>
                          )}

                          {opportunity.probability && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-blue-600" />
                              <span className="text-xs text-blue-600">
                                {opportunity.probability}% de chance
                              </span>
                            </div>
                          )}

                          {opportunity.expected_close_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-500" />
                              <span className="text-xs text-gray-500">
                                {format(new Date(opportunity.expected_close_date), 'dd/MM/yyyy', { locale: ptBR })}
                              </span>
                            </div>
                          )}

                          {opportunity.description && (
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {opportunity.description}
                            </p>
                          )}

                          <div className="flex justify-end pt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(opportunity)}
                              className="h-6 px-2"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>

                          {renderStageControls(opportunity)}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
    </div>
  );
};
