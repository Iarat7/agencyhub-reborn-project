
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportsDetailsProps {
  details: {
    recentOpportunities: Array<{
      id: string;
      title: string;
      stage: string;
      value?: number;
    }>;
    urgentTasks: Array<{
      id: string;
      title: string;
      status: string;
      due_date?: string;
    }>;
  };
}

export const ReportsDetails = ({ details }: ReportsDetailsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Oportunidades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {details.recentOpportunities.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma oportunidade encontrada</p>
          ) : (
            <div className="space-y-3">
              {details.recentOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="border-l-4 border-blue-500 pl-3">
                  <h4 className="font-medium text-sm md:text-base">{opportunity.title}</h4>
                  <div className="text-xs md:text-sm text-gray-600 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                    <span>{opportunity.stage}</span>
                    {opportunity.value && (
                      <span className="md:before:content-['•'] md:before:mr-2">
                        {formatCurrency(opportunity.value)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Tarefas Urgentes</CardTitle>
        </CardHeader>
        <CardContent>
          {details.urgentTasks.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma tarefa urgente</p>
          ) : (
            <div className="space-y-3">
              {details.urgentTasks.map((task) => (
                <div key={task.id} className="border-l-4 border-red-500 pl-3">
                  <h4 className="font-medium text-sm md:text-base">{task.title}</h4>
                  <div className="text-xs md:text-sm text-gray-600 flex flex-col md:flex-row gap-1 md:gap-2">
                    <span>Status: {task.status}</span>
                    {task.due_date && (
                      <span className="md:before:content-['•'] md:before:mr-2">
                        Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
