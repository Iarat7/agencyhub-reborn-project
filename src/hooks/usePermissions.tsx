
import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface Permission {
  module: string;
  actions: string[];
}

export interface RolePermissions {
  role: 'admin' | 'manager' | 'user';
  permissions: Permission[];
}

const rolePermissions: RolePermissions[] = [
  {
    role: 'admin',
    permissions: [
      { module: 'dashboard', actions: ['view', 'edit'] },
      { module: 'clients', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      { module: 'opportunities', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      { module: 'tasks', actions: ['view', 'create', 'edit', 'delete', 'assign'] },
      { module: 'team', actions: ['view', 'invite', 'edit', 'delete', 'manage_roles'] },
      { module: 'financial', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      { module: 'contracts', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      { module: 'reports', actions: ['view', 'export', 'advanced'] },
      { module: 'settings', actions: ['view', 'edit', 'manage_integrations'] },
      { module: 'strategies', actions: ['view', 'create', 'edit', 'delete'] },
    ]
  },
  {
    role: 'manager',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'clients', actions: ['view', 'create', 'edit', 'export'] },
      { module: 'opportunities', actions: ['view', 'create', 'edit', 'export'] },
      { module: 'tasks', actions: ['view', 'create', 'edit', 'assign'] },
      { module: 'team', actions: ['view', 'invite'] },
      { module: 'financial', actions: ['view', 'export'] },
      { module: 'contracts', actions: ['view', 'create', 'edit'] },
      { module: 'reports', actions: ['view', 'export'] },
      { module: 'settings', actions: ['view'] },
      { module: 'strategies', actions: ['view', 'create', 'edit'] },
    ]
  },
  {
    role: 'user',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'clients', actions: ['view', 'create', 'edit'] },
      { module: 'opportunities', actions: ['view', 'create', 'edit'] },
      { module: 'tasks', actions: ['view', 'create', 'edit'] },
      { module: 'team', actions: ['view'] },
      { module: 'financial', actions: ['view'] },
      { module: 'contracts', actions: ['view'] },
      { module: 'reports', actions: ['view'] },
      { module: 'settings', actions: ['view'] },
      { module: 'strategies', actions: ['view'] },
    ]
  }
];

export const usePermissions = () => {
  const { user } = useAuth();

  const userPermissions = useMemo(() => {
    if (!user?.role) return [];
    
    const roleConfig = rolePermissions.find(rp => rp.role === user.role);
    return roleConfig?.permissions || [];
  }, [user?.role]);

  const hasPermission = (module: string, action: string): boolean => {
    const modulePermissions = userPermissions.find(p => p.module === module);
    return modulePermissions?.actions.includes(action) || false;
  };

  const canAccess = (module: string): boolean => {
    return userPermissions.some(p => p.module === module);
  };

  const getModuleActions = (module: string): string[] => {
    const modulePermissions = userPermissions.find(p => p.module === module);
    return modulePermissions?.actions || [];
  };

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const isUser = user?.role === 'user';

  return {
    permissions: userPermissions,
    hasPermission,
    canAccess,
    getModuleActions,
    isAdmin,
    isManager,
    isUser,
    userRole: user?.role
  };
};
