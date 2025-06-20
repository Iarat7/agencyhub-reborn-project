
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

interface Activity {
  action: string;
  client: string;
  time: string;
}

interface DashboardActivitiesProps {
  recentActivities: Activity[];
}

export const DashboardActivities = ({ recentActivities }: DashboardActivitiesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Atividades Recentes
        </CardTitle>
        <CardDescription>
          Últimas atividades da sua equipe
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.length > 0 ? (
          recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {activity.action.includes('cliente') && <Users className="h-4 w-4 text-blue-500 mt-1" />}
                {activity.action.includes('Oportunidade') && <Target className="h-4 w-4 text-green-500 mt-1" />}
                {activity.action.includes('Tarefa') && <CheckCircle className="h-4 w-4 text-purple-500 mt-1" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500 truncate">{activity.client}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Nenhuma atividade recente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
