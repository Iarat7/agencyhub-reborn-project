
# Arquitetura do Sistema CRM

## Visão Geral

Este CRM é construído com React, TypeScript e Tailwind CSS, seguindo uma arquitetura modular e escalável.

## Estrutura de Pastas

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── filters/        # Componentes de filtros avançados
│   ├── opportunities/  # Componentes específicos de oportunidades
│   ├── clients/        # Componentes específicos de clientes
│   └── tasks/          # Componentes específicos de tarefas
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
├── services/           # Camada de API e serviços
├── utils/              # Utilitários e helpers
├── contexts/           # Contextos React
└── integrations/       # Integrações externas (Supabase)
```

## Padrões Arquiteturais

### 1. Separação de Responsabilidades

- **Components**: UI e apresentação
- **Hooks**: Lógica de estado e efeitos
- **Services**: Comunicação com APIs
- **Utils**: Funções auxiliares puras

### 2. Gerenciamento de Estado

- **React Query**: Cache e sincronização de dados do servidor
- **Context API**: Estado global da aplicação
- **useState/useReducer**: Estado local dos componentes

### 3. Validação de Dados

- **Zod**: Validação de schemas
- **React Hook Form**: Gerenciamento de formulários
- **Custom validation hooks**: Validações específicas

## Componentes Principais

### Sistema de Filtros Avançados

```typescript
// Estrutura de filtros
interface FilterFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'email' | 'phone';
  validation?: ValidationConfig;
  options?: SelectOption[];
}
```

### Sistema de Notificações

```typescript
// Context de notificações
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
}
```

## Fluxo de Dados

1. **Página** → Chama hooks personalizados
2. **Hooks** → Fazem chamadas para services
3. **Services** → Comunicam com APIs
4. **React Query** → Gerencia cache e sincronização
5. **Components** → Renderizam dados

## Performance

### Otimizações Implementadas

- **React.memo**: Prevenção de re-renders desnecessários
- **useMemo/useCallback**: Memoização de cálculos e funções
- **React Query**: Cache inteligente de dados
- **Lazy Loading**: Carregamento sob demanda

### Métricas Monitoradas

- **First Contentful Paint (FCP)**
- **Largest Contentful Paint (LCP)**
- **Cumulative Layout Shift (CLS)**
- **Time to Interactive (TTI)**

## Integração com Backend

### Supabase

- **Authentication**: Autenticação de usuários
- **Database**: PostgreSQL com Row Level Security
- **Real-time**: Subscriptions para atualizações em tempo real

### API Layer

```typescript
// Estrutura base da API
class BaseApiService {
  async list<T>(): Promise<T[]>
  async get<T>(id: string): Promise<T>
  async create<T>(data: Partial<T>): Promise<T>
  async update<T>(id: string, data: Partial<T>): Promise<T>
  async delete(id: string): Promise<void>
}
```

## Testes

### Estratégia de Testes

- **Unit Tests**: Hooks e funções utilitárias
- **Component Tests**: Componentes isolados
- **Integration Tests**: Fluxos completos

### Ferramentas

- **Jest**: Framework de testes
- **Testing Library**: Testes de componentes
- **MSW**: Mock de APIs para testes

## Deployment

### Build Process

1. **TypeScript Compilation**: Verificação de tipos
2. **Bundling**: Vite para empacotamento
3. **Optimization**: Minificação e tree-shaking
4. **Static Generation**: Geração de assets estáticos

### Ambientes

- **Development**: Desenvolvimento local
- **Staging**: Testes de homologação
- **Production**: Ambiente de produção

## Convenções de Código

### Nomenclatura

- **Components**: PascalCase (ex: `OpportunityForm`)
- **Hooks**: camelCase com prefixo "use" (ex: `useOpportunities`)
- **Files**: PascalCase para componentes, camelCase para outros
- **Variables**: camelCase

### Estrutura de Arquivos

```
ComponentName/
├── index.tsx           # Exportação principal
├── ComponentName.tsx   # Implementação
├── ComponentName.test.tsx # Testes
└── types.ts           # Tipos específicos
```

## Roadmap Técnico

### Próximas Implementações

1. **PWA Support**: Service Workers e caching offline
2. **GraphQL**: Migração para GraphQL
3. **Micro-frontends**: Arquitetura modular
4. **Advanced Analytics**: Métricas detalhadas de uso
