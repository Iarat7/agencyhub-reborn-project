
import { format, parseISO, addDays, addMonths, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Timezone de Recife (UTC-3)
const RECIFE_TIMEZONE_OFFSET = -3;

export const formatDateForRecife = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  // Ajustar para o timezone de Recife
  const recifeDate = new Date(dateObj.getTime() - (RECIFE_TIMEZONE_OFFSET * 60 * 60 * 1000));
  return recifeDate.toISOString();
};

export const parseRecifeDate = (dateString: string): Date => {
  const date = parseISO(dateString);
  // Ajustar do timezone de Recife para local
  return new Date(date.getTime() + (RECIFE_TIMEZONE_OFFSET * 60 * 60 * 1000));
};

export const formatDateToLocal = (date: Date | string, formatStr: string = "yyyy-MM-dd'T'HH:mm"): string => {
  const dateObj = typeof date === 'string' ? parseRecifeDate(date) : date;
  return format(dateObj, formatStr, { locale: ptBR });
};

export const getCurrentRecifeTime = (): Date => {
  const now = new Date();
  return new Date(now.getTime() - (RECIFE_TIMEZONE_OFFSET * 60 * 60 * 1000));
};

export const generateRecurringDates = (
  startDate: Date,
  frequency: 'monthly' | 'quarterly' | 'yearly',
  contractEndDate?: Date
): Date[] => {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  const endDate = contractEndDate || addMonths(startDate, 12); // Default 1 ano se não especificado

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    
    switch (frequency) {
      case 'monthly':
        currentDate = addMonths(currentDate, 1);
        break;
      case 'quarterly':
        currentDate = addMonths(currentDate, 3);
        break;
      case 'yearly':
        currentDate = addMonths(currentDate, 12);
        break;
    }
  }

  return dates;
};
