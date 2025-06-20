
import { Home, Users, Target, BarChart3, Settings, Calendar, DollarSign, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Clientes',
    url: '/clientes',
    icon: Users,
  },
  {
    title: 'Oportunidades',
    url: '/oportunidades',
    icon: Target,
  },
  {
    title: 'Relatórios',
    url: '/relatorios',
    icon: BarChart3,
  },
  {
    title: 'Configurações',
    url: '/configuracoes',
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
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
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
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
