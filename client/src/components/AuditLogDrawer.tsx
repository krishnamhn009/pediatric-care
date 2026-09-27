import React, { useState } from "react";
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  Lock,
} from "lucide-react";
import { usePediatric, AuditLogEntry } from "../context/PediatricContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface AuditLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { auditLog } = usePediatric();
  const [filterAction, setFilterAction] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredLogs = auditLog.filter(log => {
    const matchesAction =
      filterAction === "ALL" || log.actionType === filterAction;
    const matchesSearch =
      searchQuery === "" ||
      log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.patientName &&
        log.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.caseId &&
        log.caseId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.details &&
        log.details.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesAction && matchesSearch;
  });

  const getActionBadge = (actionType: AuditLogEntry["actionType"]) => {
    switch (actionType) {
      case "SPECIALIST_OVERRIDDEN":
        return (
          <Badge
            variant="secondary"
            className="bg-muted text-primary hover:bg-muted border-border gap-1"
          >
            <AlertTriangle className="h-3 w-3" /> Clinician Override
          </Badge>
        );
      case "SPECIALIST_ACCEPTED":
        return (
          <Badge
            variant="secondary"
            className="bg-muted text-primary hover:bg-muted border-border gap-1"
          >
            <CheckCircle2 className="h-3 w-3" /> Specialist Accepted
          </Badge>
        );
      case "CASE_CLOSED":
        return (
          <Badge
            variant="secondary"
            className="bg-muted text-primary hover:bg-muted border-border gap-1"
          >
            <Lock className="h-3 w-3" /> Case Closed
          </Badge>
        );
      case "INTAKE_REGISTERED":
        return (
          <Badge
            variant="secondary"
            className="bg-muted text-primary hover:bg-muted border-border gap-1"
          >
            <UserCheck className="h-3 w-3" /> Intake Registered
          </Badge>
        );
      case "ALERT_ACKNOWLEDGED":
        return (
          <Badge
            variant="secondary"
            className="bg-muted text-foreground hover:bg-muted border-border gap-1"
          >
            <CheckCircle2 className="h-3 w-3" /> Alert Acknowledged
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <FileText className="h-3 w-3" /> {actionType.replace("_", " ")}
          </Badge>
        );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={open => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col h-full bg-background border-l"
      >
        <SheetHeader className="border-b px-6 py-4 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">
              <History className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> Governance Audit Trail
              </div>
              <SheetTitle className="text-xl">
                Platform Action Audit Log
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="border-b bg-muted/10 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search audit trail by patient, case, user..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filterAction}
                onValueChange={val => setFilterAction(val || "")}
              >
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Filter Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">
                    All Actions ({auditLog.length})
                  </SelectItem>
                  <SelectItem value="SPECIALIST_OVERRIDDEN">
                    Overrides Only
                  </SelectItem>
                  <SelectItem value="SPECIALIST_ACCEPTED">
                    Acceptances Only
                  </SelectItem>
                  <SelectItem value="CASE_CLOSED">Case Closures</SelectItem>
                  <SelectItem value="ALERT_ACKNOWLEDGED">
                    Alert Acknowledgements
                  </SelectItem>
                  <SelectItem value="INTAKE_REGISTERED">Intakes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/5">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <History className="mx-auto h-10 w-10 opacity-30" />
              <p className="mt-3 text-sm font-semibold">
                No audit entries found
              </p>
              <p className="text-xs opacity-70">Try clearing search filters.</p>
            </div>
          ) : (
            filteredLogs.map(entry => (
              <div
                key={entry.id}
                className="rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    {getActionBadge(entry.actionType)}
                    <h3 className="mt-2 text-sm font-semibold">
                      {entry.summary}
                    </h3>
                  </div>
                  <time className="text-[10px] font-mono text-muted-foreground shrink-0">
                    {new Date(entry.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </time>
                </div>

                {entry.details && (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground bg-muted/50 p-3 rounded-md border">
                    {entry.details}
                  </p>
                )}

                {entry.overrideReason && (
                  <div className="mt-2 rounded-md border border-border bg-muted p-3 text-xs text-primary">
                    <strong className="block font-bold">
                      Documented Override Reason:
                    </strong>
                    <p className="mt-0.5">{entry.overrideReason}</p>
                  </div>
                )}

                {entry.exceptionReason && (
                  <div className="mt-2 rounded-md border border-border bg-muted p-3 text-xs text-primary">
                    <strong className="block font-bold">
                      Documented Clinical Exception:
                    </strong>
                    <p className="mt-0.5">{entry.exceptionReason}</p>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center justify-between border-t pt-3 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {entry.user}
                    </span>
                    <span>({entry.userRole})</span>
                  </div>
                  {entry.caseId && (
                    <div className="font-mono">
                      Case:{" "}
                      <span className="font-semibold text-primary">
                        {entry.caseId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t bg-muted/30 p-4 text-center text-xs font-medium text-muted-foreground">
          Immutable Audit Log Trace · Timestamped ISO 8601 Compliance Standard
        </div>
      </SheetContent>
    </Sheet>
  );
};
