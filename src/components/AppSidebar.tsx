
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { MainNavigation } from '@/components/navigation/MainNavigation';

export function AppSidebar() {
  const { user } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <h1 className="text-xl font-bold text-sidebar-primary">AgencyHub</h1>
        {user && (
          <p className="text-sm text-sidebar-foreground/70">
            Olá, {user.full_name || 'Usuário'}
          </p>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <MainNavigation />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <p className="text-xs text-sidebar-foreground/50">
          AgencyHub v1.0
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
