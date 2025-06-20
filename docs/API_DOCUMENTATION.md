
# Documentação da API

## Visão Geral

A API do CRM segue padrões RESTful e utiliza Supabase como backend principal.

## Autenticação

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Resposta:**

```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "role": "user"
  },
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

### Logout

```http
POST /auth/logout
Authorization: Bearer {access_token}
```

## Endpoints Principais

### Oportunidades

#### Listar Oportunidades

```http
GET /api/opportunities
Authorization: Bearer {access_token}
```

**Parâmetros de Query:**

- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20)
- `search`: Termo de busca
- `stage`: Filtrar por estágio
- `client_id`: Filtrar por cliente

**Resposta:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Oportunidade Exemplo",
      "client_id": "uuid",
      "value": 10000,
      "probability": 75,
      "stage": "qualification",
      "expected_close_date": "2024-12-31",
      "description": "Descrição da oportunidade",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### Criar Oportunidade

```http
POST /api/opportunities
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Nova Oportunidade",
  "client_id": "uuid",
  "value": 15000,
  "probability": 60,
  "stage": "prospection",
  "expected_close_date": "2024-12-31",
  "description": "Descrição da nova oportunidade"
}
```

#### Atualizar Oportunidade

```http
PUT /api/opportunities/{id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Oportunidade Atualizada",
  "value": 20000,
  "probability": 80,
  "stage": "proposal"
}
```

#### Excluir Oportunidade

```http
DELETE /api/opportunities/{id}
Authorization: Bearer {access_token}
```

### Clientes

#### Listar Clientes

```http
GET /api/clients
Authorization: Bearer {access_token}
```

**Resposta:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Cliente Exemplo",
      "email": "cliente@example.com",
      "phone": "(11) 99999-9999",
      "company": "Empresa XYZ",
      "address": "Rua Exemplo, 123",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Criar Cliente

```http
POST /api/clients
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Novo Cliente",
  "email": "novo@example.com",
  "phone": "(11) 88888-8888",
  "company": "Nova Empresa",
  "address": "Nova Rua, 456"
}
```

### Tarefas

#### Listar Tarefas

```http
GET /api/tasks
Authorization: Bearer {access_token}
```

**Parâmetros de Query:**

- `status`: Filtrar por status (pending, completed, cancelled)
- `priority`: Filtrar por prioridade (low, medium, high, urgent)
- `due_date`: Filtrar por data de vencimento

**Resposta:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Tarefa Exemplo",
      "description": "Descrição da tarefa",
      "status": "pending",
      "priority": "medium",
      "due_date": "2024-12-31",
      "assigned_to": "uuid",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Códigos de Status

- `200 OK`: Sucesso
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Dados inválidos
- `401 Unauthorized`: Token inválido ou ausente
- `403 Forbidden`: Sem permissão para acessar o recurso
- `404 Not Found`: Recurso não encontrado
- `422 Unprocessable Entity`: Erro de validação
- `500 Internal Server Error`: Erro interno do servidor

## Validação de Dados

### Oportunidade

```typescript
interface OpportunityValidation {
  title: string; // Obrigatório, min: 1, max: 255
  client_id?: string; // UUID válido
  value?: number; // >= 0
  probability?: number; // 0-100
  stage: 'prospection' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  expected_close_date?: string; // Formato: YYYY-MM-DD
  description?: string; // max: 1000
}
```

### Cliente

```typescript
interface ClientValidation {
  name: string; // Obrigatório, min: 1, max: 255
  email?: string; // Email válido
  phone?: string; // Formato brasileiro
  company?: string; // max: 255
  address?: string; // max: 500
}
```

## Rate Limiting

- **Limite geral**: 1000 requisições por hora por usuário
- **Limite de criação**: 100 criações por hora por usuário
- **Limite de upload**: 10 uploads por minuto por usuário

## Webhooks

### Configuração

```http
POST /api/webhooks
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "url": "https://seu-site.com/webhook",
  "events": ["opportunity.created", "opportunity.updated", "client.created"],
  "secret": "seu_secret_webhook"
}
```

### Eventos Disponíveis

- `opportunity.created`
- `opportunity.updated`
- `opportunity.deleted`
- `client.created`
- `client.updated`
- `client.deleted`
- `task.created`
- `task.updated`
- `task.completed`

### Formato do Payload

```json
{
  "event": "opportunity.created",
  "timestamp": "2024-01-01T00:00:00Z",
  "data": {
    "id": "uuid",
    "title": "Nova Oportunidade",
    // ... outros campos
  },
  "user_id": "uuid"
}
```

## SDK JavaScript

### Instalação

```bash
npm install @crm/sdk
```

### Uso

```typescript
import { CRMClient } from '@crm/sdk';

const client = new CRMClient({
  apiUrl: 'https://api.crm.com',
  accessToken: 'seu_token'
});

// Listar oportunidades
const opportunities = await client.opportunities.list({
  stage: 'qualification',
  limit: 10
});

// Criar oportunidade
const newOpportunity = await client.opportunities.create({
  title: 'Nova Oportunidade',
  value: 10000,
  stage: 'prospection'
});
```

## Tratamento de Erros

### Formato de Erro

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email deve ter um formato válido"
      }
    ]
  }
}
```

### Códigos de Erro Comuns

- `VALIDATION_ERROR`: Erro de validação de dados
- `AUTH_ERROR`: Erro de autenticação
- `PERMISSION_ERROR`: Erro de permissão
- `RATE_LIMIT_ERROR`: Limite de requisições excedido
- `INTERNAL_ERROR`: Erro interno do servidor
