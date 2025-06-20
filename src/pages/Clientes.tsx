
import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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

const clientesData = [
  {
    id: 1,
    nome: 'Tech Solutions Ltda',
    email: 'contato@techsolutions.com',
    telefone: '(11) 99999-9999',
    status: 'Ativo',
    ultimoContato: '2024-01-15',
    valorTotal: 'R$ 15.500,00'
  },
  {
    id: 2,
    nome: 'Marketing Pro',
    email: 'info@marketingpro.com',
    telefone: '(11) 88888-8888',
    status: 'Ativo',
    ultimoContato: '2024-01-14',
    valorTotal: 'R$ 8.200,00'
  },
  {
    id: 3,
    nome: 'Startup ABC',
    email: 'hello@startupABC.com',
    telefone: '(11) 77777-7777',
    status: 'Inativo',
    ultimoContato: '2024-01-10',
    valorTotal: 'R$ 3.800,00'
  },
  {
    id: 4,
    nome: 'E-commerce XYZ',
    email: 'vendas@ecommercexyz.com',
    telefone: '(11) 66666-6666',
    status: 'Prospecto',
    ultimoContato: '2024-01-12',
    valorTotal: 'R$ 22.100,00'
  },
];

export const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClientes = clientesData.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Inativo':
        return 'bg-red-100 text-red-800';
      case 'Prospecto':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-600 mt-2">Gerencie seus clientes e prospects</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Lista de Clientes</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  placeholder="Buscar clientes..."
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Último Contato</TableHead>
                  <TableHead className="hidden lg:table-cell">Valor Total</TableHead>
                  <TableHead className="w-12">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell className="text-slate-600">{cliente.email}</TableCell>
                    <TableCell className="hidden md:table-cell text-slate-600">
                      {cliente.telefone}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(cliente.status)}>
                        {cliente.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-slate-600">
                      {new Date(cliente.ultimoContato).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-medium">
                      {cliente.valorTotal}
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
