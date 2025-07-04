
import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children: React.ReactNode;
}

const routeNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/organizations': 'Organizações',
  '/clientes': 'Clientes',
  '/oportunidades': 'Oportunidades',
  '/tarefas': 'Tarefas',
  '/equipe': 'Equipe',
  '/financeiro': 'Financeiro',
  '/contratos': 'Contratos',
  '/relatorios': 'Relatórios',
  '/configuracoes': 'Configurações',
  '/agenda': 'Agenda',
  '/estrategias': 'Estratégias',
  '/integracoes': 'Integrações',
};

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const currentRouteName = routeNames[location.pathname] || 'Página';

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-screen">
        <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              {location.pathname !== '/dashboard' && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{currentRouteName}</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-x-hidden">
          <div className="min-h-[calc(100vh-4rem)] p-4 md:p-6">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
