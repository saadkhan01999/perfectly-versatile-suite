import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  DollarSign, 
  FileText, 
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Users, label: "Students", id: "students" },
  { icon: BookOpen, label: "Courses", id: "courses" },
  { icon: DollarSign, label: "Fees", id: "fees" },
  { icon: FileText, label: "Reports", id: "reports" },
  { icon: Settings, label: "Settings", id: "settings" },
];

export function AppSidebar({ activeSection, onSectionChange }) {
  const { collapsed } = useSidebar();
  const location = useLocation();
  
  const isExpanded = menuItems.some((item) => activeSection === item.id);

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-60"} bg-[hsl(var(--sidebar-bg))] border-r border-white/10`}
      collapsible
    >
      <SidebarContent className="bg-[hsl(var(--sidebar-bg))] text-white">
        <div className="p-6 border-b border-white/10">
          {!collapsed && (
            <h1 className="text-xl font-bold text-white">Academy Management</h1>
          )}
        </div>

        <SidebarGroup
          open={isExpanded}
          className="p-4"
        >
          <SidebarGroupLabel className="text-white/80">
            {!collapsed && "Main Navigation"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      asChild
                      className={`
                        flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all
                        ${isActive 
                          ? "bg-[hsl(var(--sidebar-accent))] text-white shadow-md" 
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                        }
                      `}
                    >
                      <button
                        onClick={() => onSectionChange(item.id)}
                      >
                        <Icon className="h-5 w-5" />
                        {!collapsed && <span>{item.label}</span>}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}