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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CalendarIcon, Brain, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useClients } from '@/hooks/useClients';
import { useCreateStrategy } from '@/hooks/useStrategies';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const strategySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  objectives: z.string().optional(),
  challenges: z.string().optional(),
  target_audience: z.string().optional(),
  client_id: z.string().optional(),
  budget: z.coerce.number().optional(),
  deadline: z.date().optional(),
});

const aiStrategySchema = z.object({
  client_id: z.string().min(1, 'Cliente é obrigatório'),
  segment: z.string().min(1, 'Segmento é obrigatório'),
  budget: z.coerce.number().min(1, 'Orçamento é obrigatório'),
  objectives: z.string().min(1, 'Objetivos são obrigatórios'),
  challenges: z.string().min(1, 'Desafios são obrigatórios'),
  implementation_time: z.string().min(1, 'Tempo de implementação é obrigatório'),
});

type StrategyFormData = z.infer<typeof strategySchema>;
type AIStrategyFormData = z.infer<typeof aiStrategySchema>;

interface CreateStrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateStrategyDialog = ({ open, onOpenChange }: CreateStrategyDialogProps) => {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const { data: clients = [] } = useClients();
  const createStrategy = useCreateStrategy();

  const manualForm = useForm<StrategyFormData>({
    resolver: zodResolver(strategySchema),
    defaultValues: {
      title: '',
      objectives: '',
      challenges: '',
      target_audience: '',
      client_id: 'none',
    },
  });

  const aiForm = useForm<AIStrategyFormData>({
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

  const onManualSubmit = async (data: StrategyFormData) => {
    try {
      const strategyData = {
        title: data.title,
        objectives: data.objectives,
        challenges: data.challenges,
        target_audience: data.target_audience,
        client_id: data.client_id === 'none' ? undefined : data.client_id,
        budget: data.budget,
        deadline: data.deadline ? data.deadline.toISOString().split('T')[0] : undefined,
        status: 'created' as const,
        ai_generated: false,
      };

      await createStrategy.mutateAsync(strategyData);
      
      toast({
        title: 'Estratégia criada',
        description: 'A estratégia foi criada com sucesso.',
      });
      
      manualForm.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao criar a estratégia.',
        variant: 'destructive',
      });
    }
  };

  const onAISubmit = async (data: AIStrategyFormData) => {
    setIsGeneratingAI(true);
    try {
      const client = clients.find(c => c.id === data.client_id);
      
      console.log('Invocando função generate-strategy com dados:', {
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

      console.log('Resposta da função:', response);
      console.log('Erro da função:', error);

      if (error) {
        console.error('Erro ao invocar função:', error);
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

      console.log('Criando estratégia com dados:', strategyData);

      await createStrategy.mutateAsync(strategyData);
      
      toast({
        title: 'Estratégia gerada com sucesso',
        description: 'A estratégia foi criada usando IA.',
      });
      
      aiForm.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao gerar estratégia:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao gerar a estratégia.',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Estratégia</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="ai">Com IA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <Form {...manualForm}>
              <form onSubmit={manualForm.handleSubmit(onManualSubmit)} className="space-y-4">
                <FormField
                  control={manualForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da estratégia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualForm.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente (Opcional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Estratégia geral</SelectItem>
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
                  control={manualForm.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivos</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva os objetivos desta estratégia"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualForm.control}
                  name="challenges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desafios</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Identifique os principais desafios"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={manualForm.control}
                  name="target_audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Público-alvo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o público-alvo desta estratégia"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={manualForm.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orçamento (R$)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0,00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={manualForm.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy", { locale: ptBR })
                                ) : (
                                  <span>Selecione uma data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createStrategy.isPending}>
                    {createStrategy.isPending ? 'Criando...' : 'Criar Estratégia'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <Form {...aiForm}>
              <form onSubmit={aiForm.handleSubmit(onAISubmit)} className="space-y-4">
                <FormField
                  control={aiForm.control}
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
                  control={aiForm.control}
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
                  control={aiForm.control}
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
                  control={aiForm.control}
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
                  control={aiForm.control}
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
                  control={aiForm.control}
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
                  <Button type="submit" disabled={isGeneratingAI}>
                    {isGeneratingAI ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Gerar com IA
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
