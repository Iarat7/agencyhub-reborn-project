
import { Client, Opportunity, Task } from '@/services/api/types';
import { FilterValues } from '@/components/filters/AdvancedFilters';

export const filterClients = (client: Client, filters: FilterValues): boolean => {
  if (filters.name && !client.name.toLowerCase().includes((filters.name as string).toLowerCase())) {
    return false;
  }
  
  if (filters.email && client.email && !client.email.toLowerCase().includes((filters.email as string).toLowerCase())) {
    return false;
  }
  
  if (filters.company && client.company && !client.company.toLowerCase().includes((filters.company as string).toLowerCase())) {
    return false;
  }
  
  if (filters.segment && client.segment !== filters.segment) {
    return false;
  }
  
  if (filters.status && client.status !== filters.status) {
    return false;
  }
  
  if (filters.monthly_value && client.monthly_value && client.monthly_value < (filters.monthly_value as number)) {
    return false;
  }

  return true;
};

export const filterOpportunities = (opportunity: Opportunity, filters: FilterValues): boolean => {
  if (filters.title && !opportunity.title.toLowerCase().includes((filters.title as string).toLowerCase())) {
    return false;
  }
  
  if (filters.stage && opportunity.stage !== filters.stage) {
    return false;
  }
  
  if (filters.min_value && opportunity.value && opportunity.value < (filters.min_value as number)) {
    return false;
  }
  
  if (filters.max_value && opportunity.value && opportunity.value > (filters.max_value as number)) {
    return false;
  }
  
  if (filters.min_probability && opportunity.probability && opportunity.probability < (filters.min_probability as number)) {
    return false;
  }

  if (filters.expected_close_date && opportunity.expected_close_date) {
    const filterDate = new Date(filters.expected_close_date as string);
    const oppDate = new Date(opportunity.expected_close_date);
    if (oppDate > filterDate) {
      return false;
    }
  }

  return true;
};

export const filterTasks = (task: Task, filters: FilterValues): boolean => {
  if (filters.title && !task.title.toLowerCase().includes((filters.title as string).toLowerCase())) {
    return false;
  }
  
  if (filters.status && task.status !== filters.status) {
    return false;
  }
  
  if (filters.priority && task.priority !== filters.priority) {
    return false;
  }

  if (filters.due_date && task.due_date) {
    const filterDate = new Date(filters.due_date as string);
    const taskDate = new Date(task.due_date);
    if (taskDate > filterDate) {
      return false;
    }
  }

  return true;
};
