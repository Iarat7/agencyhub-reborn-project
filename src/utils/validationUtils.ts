
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\(\)\-\+]+$/,
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  cep: /^\d{5}-?\d{3}$/,
  currency: /^\d+([.,]\d{1,2})?$/,
  url: /^https?:\/\/[^\s/$.?#].[^\s]*$/i
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} é obrigatório`;
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return null;
  if (!validationPatterns.email.test(email)) {
    return 'Email deve ter um formato válido';
  }
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) return null;
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length < 10 || cleanPhone.length > 11) {
    return 'Telefone deve ter 10 ou 11 dígitos';
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  if (!value) return null;
  if (value.length < minLength) {
    return `${fieldName} deve ter pelo menos ${minLength} caracteres`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string | null => {
  if (!value) return null;
  if (value.length > maxLength) {
    return `${fieldName} deve ter no máximo ${maxLength} caracteres`;
  }
  return null;
};

export const validateNumberRange = (value: number, min?: number, max?: number, fieldName?: string): string | null => {
  if (isNaN(value)) return `${fieldName || 'Valor'} deve ser um número válido`;
  
  if (min !== undefined && value < min) {
    return `${fieldName || 'Valor'} deve ser maior ou igual a ${min}`;
  }
  
  if (max !== undefined && value > max) {
    return `${fieldName || 'Valor'} deve ser menor ou igual a ${max}`;
  }
  
  return null;
};

export const validateDate = (date: string, fieldName: string): string | null => {
  if (!date) return null;
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return `${fieldName} deve ser uma data válida`;
  }
  return null;
};

export const validateFutureDate = (date: string, fieldName: string): string | null => {
  const dateError = validateDate(date, fieldName);
  if (dateError) return dateError;
  
  const parsedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (parsedDate < today) {
    return `${fieldName} deve ser uma data futura`;
  }
  
  return null;
};

export const validateCurrency = (value: string): string | null => {
  if (!value) return null;
  if (!validationPatterns.currency.test(value)) {
    return 'Valor deve estar no formato correto (ex: 1000,50)';
  }
  return null;
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const formatPhone = (phone: string): string => {
  const cleaned = sanitizePhone(phone);
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const parseCurrency = (value: string): number => {
  return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
};
