
import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
  Target,
  CheckSquare,
  Calendar,
  BarChart3,
  DollarSign,
  FileText,
  Brain,
  Settings,
  Link
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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "CRM Inteligente",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Vendas Corp",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Marketing Plus",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
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
      title: "Relatórios",
      url: "/relatorios",
      icon: PieChart,
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
      icon: Brain,
    },
    {
      title: "Equipe",
      url: "/equipe",
      icon: Users,
    },
    {
      title: "Integrações",
      url: "/integracoes",
      icon: Link,
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
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
