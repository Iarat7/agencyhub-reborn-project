
import { useEffect } from 'react';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { useTasks } from '@/hooks/useTasks';
import { useEvents } from '@/hooks/useEvents';
import { differenceInDays, differenceInHours, parseISO, isToday, isTomorrow } from 'date-fns';

export const useCalendarNotifications = () => {
  const { addNotification } = useNotificationSystem();
  const { data: tasks = [] } = useTasks();
  const { data: events = [] } = useEvents();

  useEffect(() => {
    // Verificar tarefas vencidas ou próximas do vencimento
    tasks.forEach(task => {
      if (!task.due_date || task.status === 'completed') return;

      const dueDate = parseISO(task.due_date);
      const daysDiff = differenceInDays(dueDate, new Date());

      if (daysDiff < 0) {
        // Tarefa vencida
        addNotification({
          type: 'error',
          title: 'Tarefa Vencida',
          message: `A tarefa "${task.title}" está vencida há ${Math.abs(daysDiff)} dias`,
          action: {
            label: 'Ver Tarefa',
            onClick: () => {
              // Implementar navegação para a tarefa
              console.log('Navigate to task:', task.id);
            }
          }
        });
      } else if (daysDiff === 0) {
        // Tarefa vence hoje
        addNotification({
          type: 'warning',
          title: 'Tarefa Vence Hoje',
          message: `A tarefa "${task.title}" vence hoje`,
        });
      } else if (daysDiff === 1) {
        // Tarefa vence amanhã
        addNotification({
          type: 'info',
          title: 'Tarefa Vence Amanhã',
          message: `A tarefa "${task.title}" vence amanhã`,
        });
      }
    });

    // Verificar eventos próximos
    events.forEach(event => {
      const eventDate = parseISO(event.start_date);
      const hoursDiff = differenceInHours(eventDate, new Date());

      if (hoursDiff > 0 && hoursDiff <= 2) {
        // Evento em até 2 horas
        addNotification({
          type: 'info',
          title: 'Evento Próximo',
          message: `O evento "${event.title}" começa em ${Math.round(hoursDiff)} hora(s)`,
        });
      } else if (isToday(eventDate) && hoursDiff > 2) {
        // Evento hoje
        addNotification({
          type: 'info',
          title: 'Evento Hoje',
          message: `Você tem o evento "${event.title}" hoje`,
        });
      } else if (isTomorrow(eventDate)) {
        // Evento amanhã
        addNotification({
          type: 'info',
          title: 'Evento Amanhã',
          message: `Você tem o evento "${event.title}" amanhã`,
        });
      }
    });
  }, [tasks, events, addNotification]);
};
