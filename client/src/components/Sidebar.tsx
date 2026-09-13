import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
 LayoutDashboard,
 UserPlus,
 BrainCircuit,
 FileHeart,
 Siren,
 History,
 Heart,
 X,
 ShieldCheck,
 Building2,
 ExternalLink,
} from "lucide-react";
import { usePediatric } from "../context/PediatricContext";

interface SidebarProps {
 sidebarOpen: boolean;
 setSidebarOpen: (open: boolean) => void;
 openAuditDrawer: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
 sidebarOpen,
 setSidebarOpen,
 openAuditDrawer,
}) => {
 const { alerts, cases } = usePediatric();
 const location = useLocation();

 const unacknowledgedAlertsCount = alerts.filter(a => !a.acknowledged).length;

 const navItems = [
    { label: "Executive Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Intake & Assessment", to: "/intake", icon: UserPlus },
    { label: "Specialist Matcher", to: "/recommendation", icon: BrainCircuit },
    {
      label: "Patient Directory",
      to: "/patients",
      icon: FileHeart,
      activeSubpath: "/patients",
    },
    {
      label: "Specialist Workspace",
      to: "/specialist-workspace",
      icon: ExternalLink,
    },
    {
      label: "Tumor Board / MDT",
      to: "/mdt",
      icon: ExternalLink,
    },
    {
      label: "Knowledge Repository",
      to: "/repository",
      icon: ExternalLink,
    },
    {
      label: "Alerts & Escalation",
      to: "/alerts",
      icon: Siren,
      badge: unacknowledgedAlertsCount > 0 ? unacknowledgedAlertsCount : undefined,
    },
    {
      label: "Master Data Config",
      to: "/admin",
      icon: ShieldCheck,
    },
  ];

 return (
 <>
 <aside
 className={`fixed inset-y-0 left-0 z-40 flex w-[260px] -translate-x-full flex-col bg-teal-950 px-4 py-5 text-teal-50 shadow-[12px_0_32px_rgba(4,47,46,0.5)] transition-transform duration-300 lg:static lg:translate-x-0 ${
 sidebarOpen ? "translate-x-0" : ""
 }`}
 >
 {/* Brand Header */}
 <div className="flex items-center justify-between px-2">
 <Link to="/dashboard" className="flex items-center gap-3 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-cyan-400 rounded-none p-1">
 <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-cyan-600 text-white shadow-lg shadow-cyan-600/30">
 <Heart className="h-5 w-5 fill-white" />
 <span className="absolute right-1 top-1 h-2 w-2 rounded-none bg-green-400 animate-pulse" />
 </div>
 <div>
 <div className="font-display text-[15px] font-extrabold tracking-tight">
 Pediatric Care
 </div>
 <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
 Network
 </div>
 </div>
 </Link>
 <button
 aria-label="Close sidebar"
 className="rounded-none p-2 text-teal-400 hover:bg-teal-900 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-cyan-400 lg:hidden cursor-pointer"
 onClick={() => setSidebarOpen(false)}
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 {/* Facility Info Badge */}
 <div className="mt-6 rounded-none border border-teal-800 bg-teal-900/80 p-3">
 <div className="flex items-center gap-2 text-xs font-semibold text-teal-100">
 <Building2 className="h-4 w-4 text-cyan-400" />
 <span>Main City Hospital</span>
 </div>
 <div className="mt-1 flex items-center gap-2 text-[10px] text-teal-300">
 <span className="h-1.5 w-1.5 rounded-none bg-green-500" />
 <span>Phase 1 Clinical Node · Live</span>
 </div>
 </div>

 {/* Navigation Section */}
 <div className="mt-6 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-teal-500">
 Clinical Navigation
 </div>

 <nav className="mt-2 space-y-1">
 {navItems.map(item => {
 const Icon = item.icon;
 const isPathActive = item.activeSubpath
 ? location.pathname.startsWith(item.activeSubpath)
 : location.pathname === item.to;

 return (
 <NavLink
 key={item.to}
 to={item.to}
 end={item.to === "/"}
 onClick={() => setSidebarOpen(false)}
 className={() =>
 `flex min-h-[44px] items-center gap-3 rounded-none px-3 text-[13px] font-semibold transition focus:outline-hidden focus-visible:ring-4 focus-visible:ring-cyan-400 ${
 isPathActive
 ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/25 font-bold"
 : "text-teal-200 hover:bg-teal-900 hover:text-white"
 }`
 }
 >
 <Icon
 className={`h-4 w-4 ${isPathActive ? "text-white" : "text-teal-400"}`}
 />
 <span className="flex-1">{item.label}</span>
 {item.badge && (
 <span className="rounded-none bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-none border border-cyan-100" aria-label={`${item.badge} unread alerts`}>
 {item.badge}
 </span>
 )}
 </NavLink>
 );
 })}
 </nav>

 {/* Audit Log Launcher Button */}
 <div className="mt-6 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-teal-500">
 Governance & Traceability
 </div>
 <button
 onClick={() => {
 setSidebarOpen(false);
 openAuditDrawer();
 }}
 className="mt-2 flex min-h-[44px] w-full items-center gap-3 rounded-none border border-teal-800 bg-teal-900/60 px-3 text-left text-[13px] font-semibold text-teal-200 transition hover:border-cyan-500/50 hover:bg-teal-800 hover:text-cyan-100 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-cyan-400 cursor-pointer"
 >
 <History className="h-4 w-4 text-green-400" />
 <span className="flex-1">Audit Log Trace</span>
 <span className="rounded bg-teal-950 px-1.5 py-0.5 text-[10px] font-bold text-green-400 border border-teal-800">
 Live
 </span>
 </button>

 {/* System Safeguard Footer */}
 <div className="mt-auto rounded-none border border-teal-800/60 bg-teal-900/40 p-4">
 <div className="flex items-center gap-2 text-[11px] font-bold text-cyan-300">
 <ShieldCheck className="h-4 w-4 text-cyan-400" />
 <span>Human-in-the-Loop</span>
 </div>
 <p className="mt-2 text-[11px] leading-relaxed text-teal-400">
 Clinical Decision Support System. Auto-assignment is strictly disabled.
 </p>
 </div>
 </aside>

 {/* Backdrop for mobile */}
 {sidebarOpen && (
 <button
 aria-label="Close navigation overlay"
 className="fixed inset-0 z-30 bg-teal-950/60 backdrop-blur-sm lg:hidden cursor-pointer"
 onClick={() => setSidebarOpen(false)}
 />
 )}
 </>
 );
};
