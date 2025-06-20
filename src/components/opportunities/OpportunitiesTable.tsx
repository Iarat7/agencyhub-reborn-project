
import React from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Opportunity } from '@/services/api/types';
import { useDeleteOpportunity } from '@/hooks/useOpportunities';

interface OpportunitiesTableProps {
  opportunities: Opportunity[];
  onEdit: (opportunity: Opportunity) => void;
}

const stageLabels: Record<string, string> = {
  prospection: 'Prospecção',
  qualification: 'Qualificação',
  proposal: 'Proposta',
  negotiation: 'Negociação',
  closed_won: 'Fechada (Ganha)',
  closed_lost: 'Fechada (Perdida)',
};

const stageColors: Record<string, string> = {
  prospection: 'bg-gray-100 text-gray-800',
  qualification: 'bg-blue-100 text-blue-800',
  proposal: 'bg-yellow-100 text-yellow-800',
  negotiation: 'bg-purple-100 text-purple-800',
  closed_won: 'bg-green-100 text-green-800',
  closed_lost: 'bg-red-100 text-red-800',
};

export const OpportunitiesTable = ({ opportunities, onEdit }: OpportunitiesTableProps) => {
  const deleteOpportunity = useDeleteOpportunity();

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta oportunidade?')) {
      await deleteOpportunity.mutateAsync(id);
    }
  };

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getProbabilityColor = (probability: number | null | undefined) => {
    if (!probability) return 'text-gray-600';
    if (probability >= 70) return 'text-green-600';
    if (probability >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Probabilidade</TableHead>
            <TableHead>Estágio</TableHead>
            <TableHead className="hidden lg:table-cell">Fechamento</TableHead>
            <TableHead className="w-12">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opportunity) => (
            <TableRow key={opportunity.id} className="hover:bg-slate-50">
              <TableCell className="font-medium">{opportunity.title}</TableCell>
              <TableCell className="font-medium">
                {formatCurrency(opportunity.value)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={opportunity.probability || 0} className="w-16 h-2" />
                  <span className={`text-sm font-medium ${getProbabilityColor(opportunity.probability)}`}>
                    {opportunity.probability || 0}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={stageColors[opportunity.stage]}>
                  {stageLabels[opportunity.stage]}
                </Badge>
              </TableCell>
              <TableCell className="hidden lg:table-cell text-slate-600">
                {formatDate(opportunity.expected_close_date)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(opportunity)}>
                      <Edit size={16} className="mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDelete(opportunity.id)}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
