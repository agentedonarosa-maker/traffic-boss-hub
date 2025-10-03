import { useState } from "react";
import {
  BarChart3,
  Users,
  Target,
  Settings,
  Calendar,
  FileText,
  Menu,
  ClipboardCheck,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Clientes", url: "/clients", icon: Users },
  { title: "Campanhas", url: "/campaigns", icon: Target },
  { title: "Relatórios", url: "/reports", icon: FileText },
  { title: "Agenda", url: "/calendar", icon: Calendar },
  { title: "Onboarding", url: "/onboarding", icon: ClipboardCheck },
  { title: "Configurações", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) =>
    isActive(path)
      ? "bg-gradient-primary text-primary-foreground font-medium shadow-md"
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-foreground">TrafficPro</h2>
                <p className="text-xs text-muted-foreground">Gestão de Tráfego</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider font-medium text-muted-foreground px-4 py-2">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-all duration-200 ${getNavClassName(
                        item.url
                      )}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-border">
            <div className="bg-gradient-primary/10 rounded-lg p-3">
              <p className="text-xs font-medium text-primary">Versão Pro</p>
              <p className="text-xs text-muted-foreground mt-1">
                Clientes ilimitados
              </p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}