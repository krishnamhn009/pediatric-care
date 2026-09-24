import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  FlaskConical,
  Scan,
  CreditCard,
  Settings2,
  CalendarDays,
  Stethoscope,
  ShieldAlert,
} from "lucide-react";
import { usePediatric, AppNotification } from "../context/PediatricContext";
import { Badge } from "@/components/ui/badge";

const typeIcon: Record<AppNotification["type"], React.ReactNode> = {
  alert: <ShieldAlert className="w-3.5 h-3.5" />,
  lab: <FlaskConical className="w-3.5 h-3.5" />,
  imaging: <Scan className="w-3.5 h-3.5" />,
  payment: <CreditCard className="w-3.5 h-3.5" />,
  system: <Settings2 className="w-3.5 h-3.5" />,
  appointment: <CalendarDays className="w-3.5 h-3.5" />,
  consult: <Stethoscope className="w-3.5 h-3.5" />,
};

const priorityDot: Record<AppNotification["priority"], string> = {
  low: "bg-white/40",
  medium: "bg-white/70",
  high: "bg-white",
  critical: "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] animate-pulse",
};

export const NotificationCenter: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
  } = usePediatric();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");

  const filtered = useMemo(() => {
    if (filter === "unread") return notifications.filter(n => !n.read);
    if (filter === "critical")
      return notifications.filter(
        n => n.priority === "critical" || n.priority === "high"
      );
    return notifications;
  }, [notifications, filter]);

  const unread = notifications.filter(n => !n.read).length;

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex justify-end">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: 420, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 420, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="relative ml-auto h-full w-full max-w-[420px] bg-card border-l border-white/10 shadow-[-24px_0_64px_rgba(0,0,0,0.6)] flex flex-col"
      >
        {/* header */}
        <div className="shrink-0 border-b border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-xl bg-white text-black grid place-items-center shadow-md">
                <Bell className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-[15px] font-bold tracking-tight">
                  Notifications
                </h2>
                <p className="text-xs text-muted-foreground">
                  {unread} unread · {notifications.length} total
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 grid place-items-center rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-1 rounded-full bg-white/[0.06] p-1 border border-white/10">
            {(
              [
                ["all", "All"],
                ["unread", `Unread · ${unread}`],
                ["critical", "Priority"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(k as any)}
                className={`h-8 rounded-full text-xs font-semibold transition-all cursor-pointer ${filter === k ? "bg-white text-black shadow-md" : "text-muted-foreground hover:text-foreground"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="flex-1 h-8 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 text-xs font-medium inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Solaris · Realtime
            </span>
          </div>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence initial={false}>
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-10 text-center"
              >
                <div className="mx-auto h-12 w-12 rounded-xl border border-white/10 bg-white/[0.04] grid place-items-center">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-medium">No notifications</p>
                <p className="text-xs text-muted-foreground">
                  All caught up — Solaris is quiet.
                </p>
              </motion.div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {filtered.map(n => (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className={`group relative p-4 hover:bg-white/[0.04] transition-colors ${!n.read ? "bg-white/[0.02]" : ""}`}
                  >
                    {!n.read && (
                      <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-white/60" />
                    )}
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1 h-7 w-7 rounded-lg border border-white/10 bg-white/[0.06] grid place-items-center shrink-0 ${!n.read ? "bg-white text-black border-white" : ""}`}
                      >
                        {typeIcon[n.type]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold leading-tight pr-2">
                            {n.title}
                          </h4>
                          <span
                            className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${priorityDot[n.priority]}`}
                          />
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                          {n.message}
                        </p>
                        <div className="mt-2 flex items-center flex-wrap gap-1.5">
                          {n.patientName && (
                            <Badge
                              variant="outline"
                              size="sm"
                              className="rounded-full border-white/10 bg-white/[0.04] text-[11px]"
                            >
                              {n.patientName}
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                          >
                            {n.type}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(n.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            · {new Date(n.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        {(n.actionLabel || !n.read) && (
                          <div className="mt-3 flex items-center gap-2">
                            {!n.read && (
                              <button
                                onClick={() => markNotificationRead(n.id)}
                                className="h-7 rounded-full bg-white text-black px-3 text-xs font-semibold hover:bg-white/90 transition-colors cursor-pointer"
                              >
                                Mark read
                              </button>
                            )}
                            {n.actionTo && (
                              <button
                                onClick={() => {
                                  if (!n.read) markNotificationRead(n.id);
                                  onClose();
                                  if (n.actionTo) navigate(n.actionTo);
                                }}
                                className="h-7 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 px-3 text-xs font-medium cursor-pointer"
                              >
                                {n.actionLabel || "Open"}
                              </button>
                            )}
                            <button
                              onClick={() => clearNotification(n.id)}
                              className="ml-auto h-7 w-7 grid place-items-center rounded-full hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="shrink-0 border-t border-white/10 bg-white/[0.02] p-3 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Solaris notification center
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
