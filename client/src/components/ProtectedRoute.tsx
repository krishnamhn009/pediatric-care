import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth, Role } from "../context/AuthContext";
import { usePediatric } from "../context/PediatricContext";
import { AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const { user, isBreakGlassActive, activateBreakGlass } = useAuth();
  const { addAuditEntry } = usePediatric();
  const [showBreakGlassModal, setShowBreakGlassModal] = useState(false);
  const [reason, setReason] = useState("");

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const hasAccess =
    allowedRoles.includes(user.role) ||
    isBreakGlassActive ||
    user.role === "Admin";

  if (!hasAccess) {
    if (showBreakGlassModal) {
      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-card border border-white/10 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                Emergency Break-Glass
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              You are attempting to access a clinical module outside your
              standard role permissions. This action will be logged and
              immediately audited by Clinical Governance.
            </p>
            <div className="space-y-4">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide">
                Mandatory Clinical Reason
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Document immediate risk to life or limb..."
                className="w-full min-h-[100px] border border-border p-3 text-sm focus:border-border focus:ring-1 focus:ring-rose-500 outline-none"
              />
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowBreakGlassModal(false)}
                  className="px-4 py-2 bg-muted hover:bg-secondary text-muted-foreground text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  disabled={!reason.trim()}
                  onClick={() => {
                    activateBreakGlass(reason);
                    addAuditEntry({
                      user: user.name,
                      userRole: user.role,
                      actionType: "STAGE_ADVANCED", // Reusing this for audit simulation
                      summary: "Emergency Break-Glass Protocol Activated",
                      details: `Reason: ${reason}`,
                      overrideReason: reason,
                    });
                    setShowBreakGlassModal(false);
                  }}
                  className="px-6 py-2 bg-primary hover:bg-primary text-white text-sm font-bold disabled:opacity-50"
                >
                  Confirm Access Override
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-card border border-white/10 p-8 max-w-md w-full rounded-2xl shadow-xl text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Access Restricted
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Your current role ({user.role}) does not have permission to view
            this module.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowBreakGlassModal(true)}
              className="w-full bg-muted text-primary border border-border px-4 py-3 text-sm font-bold hover:bg-muted transition-colors"
            >
              Initiate Break-Glass Protocol
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-muted text-muted-foreground border border-transparent px-4 py-3 text-sm font-bold hover:bg-secondary transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
