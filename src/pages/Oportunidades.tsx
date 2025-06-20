
import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const oportunidadesData = [
  {
    id: 1,
    titulo: 'Website Institucional',
    cliente: 'Tech Solutions Ltda',
    valor: 'R$ 15.000,00',
    probabilidade: 80,
    estagio: 'Negociação',
    dataFechamento: '2024-02-15',
    responsavel: 'João Silva'
  },
  {
    id: 2,
    titulo: 'Campanha de Marketing Digital',
    cliente: 'Marketing Pro',
    valor: 'R$ 8.500,00',
    probabilidade: 60,
    estagio: 'Proposta',
    dataFechamento: '2024-02-20',
    responsavel: 'Maria Santos'
  },
  {
    id: 3,
    titulo: 'Sistema de Gestão',
    cliente: 'Startup ABC',
    valor: 'R$ 25.000,00',
    probabilidade: 40,
    estagio: 'Qualificação',
    dataFechamento: '2024-03-01',
    responsavel: 'Pedro Costa'
  },
  {
    id: 4,
    titulo: 'E-commerce Completo',
    cliente: 'E-commerce XYZ',
    valor: 'R$ 35.000,00',
    probabilidade: 90,
    estagio: 'Fechamento',
    dataFechamento: '2024-02-10',
    responsavel: 'Ana Oliveira'
  },
];

export const Oportunidades = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOportunidades = oportunidadesData.filter(oportunidade =>
    oportunidade.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    oportunidade.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstagioColor = (estagio: string) => {
    switch (estagio) {
      case 'Qualificação':
        return 'bg-blue-100 text-blue-800';
      case 'Proposta':
        return 'bg-yellow-100 text-yellow-800';
      case 'Negociação':
        return 'bg-purple-100 text-purple-800';
      case 'Fechamento':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProbabilidadeColor = (probabilidade: number) => {
    if (probabilidade >= 70) return 'text-green-600';
    if (probabilidade >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalValor = filteredOportunidades.reduce((acc, oportunidade) => {
    const valor = parseFloat(oportunidade.valor.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return acc + valor;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Oportunidades</h1>
          <p className="text-slate-600 mt-2">Gerencie seu pipeline de vendas</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Nova Oportunidade
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-600">Pipeline Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-slate-600">Oportunidades Ativas</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{filteredOportunidades.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-slate-600">Taxa de Conversão</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">68%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Pipeline de Vendas</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  placeholder="Buscar oportunidades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Probabilidade</TableHead>
                  <TableHead>Estágio</TableHead>
                  <TableHead className="hidden lg:table-cell">Fechamento</TableHead>
                  <TableHead className="hidden lg:table-cell">Responsável</TableHead>
                  <TableHead className="w-12">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOportunidades.map((oportunidade) => (
                  <TableRow key={oportunidade.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{oportunidade.titulo}</TableCell>
                    <TableCell className="text-slate-600">{oportunidade.cliente}</TableCell>
                    <TableCell className="font-medium">{oportunidade.valor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={oportunidade.probabilidade} className="w-16 h-2" />
                        <span className={`text-sm font-medium ${getProbabilidadeColor(oportunidade.probabilidade)}`}>
                          {oportunidade.probabilidade}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEstagioColor(oportunidade.estagio)}>
                        {oportunidade.estagio}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-600">
                      {new Date(oportunidade.dataFechamento).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-600">
                      {oportunidade.responsavel}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit size={16} className="mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
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
        </CardContent>
      </Card>
    </div>
  );
};
