import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
 Menu,
 Bell,
 Sun,
 Moon,
 History,
 ShieldCheck,
 User as UserIcon,
 LogOut,
 Settings,
 Sliders
} from "lucide-react";
import { usePediatric } from "../context/PediatricContext";
import { useAuth } from "../context/AuthContext";

interface TopbarProps {
 setSidebarOpen: (open: boolean) => void;
 openAuditDrawer: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ setSidebarOpen, openAuditDrawer }) => {
 const [darkMode, setDarkMode] = useState(false);
 const [profileOpen, setProfileOpen] = useState(false);
 const dropdownRef = useRef<HTMLDivElement>(null);
 const location = useLocation();
 const navigate = useNavigate();
 const { cases, alerts } = usePediatric();
 const { user, logout } = useAuth();

 useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
   if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    setProfileOpen(false);
   }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 const toggleDarkMode = () => {
  setDarkMode(!darkMode);
  document.documentElement.classList.toggle("dark", !darkMode);
 };

 const getPageBreadcrumb = () => {
  if (location.pathname === "/") return "Landing Overview";
  if (location.pathname === "/dashboard") return "Executive Command Center";
  if (location.pathname === "/intake") return "Registration & Clinical Intake";
  if (location.pathname === "/recommendation") return "Specialist Recommendation Engine";
  if (location.pathname.startsWith("/patients/")) return "Master Health Record";
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

 return (
 <header className="sticky top-0 z-20 border-b border-teal-100 bg-teal-50/90 backdrop-blur-md ">
 <div className="flex min-h-[64px] items-center justify-between px-4 sm:px-6 lg:px-8">
 <div className="flex items-center gap-3">
 <button
 aria-label="Open sidebar"
 className="flex h-11 w-11 items-center justify-center rounded-none text-teal-700 hover:bg-teal-100 :bg-teal-900 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-cyan-600 lg:hidden cursor-pointer transition-colors"
 onClick={() => setSidebarOpen(true)}
 >
 <Menu className="h-6 w-6" />
 </button>

 <div className="flex items-center gap-2 text-sm font-semibold text-teal-600 ">
 <span className="hidden sm:inline">Main City Hospital</span>
 <span className="hidden text-teal-300 sm:inline">/</span>
 <span className="font-bold text-teal-900 ">
 {getPageBreadcrumb()}
 </span>
 </div>
 </div>

 <div className="flex items-center gap-3">
 {/* Audit Log Quick Trigger */}
 <button
 onClick={openAuditDrawer}
 className="hidden items-center gap-2 rounded-none border border-teal-200 bg-white px-4 py-2 text-sm font-bold text-teal-800 shadow-xs hover:bg-teal-50 hover:border-teal-300 :bg-teal-800 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-cyan-600 transition-colors sm:flex cursor-pointer"
 >
 <History className="h-4 w-4 text-green-600 " />
 <span>Audit Log</span>
 </button>

 {/* Quick Case Switcher Dropdown */}
 <div className="hidden items-center gap-2 lg:flex">
 <select
 onChange={e => {
 if (e.target.value) {
 window.location.href = `/patients/${e.target.value}`;
 }
 }}
 defaultValue=""
 className="h-11 rounded-none border border-teal-200 bg-white px-4 text-sm font-bold text-teal-800 focus:outline-hidden focus:ring-4 focus:ring-cyan-600/50 cursor-pointer"
 aria-label="Select active patient case"
 >
 <option value="" disabled>
 Select Active Patient...
 </option>
 {cases.map(c => (
 <option key={c.patientId} value={c.patientId}>
 {c.patientName} ({c.patientId}) - Stage {c.currentStage}
 </option>
 ))}
 </select>
 </div>

 {/* Notifications Button */}
 <Link
 to="/alerts"
 aria-label="Alerts Queue"
 className="relative flex h-11 w-11 items-center justify-center rounded-none border border-teal-200 bg-white text-teal-700 shadow-xs hover:bg-teal-50 :bg-teal-800 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-cyan-600 transition-colors"
 >
 <Bell className="h-5 w-5" />
 {unacknowledgedAlerts.length > 0 && (
 <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-none bg-rose-600 text-[10px] font-bold text-white shadow-none border border-cyan-100 border-2 border-white ">
 {unacknowledgedAlerts.length}
 </span>
 )}
 </Link>

 {/* Dark Mode Toggle */}
 <button
 aria-label="Toggle dark mode"
 onClick={toggleDarkMode}
 className="flex h-11 w-11 items-center justify-center rounded-none border border-teal-200 bg-white text-teal-700 shadow-xs hover:bg-teal-50 :bg-teal-800 focus:outline-hidden focus-visible:ring-4 focus-visible:ring-cyan-600 cursor-pointer transition-colors"
 >
 {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-teal-800" />}
 </button>

 {/* User Profile Avatar with Dropdown */}
 <div className="relative border-l border-teal-200 pl-4 ml-1" ref={dropdownRef}>
  <button 
   onClick={() => setProfileOpen(!profileOpen)}
   className="flex items-center gap-3 focus:outline-none cursor-pointer p-1 hover:bg-teal-100/50 rounded transition-colors"
  >
   <div className="grid h-10 w-10 place-items-center rounded-none bg-cyan-600 font-display text-sm font-bold text-white shadow-none border border-cyan-100">
    {user?.name.substring(0, 2).toUpperCase() || "DA"}
   </div>
   <div className="hidden text-left sm:block">
    <div className="text-sm font-bold text-teal-900 ">{user?.name || "Guest"}</div>
    <div className="text-[11px] font-bold uppercase tracking-wider text-teal-600 ">
     {user?.role || "Observer"}
    </div>
   </div>
  </button>

  {/* Profile Dropdown */}
  {profileOpen && (
   <div className="absolute right-0 mt-2 w-56 bg-white border border-teal-100 shadow-lg rounded-none py-2 z-50 animate-in slide-in-from-top-2">
    <div className="px-4 py-2 border-b border-teal-50 mb-1">
     <p className="text-xs font-bold text-teal-500 uppercase tracking-wider">Signed in as</p>
     <p className="text-sm font-semibold text-teal-900 truncate">{user?.name}</p>
    </div>
    
    <button className="w-full text-left px-4 py-2.5 text-sm text-teal-800 hover:bg-teal-50 flex items-center gap-3 transition-colors cursor-pointer">
     <UserIcon className="h-4 w-4 text-teal-500" /> My Profile
    </button>
    <button className="w-full text-left px-4 py-2.5 text-sm text-teal-800 hover:bg-teal-50 flex items-center gap-3 transition-colors cursor-pointer">
     <Settings className="h-4 w-4 text-teal-500" /> Account Settings
    </button>
    <button className="w-full text-left px-4 py-2.5 text-sm text-teal-800 hover:bg-teal-50 flex items-center gap-3 transition-colors cursor-pointer">
     <Sliders className="h-4 w-4 text-teal-500" /> Clinical Preferences
    </button>
    
    <div className="my-1 border-t border-teal-50"></div>
    
    <button 
     onClick={handleLogout}
     className="w-full text-left px-4 py-2.5 text-sm text-rose-600 font-bold hover:bg-rose-50 flex items-center gap-3 transition-colors cursor-pointer"
    >
     <LogOut className="h-4 w-4 text-rose-500" /> Secure Logout
    </button>
   </div>
  )}
 </div>
 </div>
 </div>

 {/* Compliance Sub-banner */}
 <div className="border-t border-teal-100/50 bg-teal-50/50 px-4 py-2 text-xs font-semibold text-teal-700 sm:px-6 lg:px-8">
 <div className="flex flex-wrap items-center justify-between gap-2">
 <div className="flex items-center gap-2">
 <span className="h-2.5 w-2.5 rounded-none bg-green-500 animate-pulse" />
 <span className="font-bold text-teal-900 ">Live Workspace:</span>
 <span>Intelligent Specialist Matching & Continuity Engine</span>
 </div>
 <div className="flex items-center gap-4">
 <span className="flex items-center gap-1.5 text-green-700 font-bold">
 <ShieldCheck className="h-4 w-4" /> HIPAA / DPDP 2023 Compliant
 </span>
 <span className="hidden md:inline text-teal-300 ">|</span>
 <span className="hidden md:inline font-mono font-bold tracking-tight">10-Stage Care Pipeline Enabled</span>
 </div>
 </div>
 </div>
 </header>
 );
};
