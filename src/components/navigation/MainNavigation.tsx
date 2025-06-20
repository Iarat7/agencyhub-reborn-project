
import React from 'react';
import { Home, Users, Target, BarChart3, Settings, CheckSquare, Calendar, FileText, DollarSign } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

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
    title: 'Tarefas',
    url: '/tarefas',
    icon: CheckSquare,
  },
  {
    title: 'Contratos',
    url: '/contratos',
    icon: FileText,
  },
  {
    title: 'Financeiro',
    url: '/financeiro',
    icon: DollarSign,
  },
  {
    title: 'Agenda',
    url: '/agenda',
    icon: Calendar,
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

export const MainNavigation = () => {
  const location = useLocation();

  return (
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
  );
};
