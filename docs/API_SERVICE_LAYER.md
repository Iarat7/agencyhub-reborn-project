
# Camada de Abstração de Serviços - AgencyHub

Esta documentação explica como a camada de abstração permite migração futura do Supabase para backend próprio.

## Arquitetura da Camada de Serviços

### Estrutura de Pastas
```
src/services/
├── api/
│   ├── types.ts          # Tipos centralizados
│   ├── baseApi.ts        # Interfaces base
│   └── supabaseApi.ts    # Implementação Supabase
├── index.ts              # Ponto central de acesso
└── ...                   # Futuros serviços (fastApi.ts, etc)
```

## Interfaces Base

### IBaseApi
Interface genérica para operações CRUD:
```typescript
interface IBaseApi {
  get<T>(id: string): Promise<T | null>;
  list<T>(filters?: Record<string, any>): Promise<T[]>;
  create<T>(data: Partial<T>): Promise<T | null>;
  update<T>(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
```

### IAuthApi
Interface para autenticação:
```typescript
interface IAuthApi {
  signUp(email: string, password: string, userData?: any): Promise<any>;
  signIn(email: string, password: string): Promise<any>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<any>;
  onAuthStateChange(callback: (user: any) => void): () => void;
  resetPassword(email: string): Promise<any>;
}
```

### IFileApi
Interface para storage de arquivos:
```typescript
interface IFileApi {
  upload(file: File, path: string): Promise<string | null>;
  delete(path: string): Promise<boolean>;
  getPublicUrl(path: string): string;
}
```

## Implementação Atual (Supabase)

### SupabaseAuthApi
- Implementa autenticação via Supabase Auth
- Gerencia sessions e estado do usuário
- Suporte a recuperação de senha

### SupabaseApi<T>
- Implementação genérica para operações CRUD
- Usa Supabase Client para interagir com PostgreSQL
- Aplicação automática de filtros RLS

### SupabaseFileApi
- Gerencia upload/download de arquivos
- Usa Supabase Storage
- URLs públicas para arquivos

## Ponto Central de Acesso

### src/services/index.ts
```typescript
// Implementação atual (Supabase)
export const authService = new SupabaseAuthApi();
export const clientsService = new SupabaseApi<Client>('clients');
export const opportunitiesService = new SupabaseApi<Opportunity>('opportunities');
// ... outros serviços

// Para migração futura:
// export const authService = new FastApiAuthService();
// export const clientsService = new FastApiService<Client>('/api/clients');
```

## Uso nos Componentes

### Hook useAuth
```typescript
const { user, signIn, signUp, signOut } = useAuth();
```
- Usa `authService` internamente
- Gerencia estado global de autenticação
- Facilita migração (só mudar a implementação do service)

### Componentes de Dados
```typescript
// Exemplo: buscar clientes
const clients = await clientsService.list({ status: 'active' });

// Criar novo cliente
const newClient = await clientsService.create({
  name: 'Cliente Teste',
  email: 'teste@email.com'
});
```

## Preparação para Migração

### Futura Implementação FastAPI

#### 1. Criar FastApiAuthService
```typescript
class FastApiAuthService implements IAuthApi {
  private baseUrl = 'https://sua-api.com/auth';
  
  async signIn(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
    }
    
    return { data, error: data.error };
  }
  
  // ... outras implementações
}
```

#### 2. Criar FastApiService
```typescript
class FastApiService<T> implements IBaseApi {
  constructor(private endpoint: string) {}
  
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }
  
  async list<T>(filters?: Record<string, any>): Promise<T[]> {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.endpoint}?${params}`, {
      headers: this.getHeaders()
    });
    
    return await response.json();
  }
  
  // ... outras implementações
}
```

#### 3. Trocar no src/services/index.ts
```typescript
// Simplesmente trocar as implementações:
export const authService = new FastApiAuthService();
export const clientsService = new FastApiService<Client>('/api/clients');
```

## Vantagens da Arquitetura

### 1. **Desacoplamento**
- Frontend não conhece detalhes do backend
- Mudança de implementação sem afetar componentes

### 2. **Tipagem Consistente**
- Tipos centralizados em `types.ts`
- IntelliSense e validação em tempo de desenvolvimento

### 3. **Testabilidade**
- Fácil criação de mocks para testes
- Interfaces bem definidas para cada serviço

### 4. **Escalabilidade**
- Adição de novos serviços seguindo padrão
- Migração incremental (service por service)

## Roteiro de Migração

### Fase 1: Preparação
- ✅ Implementar camada de abstração (feito)
- ✅ Centralizar tipos e interfaces (feito)
- ✅ Usar serviços em todos os componentes

### Fase 2: Desenvolvimento Paralelo
- Criar backend FastAPI
- Implementar FastApiServices
- Manter compatibilidade de APIs

### Fase 3: Migração
- Testar implementações lado a lado
- Trocar services um por vez
- Validar funcionalidades

### Fase 4: Finalização
- Remover dependências do Supabase
- Migrar dados do Supabase para PostgreSQL próprio
- Deploy da nova arquitetura

## Dependências para Remoção Futura

### Supabase-specific:
- `@supabase/supabase-js`
- Variáveis de ambiente do Supabase
- Configurações de RLS (migrar para autorizações na API)

### Substituições:
- Supabase Auth → JWT próprio + FastAPI
- Supabase DB → PostgreSQL direto
- Supabase Storage → S3/MinIO/storage próprio
- Realtime → WebSockets próprios (se necessário)
