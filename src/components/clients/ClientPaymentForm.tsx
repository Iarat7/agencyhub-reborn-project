
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useRecurringPayments } from '@/hooks/useRecurringPayments';

interface ClientPaymentFormProps {
  clientId: string;
  onSuccess?: () => void;
}

export const ClientPaymentForm = ({ clientId, onSuccess }: ClientPaymentFormProps) => {
  const [amount, setAmount] = React.useState('');
  const [paymentDay, setPaymentDay] = React.useState('');
  const [frequency, setFrequency] = React.useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [contractStart, setContractStart] = React.useState<Date>();
  const [contractEnd, setContractEnd] = React.useState<Date>();
  const [description, setDescription] = React.useState('');

  const { createRecurringPayments } = useRecurringPayments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !paymentDay || !contractStart) {
      return;
    }

    try {
      await createRecurringPayments.mutateAsync({
        clientId,
        amount: parseFloat(amount),
        paymentDay: parseInt(paymentDay),
        frequency,
        contractStartDate: contractStart,
        contractEndDate: contractEnd,
        description: description || undefined,
      });

      // Reset form
      setAmount('');
      setPaymentDay('');
      setFrequency('monthly');
      setContractStart(undefined);
      setContractEnd(undefined);
      setDescription('');

      onSuccess?.();
    } catch (error) {
      console.error('Error creating recurring payments:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Valor Mensal (R$)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            required
          />
        </div>

        <div>
          <Label htmlFor="payment-day">Dia de Pagamento</Label>
          <Select value={paymentDay} onValueChange={setPaymentDay} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o dia" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  Dia {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="frequency">Frequência</Label>
          <Select value={frequency} onValueChange={(value: any) => setFrequency(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Início do Contrato</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !contractStart && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {contractStart ? format(contractStart, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={contractStart}
                onSelect={setContractStart}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Fim do Contrato (opcional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !contractEnd && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {contractEnd ? format(contractEnd, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={contractEnd}
                onSelect={setContractEnd}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição do pagamento"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={createRecurringPayments.isPending}
        className="w-full"
      >
        {createRecurringPayments.isPending ? 'Criando...' : 'Criar Pagamentos Recorrentes'}
      </Button>
    </form>
  );
};
