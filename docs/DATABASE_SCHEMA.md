
# Mapa de Entidades - AgencyHub Database Schema

Este documento detalha a estrutura completa do banco de dados do AgencyHub para facilitar futuras migrações.

## Tabelas Principais

### 1. profiles
**Descrição**: Perfis de usuários (estende auth.users do Supabase)
```sql
id UUID PRIMARY KEY REFERENCES auth.users(id)
full_name TEXT
avatar_url TEXT
role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user'))
company_name TEXT
phone TEXT
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### 2. clients
**Descrição**: Cadastro de clientes da agência
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
name TEXT NOT NULL
email TEXT
phone TEXT
company TEXT
segment TEXT
status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect'))
monthly_value DECIMAL(10,2)
project_cost DECIMAL(10,2)
observations TEXT
created_by UUID REFERENCES auth.users(id)
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### 3. opportunities
**Descrição**: Pipeline comercial/oportunidades de negócio
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
title TEXT NOT NULL
client_id UUID REFERENCES clients(id) ON DELETE CASCADE
value DECIMAL(10,2)
probability INTEGER CHECK (probability >= 0 AND probability <= 100)
stage TEXT DEFAULT 'prospection' CHECK (stage IN ('prospection', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'))
expected_close_date DATE
description TEXT
created_by UUID REFERENCES auth.users(id)
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### 4. tasks
**Descrição**: Sistema de tarefas/to-do
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
title TEXT NOT NULL
description TEXT
status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'in_approval', 'completed'))
priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
due_date DATE
client_id UUID REFERENCES clients(id) ON DELETE SET NULL
assigned_to UUID REFERENCES auth.users(id)
created_by UUID REFERENCES auth.users(id)
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### 5. contracts
**Descrição**: Contratos com clientes
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
title TEXT NOT NULL
client_id UUID REFERENCES clients(id) ON DELETE CASCADE
value DECIMAL(10,2) NOT NULL
cost DECIMAL(10,2)
start_date DATE NOT NULL
end_date DATE NOT NULL
status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'expired', 'cancelled'))
description TEXT
created_by UUID REFERENCES auth.users(id)
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### 6. strategies
**Descrição**: Estratégias criadas para clientes (com IA)
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
title TEXT NOT NULL
client_id UUID REFERENCES clients(id) ON DELETE CASCADE
objectives TEXT
challenges TEXT
budget DECIMAL(10,2)
deadline DATE
target_audience TEXT
status TEXT DEFAULT 'created' CHECK (status IN ('created', 'analyzing', 'approved', 'executed'))
ai_generated BOOLEAN DEFAULT FALSE
created_by UUID REFERENCES auth.users(id)
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### 7. events
**Descrição**: Calendário/agendamentos
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
title TEXT NOT NULL
description TEXT
event_type TEXT DEFAULT 'meeting' CHECK (event_type IN ('meeting', 'recording', 'call', 'other'))
start_date TIMESTAMP WITH TIME ZONE NOT NULL
end_date TIMESTAMP WITH TIME ZONE NOT NULL
client_id UUID REFERENCES clients(id) ON DELETE SET NULL
created_by UUID REFERENCES auth.users(id)
attendees TEXT[] -- Array de emails dos participantes
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### 8. financial_entries
**Descrição**: Controle financeiro (receitas e despesas)
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
type TEXT NOT NULL CHECK (type IN ('income', 'expense'))
category TEXT NOT NULL
amount DECIMAL(10,2) NOT NULL
description TEXT
due_date DATE
paid_date DATE
status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled'))
client_id UUID REFERENCES clients(id) ON DELETE SET NULL
contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL
created_by UUID REFERENCES auth.users(id)
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### 9. system_settings
**Descrição**: Configurações do sistema por usuário
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
key TEXT NOT NULL UNIQUE
value TEXT
user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

## Relacionamentos

### Diagrama de Relacionamentos
```
auth.users (Supabase)
├── profiles (1:1)
├── clients (1:N)
├── opportunities (1:N)
├── tasks (1:N - created_by)
├── tasks (1:N - assigned_to)
├── contracts (1:N)
├── strategies (1:N)
├── events (1:N)
├── financial_entries (1:N)
└── system_settings (1:N)

clients
├── opportunities (1:N)
├── tasks (1:N)
├── contracts (1:N)
├── strategies (1:N)
├── events (1:N)
└── financial_entries (1:N)

contracts
└── financial_entries (1:N)
```

## Políticas RLS (Row Level Security)

Todas as tabelas possuem RLS habilitado com políticas que garantem:

1. **Isolamento por usuário**: Usuários só veem/editam dados criados por eles
2. **Compartilhamento de tarefas**: Usuários podem ver tarefas atribuídas a eles
3. **Segurança**: Nenhum acesso cross-user sem permissão

## Triggers e Funções

### 1. update_updated_at_column()
- **Propósito**: Atualiza automaticamente o campo `updated_at`
- **Aplicado em**: Todas as tabelas principais

### 2. handle_new_user()
- **Propósito**: Cria automaticamente um perfil quando usuário se registra
- **Trigger**: `on_auth_user_created` na tabela `auth.users`

## Notas para Migração Futura

### Para FastAPI + PostgreSQL:

1. **Autenticação**: 
   - Supabase auth.users → Sistema JWT próprio
   - Manter estrutura da tabela profiles

2. **UUID**: 
   - Usar `uuid-ossp` extension no PostgreSQL
   - Manter campos UUID para compatibilidade

3. **Timestamps**: 
   - Usar `TIMESTAMP WITH TIME ZONE`
   - Configurar timezone UTC

4. **Enums**: 
   - Substituir CHECK constraints por ENUMs do PostgreSQL
   - Ou validar na aplicação (FastAPI/Pydantic)

5. **Arrays**: 
   - Campo `attendees` usa array nativo do PostgreSQL
   - Compatível com FastAPI + SQLAlchemy

### Dados de Exemplo para Testes:
- Adicionar seeds/fixtures com dados realistas
- Configurar ambiente de desenvolvimento com dados de teste
- Manter compatibilidade de tipos entre Supabase e PostgreSQL nativo
