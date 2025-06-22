
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Opportunity } from '@/services/api/types';
import { useClients } from '@/hooks/useClients';

const opportunitySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  client_id: z.string().optional(),
  value: z.string().optional(),
  probability: z.string().optional().refine((val) => {
    if (!val) return true;
    const num = parseInt(val);
    return num >= 0 && num <= 100;
  }, 'Probabilidade deve estar entre 0 e 100'),
  stage: z.string(),
  expected_close_date: z.string().optional(),
  description: z.string().optional(),
});

type OpportunityFormData = z.infer<typeof opportunitySchema>;

interface OpportunityFormProps {
  opportunity?: Opportunity | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
  initialClientId?: string;
}

const stageOptions = [
  { value: 'prospection', label: 'Prospecção' },
  { value: 'qualification', label: 'Qualificação' },
  { value: 'proposal', label: 'Proposta' },
  { value: 'negotiation', label: 'Negociação' },
  { value: 'closed_won', label: 'Fechada (Ganha)' },
  { value: 'closed_lost', label: 'Fechada (Perdida)' },
];

export const OpportunityForm = ({ opportunity, onSubmit, onCancel, isLoading, initialClientId }: OpportunityFormProps) => {
  const { data: clients = [], isLoading: clientsLoading } = useClients();

  const form = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: opportunity?.title || '',
      client_id: opportunity?.client_id || initialClientId || '',
      value: opportunity?.value?.toString() || '',
      probability: opportunity?.probability?.toString() || '',
      stage: opportunity?.stage || 'prospection',
      expected_close_date: opportunity?.expected_close_date || '',
      description: opportunity?.description || '',
    },
  });

  const handleSubmit = (data: OpportunityFormData) => {
    const submitData = {
      ...data,
      value: data.value ? parseFloat(data.value) : null,
      probability: data.probability ? parseInt(data.probability) : null,
      client_id: data.client_id || null,
      expected_close_date: data.expected_close_date || null, // Enviar null em vez de string vazia
    };
    
    console.log('Enviando dados da oportunidade:', submitData);
    onSubmit(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o título da oportunidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(value === 'no-client' ? '' : value)} 
                  value={field.value || 'no-client'} 
                  disabled={clientsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={clientsLoading ? "Carregando clientes..." : "Selecione um cliente"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="no-client">Nenhum cliente selecionado</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} {client.company && `(${client.company})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="probability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Probabilidade (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estágio</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estágio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {stageOptions.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expected_close_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Prevista de Fechamento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva os detalhes da oportunidade..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
