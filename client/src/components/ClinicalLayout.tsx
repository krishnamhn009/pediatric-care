import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { AuditLogDrawer } from "./AuditLogDrawer";
import { AIHelperBot } from "./AIHelperBot";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export const ClinicalLayout: React.FC = () => {
  const [auditDrawerOpen, setAuditDrawerOpen] = useState(false);

  return (
    <SidebarProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-white text-black px-4 py-2 rounded-full text-sm font-medium"
      >
        Skip to content
      </a>
      <AppSidebar openAuditDrawer={() => setAuditDrawerOpen(true)} />
      <SidebarInset>
        <Topbar openAuditDrawer={() => setAuditDrawerOpen(true)} />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto bg-background p-4 md:p-6 relative focus:outline-none"
        >
          <div
            className="pointer-events-none absolute inset-0 solaris-grid opacity-[0.15] [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]"
            aria-hidden
          />
          <div className="relative">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
      <AIHelperBot />
      <AuditLogDrawer
        isOpen={auditDrawerOpen}
        onClose={() => setAuditDrawerOpen(false)}
      />
    </SidebarProvider>
  );
};
