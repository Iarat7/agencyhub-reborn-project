
// Tipos centralizados para toda a aplicação
export interface User {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'admin' | 'manager' | 'user';
  company_name?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  segment?: string;
  status: 'active' | 'inactive' | 'prospect';
  monthly_value?: number;
  project_cost?: number;
  observations?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Opportunity {
  id: string;
  title: string;
  client_id?: string;
  value?: number;
  probability?: number;
  stage: 'prospection' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  expected_close_date?: string;
  description?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'in_approval' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  client_id?: string;
  assigned_to?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User | null;
  session: any;
  error?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error?: string;
}
