import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Brain, Loader2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useCreateStrategy } from '@/hooks/useStrategies';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const aiStrategySchema = z.object({
  client_id: z.string().min(1, 'Cliente é obrigatório'),
  segment: z.string().min(1, 'Segmento é obrigatório'),
  budget: z.coerce.number().min(1, 'Orçamento é obrigatório'),
  objectives: z.string().min(1, 'Objetivos são obrigatórios'),
  challenges: z.string().min(1, 'Desafios são obrigatórios'),
  implementation_time: z.string().min(1, 'Tempo de implementação é obrigatório'),
});

type AIStrategyFormData = z.infer<typeof aiStrategySchema>;

interface AIStrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AIStrategyDialog = ({ open, onOpenChange }: AIStrategyDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: clients = [] } = useClients();
  const createStrategy = useCreateStrategy();

  const form = useForm<AIStrategyFormData>({
    resolver: zodResolver(aiStrategySchema),
    defaultValues: {
      client_id: '',
      segment: '',
      budget: 0,
      objectives: '',
      challenges: '',
      implementation_time: '',
    },
  });

  const onSubmit = async (data: AIStrategyFormData) => {
    setIsGenerating(true);
    try {
      const client = clients.find(c => c.id === data.client_id);
      
      console.log('Invoking generate-strategy function with data:', {
        clientName: client?.name,
        segment: data.segment,
        budget: data.budget,
        objectives: data.objectives,
        challenges: data.challenges,
        implementationTime: data.implementation_time,
      });

      const { data: response, error } = await supabase.functions.invoke('generate-strategy', {
        body: {
          clientName: client?.name,
          segment: data.segment,
          budget: data.budget,
          objectives: data.objectives,
          challenges: data.challenges,
          implementationTime: data.implementation_time,
        },
      });

      console.log('Function response:', response);
      console.log('Function error:', error);

      if (error) {
        console.error('Error invoking function:', error);
        throw error;
      }

      if (!response?.strategy) {
        throw new Error('Nenhuma estratégia foi retornada pela IA');
      }

      const strategyData = {
        title: `Estratégia IA - ${client?.name}`,
        objectives: data.objectives,
        challenges: data.challenges,
        target_audience: data.segment,
        client_id: data.client_id,
        budget: data.budget,
        deadline: undefined,
        status: 'created' as const,
        ai_generated: true,
        ai_strategy_content: response.strategy,
      };

      console.log('Creating strategy with data:', strategyData);

      await createStrategy.mutateAsync(strategyData);
      
      toast({
        title: 'Estratégia gerada com sucesso',
        description: 'A estratégia foi criada usando IA.',
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating strategy:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao gerar a estratégia.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Gerar Estratégia com IA
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
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
              name="segment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Segmento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: E-commerce, SaaS, Varejo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orçamento (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Objetivos</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os principais objetivos do cliente"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="challenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principais Desafios</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Identifique os principais desafios a serem superados"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="implementation_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tempo de Implementação</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 3 meses, 6 meses, 1 ano..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Gerar Estratégia
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
