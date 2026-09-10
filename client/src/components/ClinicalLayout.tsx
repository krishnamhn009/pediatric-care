import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AuditLogDrawer } from "./AuditLogDrawer";

export const ClinicalLayout: React.FC = () => {
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [auditDrawerOpen, setAuditDrawerOpen] = useState(false);

 return (
 <div className="min-h-screen bg-slate-100 text-[#164E63] flex">
 {/* Persistent Sidebar */}
 <Sidebar
 sidebarOpen={sidebarOpen}
 setSidebarOpen={setSidebarOpen}
 openAuditDrawer={() => setAuditDrawerOpen(true)}
 />

 {/* Main Workspace Content Area */}
 <div className="flex-1 min-w-0 flex flex-col">
 <Topbar
 setSidebarOpen={setSidebarOpen}
 openAuditDrawer={() => setAuditDrawerOpen(true)}
 />

 <main className="flex-1 overflow-y-auto">
 <Outlet />
 </main>
 </div>

 {/* Global Audit Log Drawer */}
 <AuditLogDrawer
 isOpen={auditDrawerOpen}
 onClose={() => setAuditDrawerOpen(false)}
 />
 </div>
 );
};
