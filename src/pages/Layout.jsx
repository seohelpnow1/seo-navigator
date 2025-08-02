
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BarChart3, 
  Search, 
  Globe, 
  FileText, 
  TrendingUp,
  Zap
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
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "Website Analysis",
    url: createPageUrl("Analysis"),
    icon: Globe,
  },
  {
    title: "Keywords",
    url: createPageUrl("Keywords"),
    icon: Search,
  },
  {
    title: "Reports",
    url: createPageUrl("Reports"),
    icon: FileText,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary: 220 100% 50%;
            --primary-foreground: 0 0% 100%;
            --secondary: 210 100% 96%;
            --secondary-foreground: 222 84% 5%;
            --accent: 142 76% 36%;
            --accent-foreground: 0 0% 100%;
            --background: 0 0% 100%;
            --foreground: 222 84% 5%;
            --muted: 210 40% 98%;
            --muted-foreground: 215 13% 37%;
            --border: 214 32% 91%;
            --ring: 220 100% 50%;
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-r border-slate-200/60 bg-white/80 backdrop-blur-xl">
          <SidebarHeader className="border-b border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">SEO Master</h2>
                <p className="text-xs text-slate-500 font-medium">Professional SEO Analytics</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 rounded-xl mb-1 ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm' 
                            : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Quick Actions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-900">SEO Health</span>
                    </div>
                    <div className="text-xs text-green-700">
                      Monitor your website's SEO performance in real-time
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-200/60 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <span className="text-slate-700 font-semibold text-sm">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">SEO Expert</p>
                <p className="text-xs text-slate-500 truncate">Optimize your web presence</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-xl transition-colors duration-300" />
              <h1 className="text-xl font-bold text-slate-900">SEO Master</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
