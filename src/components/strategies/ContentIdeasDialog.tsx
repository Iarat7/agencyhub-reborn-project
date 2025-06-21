
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2, Copy, Check } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const contentIdeasSchema = z.object({
  client_id: z.string().min(1, 'Cliente é obrigatório'),
  business_type: z.string().min(1, 'Tipo de negócio é obrigatório'),
  content_type: z.string().min(1, 'Tipo de conteúdo é obrigatório'),
  target_audience: z.string().min(1, 'Público-alvo é obrigatório'),
  objectives: z.string().min(1, 'Objetivos são obrigatórios'),
  tone: z.string().min(1, 'Tom de voz é obrigatório'),
});

type ContentIdeasFormData = z.infer<typeof contentIdeasSchema>;

interface ContentIdeasDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContentIdeasDialog = ({ open, onOpenChange }: ContentIdeasDialogProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<string>('');
  const [copiedStates, setCopiedStates] = useState<{ [key: number]: boolean }>({});
  const { data: clients = [] } = useClients();

  const form = useForm<ContentIdeasFormData>({
    resolver: zodResolver(contentIdeasSchema),
    defaultValues: {
      client_id: '',
      business_type: '',
      content_type: '',
      target_audience: '',
      objectives: '',
      tone: '',
    },
  });

  const onSubmit = async (data: ContentIdeasFormData) => {
    setIsGenerating(true);
    try {
      const client = clients.find(c => c.id === data.client_id);
      
      console.log('Gerando ideias de conteúdo para:', {
        clientName: client?.name,
        businessType: data.business_type,
        contentType: data.content_type,
        targetAudience: data.target_audience,
        objectives: data.objectives,
        tone: data.tone,
      });

      const { data: response, error } = await supabase.functions.invoke('generate-content-ideas', {
        body: {
          clientName: client?.name,
          businessType: data.business_type,
          contentType: data.content_type,
          targetAudience: data.target_audience,
          objectives: data.objectives,
          tone: data.tone,
        },
      });

      if (error) {
        console.error('Erro ao gerar ideias:', error);
        throw error;
      }

      if (!response?.ideas) {
        throw new Error('Nenhuma ideia foi retornada pela IA');
      }

      setGeneratedIdeas(response.ideas);
      
      toast({
        title: 'Ideias geradas com sucesso',
        description: 'As ideias de conteúdo foram criadas usando IA.',
      });
      
    } catch (error) {
      console.error('Erro ao gerar ideias:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao gerar as ideias.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [index]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [index]: false });
      }, 2000);
      toast({
        title: 'Copiado!',
        description: 'Texto copiado para a área de transferência.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar o texto.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    form.reset();
    setGeneratedIdeas('');
    setCopiedStates({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Gerar Ideias de Conteúdo com IA
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
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
                  name="business_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Negócio</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Loja de roupas, Academia, Restaurante..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Conteúdo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de conteúdo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="instagram">Posts Instagram</SelectItem>
                          <SelectItem value="videos">Vídeos YouTube/TikTok</SelectItem>
                          <SelectItem value="blog">Artigos de Blog</SelectItem>
                          <SelectItem value="stories">Stories</SelectItem>
                          <SelectItem value="reels">Reels</SelectItem>
                          <SelectItem value="linkedin">Posts LinkedIn</SelectItem>
                          <SelectItem value="email">E-mail Marketing</SelectItem>
                          <SelectItem value="mixed">Conteúdo Misto</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target_audience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Público-alvo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva o público-alvo (idade, interesses, comportamento...)"
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
                          placeholder="O que você quer alcançar com o conteúdo? (vendas, engajamento, awareness...)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tom de Voz</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tom de voz" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="casual">Casual e Descontraído</SelectItem>
                          <SelectItem value="professional">Profissional</SelectItem>
                          <SelectItem value="friendly">Amigável</SelectItem>
                          <SelectItem value="inspirational">Inspiracional</SelectItem>
                          <SelectItem value="educational">Educativo</SelectItem>
                          <SelectItem value="funny">Divertido/Humorístico</SelectItem>
                          <SelectItem value="authoritative">Autoritativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Gerando Ideias...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Gerar Ideias
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <div>
            {generatedIdeas && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Ideias Geradas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedIdeas.split('\n\n').filter(idea => idea.trim()).map((idea, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg relative group">
                        <div className="whitespace-pre-wrap text-sm">{idea.trim()}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(idea.trim(), index)}
                        >
                          {copiedStates[index] ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!generatedIdeas && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Preencha o formulário e clique em "Gerar Ideias" para criar conteúdo personalizado com IA.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
