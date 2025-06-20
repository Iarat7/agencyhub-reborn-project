
// Ponto central de acesso a todos os serviços
// Aqui você pode facilmente trocar as implementações no futuro
import { SupabaseAuthApi, SupabaseApi, SupabaseFileApi } from './api/supabaseApi';
import { ProfilesApi } from './api/profilesApi';
import { ContractAttachmentsApi } from './api/contractAttachmentsApi';
import type { Client, Opportunity, Task, User, Contract, FinancialEntry, ContractAttachment } from './api/types';

// Serviços de API - podem ser facilmente trocados por implementações FastAPI
export const authService = new SupabaseAuthApi();
export const clientsService = new SupabaseApi<Client>('clients');
export const opportunitiesService = new SupabaseApi<Opportunity>('opportunities');
export const tasksService = new SupabaseApi<Task>('tasks');
export const usersService = new SupabaseApi<User>('profiles');
export const profilesService = new ProfilesApi();
export const fileService = new SupabaseFileApi('attachments');
export const contractsService = new SupabaseApi<Contract>('contracts');
export const financialEntriesService = new SupabaseApi<FinancialEntry>('financial_entries');
export const contractAttachmentsService = new ContractAttachmentsApi();

// Para migração futura:
// export const authService = new FastApiAuthService();
// export const clientsService = new FastApiService<Client>('/api/clients');
// etc...
