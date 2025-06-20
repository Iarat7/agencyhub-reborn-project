
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Opportunity } from '@/services/api/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

export const KanbanBoard = ({ opportunities, onEdit }: KanbanBoardProps) => {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4 h-full">
      {Object.entries(stageConfig).map(([stage, config]) => {
        const stageOpportunities = groupedOpportunities[stage] || [];
        const stageValue = calculateStageValue(stageOpportunities);

        return (
          <div
            key={stage}
            className={`flex flex-col ${config.color} border-2 rounded-lg p-3 min-h-[500px]`}
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

            <div className="flex-1 space-y-3 overflow-y-auto">
              {stageOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
