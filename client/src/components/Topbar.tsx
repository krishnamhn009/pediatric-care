import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  History,
  ShieldCheck,
  User as UserIcon,
  LogOut,
  Settings,
  Sliders,
} from "lucide-react";
import { usePediatric } from "../context/PediatricContext";
import { useAuth } from "../context/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "./NotificationCenter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface TopbarProps {
  openAuditDrawer: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ openAuditDrawer }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cases, alerts, notifications } = usePediatric();
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  const getPageBreadcrumb = () => {
    if (location.pathname === "/") return "Landing Overview";
    if (location.pathname === "/dashboard") return "Executive Command Center";
    if (location.pathname === "/intake")
      return "Registration & Clinical Intake";
    if (location.pathname === "/recommendation")
      return "Specialist Recommendation Engine";
    if (location.pathname.startsWith("/patients/"))
      return "Master Health Record";
    if (location.pathname === "/alerts") return "Follow-up & Escalation Queue";
    if (location.pathname === "/mdt") return "Multidisciplinary Workspace";
    if (location.pathname === "/repository") return "Knowledge Repository";
    if (location.pathname === "/admin") return "Master Data Config";
    return "Clinical Workspace";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const unreadNotif = notifications.filter(n => !n.read).length;
  const bellCount = Math.max(unreadNotif, unacknowledgedAlerts.length);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/[0.06] bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-[56px] items-center px-4 md:px-6">
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger />
          <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <span>Main City Hospital</span>
            <span>/</span>
            <span className="text-foreground">{getPageBreadcrumb()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={openAuditDrawer}
            className="hidden sm:flex gap-2 rounded-full border-white/10 bg-white/[0.04] hover:bg-white/10 hover:border-white/15"
          >
            <History className="h-4 w-4" />
            <span>Audit Log</span>
          </Button>

          <div className="hidden lg:flex items-center w-64">
            <Select onValueChange={val => navigate(`/patients/${val}`)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Active Patient..." />
              </SelectTrigger>
              <SelectContent>
                {cases.map(c => (
                  <SelectItem key={c.patientId} value={c.patientId}>
                    {c.patientName} ({c.patientId}) - Stage {c.currentStage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setNotifOpen(true)}
            className="relative rounded-xl border-white/10 bg-white/[0.04] hover:bg-white/10 hover:border-white/15 backdrop-blur"
          >
            <Bell className="h-5 w-5" />
            {bellCount > 0 && (
              <Badge
                variant="default"
                className="absolute -right-1.5 -top-1.5 min-w-5 h-5 px-1 flex items-center justify-center text-[11px] font-bold border-white shadow-md"
              >
                {bellCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full ml-2 border border-white/10 hover:bg-white/10"
                />
              }
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-white text-black font-bold">
                  {user?.name.substring(0, 2).toUpperCase() || "DA"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.role || "Observer"}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Sliders className="mr-2 h-4 w-4" />
                <span>Clinical Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Secure Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border-t border-white/[0.06] bg-white/[0.02] backdrop-blur px-4 py-2 text-xs font-medium text-muted-foreground flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
          <span className="font-semibold text-foreground">Live Workspace:</span>
          <span>Intelligent Specialist Matching & Continuity Engine</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-foreground font-semibold">
            <ShieldCheck className="h-4 w-4" /> HIPAA / DPDP 2023 Compliant
          </span>
          <span className="hidden md:inline opacity-30">|</span>
          <span className="hidden md:inline font-mono">
            10-Stage Care Pipeline Enabled
          </span>
        </div>
      </div>
      <NotificationCenter
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
    </header>
  );
};
