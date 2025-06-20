
# Guia de Componentes

## Componentes Base (UI)

### Button

```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

// Uso
<Button variant="outline" size="sm" onClick={handleClick}>
  Clique aqui
</Button>
```

### Input

```typescript
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

// Uso
<Input
  type="email"
  placeholder="Digite seu email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
/>
```

## Componentes de Filtros

### FilterField

Componente base para campos de filtro com validação integrada.

```typescript
interface FilterFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'email' | 'phone';
  placeholder?: string;
  options?: SelectOption[];
  validation?: ValidationConfig;
}

// Uso
<FilterField
  config={{
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Digite o email',
    validation: { required: true }
  }}
  value={filters.email}
  onChange={(value) => updateFilter('email', value)}
  error={errors.email}
/>
```

### AdvancedFilterPanel

Painel completo de filtros avançados com contador de filtros ativos.

```typescript
interface AdvancedFilterPanelProps {
  fields: FilterFieldConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
  title?: string;
}

// Uso
<AdvancedFilterPanel
  fields={opportunityFields}
  values={filters}
  onChange={setFilters}
  onReset={resetFilters}
  isOpen={isFilterOpen}
  onToggle={toggleFilters}
  title="Filtros de Oportunidades"
/>
```

## Componentes de Formulários

### OpportunityForm

Formulário completo para criação e edição de oportunidades.

```typescript
interface OpportunityFormProps {
  opportunity?: Opportunity | null;
  onSubmit: (data: OpportunityFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}

// Uso
<OpportunityForm
  opportunity={selectedOpportunity}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isLoading={mutation.isPending}
/>
```

## Componentes de Dashboard

### PerformanceIndicator

Componente para exibir métricas de performance.

```typescript
interface PerformanceIndicatorProps {
  metric: string;
  value: number;
  threshold: number;
  format?: 'percentage' | 'number' | 'currency';
}

// Uso
<PerformanceIndicator
  metric="Taxa de Conversão"
  value={75}
  threshold={70}
  format="percentage"
/>
```

### OptimizedDashboardMetrics

Dashboard com métricas otimizadas e cache inteligente.

```typescript
interface OptimizedDashboardMetricsProps {
  period: string;
  refreshInterval?: number;
  enableRealTime?: boolean;
}

// Uso
<OptimizedDashboardMetrics
  period="6m"
  refreshInterval={30000}
  enableRealTime={true}
/>
```

## Componentes de Notificações

### NotificationCenter

Central de notificações com suporte a diferentes tipos.

```typescript
interface NotificationCenterProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
  autoHide?: boolean;
  hideDelay?: number;
}

// Uso
<NotificationCenter
  position="top-right"
  maxNotifications={5}
  autoHide={true}
  hideDelay={5000}
/>
```

## Hooks Personalizados

### useAdvancedFiltering

Hook para gerenciamento de filtros avançados com estado persistente.

```typescript
const {
  filters,
  filteredData,
  isFilterOpen,
  setFilters,
  resetFilters,
  togglePanel,
  hasActiveFilters,
  getActiveFiltersCount
} = useAdvancedFiltering(data, filterFunction, initialFilters);
```

### useFormValidation

Hook para validação de formulários em tempo real.

```typescript
const {
  errors,
  validateForm,
  validateSingleField,
  clearErrors,
  clearFieldError
} = useFormValidation(fields);
```

### useNotificationSystem

Hook para gerenciamento do sistema de notificações.

```typescript
const {
  notifications,
  addNotification,
  removeNotification,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} = useNotificationSystem();
```

## Padrões de Uso

### Composição de Componentes

```typescript
// Composição recomendada
const OpportunityPage = () => {
  return (
    <PageLayout>
      <PageHeader
        title="Oportunidades"
        actions={<CreateOpportunityButton />}
      />
      <FilterSection>
        <AdvancedFilters {...filterProps} />
      </FilterSection>
      <ContentSection>
        <OpportunitiesTable {...tableProps} />
      </ContentSection>
    </PageLayout>
  );
};
```

### Reutilização

```typescript
// Hook reutilizável para diferentes entidades
const useEntityManagement = <T>(
  service: EntityService<T>,
  filterFunction: FilterFunction<T>
) => {
  // Lógica comum de CRUD e filtros
  return {
    data,
    filteredData,
    create,
    update,
    delete,
    filters,
    // ...
  };
};
```

## Estilização

### Convenções Tailwind

```typescript
// Classes base para componentes
const buttonClasses = {
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  variants: {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent",
  },
  sizes: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
  }
};
```

### Responsividade

```typescript
// Padrão responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Conteúdo */}
</div>
```

## Acessibilidade

### Práticas Recomendadas

```typescript
// ARIA labels e roles
<button
  aria-label="Editar oportunidade"
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && onClick()}
>
  <Edit size={16} />
</button>

// Focus management
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (isOpen) {
    inputRef.current?.focus();
  }
}, [isOpen]);
```
