
import { Client, Opportunity, Task } from '@/services/api/types';
import { FilterValues } from '@/components/filters/AdvancedFilters';
import { validateEmail, validatePhone, validateNumberRange, validateDate } from './validationUtils';

export const filterClients = (client: Client, filters: FilterValues): boolean => {
  // Name filter with validation
  if (filters.name) {
    const nameValue = filters.name as string;
    if (nameValue.length < 2) return true; // Skip filter if too short
    if (!client.name.toLowerCase().includes(nameValue.toLowerCase())) {
      return false;
    }
  }
  
  // Email filter with validation
  if (filters.email) {
    const emailValue = filters.email as string;
    if (validateEmail(emailValue)) return true; // Skip if invalid email format
    if (client.email && !client.email.toLowerCase().includes(emailValue.toLowerCase())) {
      return false;
    }
  }
  
  // Company filter
  if (filters.company) {
    const companyValue = filters.company as string;
    if (companyValue.length < 2) return true;
    if (client.company && !client.company.toLowerCase().includes(companyValue.toLowerCase())) {
      return false;
    }
  }
  
  // Segment filter
  if (filters.segment && filters.segment !== 'placeholder' && client.segment !== filters.segment) {
    return false;
  }
  
  // Status filter
  if (filters.status && filters.status !== 'placeholder' && client.status !== filters.status) {
    return false;
  }
  
  // Monthly value filter with validation
  if (filters.monthly_value) {
    const minValue = filters.monthly_value as number;
    if (validateNumberRange(minValue, 0)) return true; // Skip if invalid
    if (client.monthly_value && client.monthly_value < minValue) {
      return false;
    }
  }

  return true;
};

export const filterOpportunities = (opportunity: Opportunity, filters: FilterValues): boolean => {
  // Title filter
  if (filters.title) {
    const titleValue = filters.title as string;
    if (titleValue.length < 2) return true;
    if (!opportunity.title.toLowerCase().includes(titleValue.toLowerCase())) {
      return false;
    }
  }
  
  // Stage filter
  if (filters.stage && filters.stage !== 'placeholder' && opportunity.stage !== filters.stage) {
    return false;
  }
  
  // Value range filters with validation
  if (filters.min_value) {
    const minValue = filters.min_value as number;
    if (validateNumberRange(minValue, 0)) return true;
    if (opportunity.value && opportunity.value < minValue) {
      return false;
    }
  }
  
  if (filters.max_value) {
    const maxValue = filters.max_value as number;
    if (validateNumberRange(maxValue, 0)) return true;
    if (opportunity.value && opportunity.value > maxValue) {
      return false;
    }
  }
  
  // Probability filter with validation
  if (filters.min_probability) {
    const minProb = filters.min_probability as number;
    if (validateNumberRange(minProb, 0, 100)) return true;
    if (opportunity.probability && opportunity.probability < minProb) {
      return false;
    }
  }

  // Date filter with validation
  if (filters.expected_close_date && opportunity.expected_close_date) {
    const filterDate = filters.expected_close_date as string;
    if (validateDate(filterDate, 'Data')) return true;
    
    const filterDateObj = new Date(filterDate);
    const oppDate = new Date(opportunity.expected_close_date);
    if (oppDate > filterDateObj) {
      return false;
    }
  }

  return true;
};

export const filterTasks = (task: Task, filters: FilterValues): boolean => {
  // Title filter
  if (filters.title) {
    const titleValue = filters.title as string;
    if (titleValue.length < 2) return true;
    if (!task.title.toLowerCase().includes(titleValue.toLowerCase())) {
      return false;
    }
  }
  
  // Status filter
  if (filters.status && filters.status !== 'placeholder' && task.status !== filters.status) {
    return false;
  }
  
  // Priority filter
  if (filters.priority && filters.priority !== 'placeholder' && task.priority !== filters.priority) {
    return false;
  }

  // Due date filter with validation
  if (filters.due_date && task.due_date) {
    const filterDate = filters.due_date as string;
    if (validateDate(filterDate, 'Data')) return true;
    
    const filterDateObj = new Date(filterDate);
    const taskDate = new Date(task.due_date);
    if (taskDate > filterDateObj) {
      return false;
    }
  }

  return true;
};

// Enhanced filter configurations with validation
export const getClientFilterConfig = () => [
  { 
    key: 'name', 
    label: 'Nome', 
    type: 'text' as const, 
    placeholder: 'Nome do cliente',
    validation: { min: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
  },
  { 
    key: 'email', 
    label: 'Email', 
    type: 'email' as const, 
    placeholder: 'Email do cliente' 
  },
  { 
    key: 'company', 
    label: 'Empresa', 
    type: 'text' as const, 
    placeholder: 'Nome da empresa',
    validation: { min: 2 }
  },
  { 
    key: 'segment', 
    label: 'Segmento', 
    type: 'select' as const,
    options: [
      { label: 'Tecnologia', value: 'tecnologia' },
      { label: 'Saúde', value: 'saude' },
      { label: 'Educação', value: 'educacao' },
      { label: 'Varejo', value: 'varejo' },
      { label: 'Serviços', value: 'servicos' },
      { label: 'Agência', value: 'agencia' },
      { label: 'Outros', value: 'outros' }
    ]
  },
  { 
    key: 'status', 
    label: 'Status', 
    type: 'select' as const,
    options: [
      { label: 'Ativo', value: 'active' },
      { label: 'Inativo', value: 'inactive' },
      { label: 'Prospect', value: 'prospect' }
    ]
  },
  { 
    key: 'monthly_value', 
    label: 'Valor Mensal Mín.', 
    type: 'number' as const, 
    placeholder: 'Valor mínimo',
    validation: { min: 0, message: 'Valor deve ser positivo' }
  }
];
