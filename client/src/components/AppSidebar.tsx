import * as React from "react";
import {
  LayoutDashboard,
  UserPlus,
  BrainCircuit,
  FileHeart,
  Siren,
  History,
  Heart,
  ShieldCheck,
  Building2,
  Users,
  Activity,
  Settings,
  BookOpen,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { usePediatric } from "../context/PediatricContext";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({
  openAuditDrawer,
  ...props
}: React.ComponentProps<typeof Sidebar> & { openAuditDrawer: () => void }) {
  const { alerts } = usePediatric();
  const location = useLocation();
  const unacknowledgedAlertsCount = alerts.filter(a => !a.acknowledged).length;

  const groups = [
    {
      label: "Dashboards",
      items: [
        {
          to: "/dashboard",
          icon: LayoutDashboard,
          label: "Executive Dashboard",
          active: location.pathname === "/dashboard",
        },
        {
          to: "/alerts",
          icon: Siren,
          label: "Alerts & Escalation",
          active: location.pathname === "/alerts",
          badge:
            unacknowledgedAlertsCount > 0
              ? String(unacknowledgedAlertsCount)
              : null,
        },
      ],
    },
    {
      label: "Clinical Operations",
      items: [
        {
          to: "/intake",
          icon: UserPlus,
          label: "Intake & Assessment",
          active: location.pathname === "/intake",
        },
        {
          to: "/recommendation",
          icon: BrainCircuit,
          label: "Specialist Matcher",
          active: location.pathname === "/recommendation",
        },
        {
          to: "/patients",
          icon: FileHeart,
          label: "Patient Directory",
          active: location.pathname.startsWith("/patients"),
        },
      ],
    },
    {
      label: "Specialized Care",
      items: [
        {
          to: "/specialist-workspace",
          icon: Activity,
          label: "Specialist Workspace",
          active: location.pathname === "/specialist-workspace",
        },
        {
          to: "/mdt",
          icon: Users,
          label: "Tumor Board / MDT",
          active: location.pathname === "/mdt",
        },
      ],
    },
    {
      label: "System",
      items: [
        {
          to: "/repository",
          icon: BookOpen,
          label: "Knowledge Repository",
          active: location.pathname === "/repository",
        },
        {
          to: "/admin",
          icon: Settings,
          label: "Master Data Config",
          active: location.pathname === "/admin",
        },
      ],
    },
  ];

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      {...props}
      className="border-r-0"
    >
      <SidebarHeader className="bg-sidebar border-b border-white/[0.06] p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<NavLink to="/dashboard" />}
              className="group/logo hover:bg-white/[0.04] hover:border-white/10 border border-transparent rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]"
            >
              <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-white text-black shadow-md group-hover/logo:shadow-lg group-hover/logo:scale-105 transition-all duration-300">
                <Heart className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none overflow-hidden">
                <span className="font-bold text-[14px] tracking-tight truncate">
                  Pediatric Care
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-[0.12em] text-muted-foreground">
                  Network · Solaris
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-sidebar px-2">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.06, delayChildren: 0.08 },
            },
          }}
          className="flex flex-col gap-2 py-2"
        >
          <div className="px-2 py-3 mb-1 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="h-7 w-7 rounded-lg bg-white/10 grid place-items-center border border-white/10">
                <Building2 className="h-3.5 w-3.5" />
              </span>
              <span className="truncate">Main City Hospital</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-white bg-white/10 border border-white/10 px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              Phase 1 Node · Live
            </div>
          </div>

          {groups.map(group => (
            <motion.div
              key={group.label}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as any },
                },
              }}
            >
              <SidebarGroup className="p-1">
                <SidebarGroupLabel className="px-2 mb-1">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1">
                    {group.items.map(item => (
                      <SidebarMenuItem key={item.to}>
                        <motion.div
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 17,
                          }}
                        >
                          <SidebarMenuButton
                            render={<NavLink to={item.to} />}
                            isActive={item.active}
                            tooltip={item.label}
                            className="relative"
                          >
                            <item.icon
                              className={
                                item.active
                                  ? "text-black"
                                  : "text-muted-foreground group-hover/menu-button:text-foreground"
                              }
                            />
                            <span className="truncate">{item.label}</span>
                            {item.active && (
                              <motion.span
                                layoutId="sidebar-active"
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[2px] rounded-full bg-black"
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 30,
                                }}
                              />
                            )}
                          </SidebarMenuButton>
                        </motion.div>
                        {item.badge && (
                          <SidebarMenuBadge className="bg-white text-black font-bold px-1.5 min-w-[20px] rounded-full border border-white/20 shadow-sm animate-pulse">
                            {item.badge}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </motion.div>
          ))}
        </motion.div>
      </SidebarContent>

      <SidebarFooter className="bg-sidebar border-t border-white/[0.06] p-3 gap-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
              <SidebarMenuButton
                onClick={openAuditDrawer}
                tooltip="Audit Log Trace"
                className="border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/15 group/audit"
              >
                <History className="text-muted-foreground group-hover/audit:text-foreground transition-colors" />
                <span className="font-semibold">Audit Log Trace</span>
                <SidebarMenuBadge className="bg-white/[0.08] text-foreground border-white/10 font-medium">
                  Live
                </SidebarMenuBadge>
              </SidebarMenuButton>
            </motion.div>
          </SidebarMenuItem>
        </SidebarMenu>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-3.5 backdrop-blur"
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="h-6 w-6 rounded-lg bg-white text-black grid place-items-center">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            Human-in-the-Loop
          </div>
          <p className="mt-2 text-[11px] font-medium leading-relaxed text-muted-foreground">
            Clinical Decision Support. Auto-assignment disabled.
          </p>
        </motion.div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
