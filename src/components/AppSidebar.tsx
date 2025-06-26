
import * as React from "react"
import {
  BarChart3,
  Building2,
  Calendar,
  Users,
  Target,
  CheckSquare,
  DollarSign,
  FileText,
  Lightbulb,
  PieChart,
  Settings,
  UsersIcon,
  Puzzle
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Building2,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: Building2,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Building2,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Organizações",
      url: "/organizations",
      icon: Building2,
    },
    {
      title: "Clientes",
      url: "/clientes",
      icon: Users,
    },
    {
      title: "Oportunidades",
      url: "/oportunidades",
      icon: Target,
    },
    {
      title: "Tarefas",
      url: "/tarefas",
      icon: CheckSquare,
    },
    {
      title: "Agenda",
      url: "/agenda",
      icon: Calendar,
    },
    {
      title: "Financeiro",
      url: "/financeiro",
      icon: DollarSign,
    },
    {
      title: "Contratos",
      url: "/contratos",
      icon: FileText,
    },
    {
      title: "Estratégias",
      url: "/estrategias",
      icon: Lightbulb,
    },
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: PieChart,
    },
    {
      title: "Equipe",
      url: "/equipe",
      icon: UsersIcon,
    },
    {
      title: "Integrações",
      url: "/integracoes",
      icon: Puzzle,
    },
    {
      title: "Configurações",
      url: "/configuracoes",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
