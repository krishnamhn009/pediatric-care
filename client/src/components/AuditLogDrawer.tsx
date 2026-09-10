import React, { useState } from "react";
import {
 X,
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

interface AuditLogDrawerProps {
 isOpen: boolean;
 onClose: () => void;
}

export const AuditLogDrawer: React.FC<AuditLogDrawerProps> = ({ isOpen, onClose }) => {
 const { auditLog } = usePediatric();
 const [filterAction, setFilterAction] = useState<string>("ALL");
 const [searchQuery, setSearchQuery] = useState<string>("");

 if (!isOpen) return null;

 const filteredLogs = auditLog.filter(log => {
 const matchesAction = filterAction === "ALL" || log.actionType === filterAction;
 const matchesSearch =
 searchQuery === "" ||
 log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
 log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
 (log.patientName && log.patientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
 (log.caseId && log.caseId.toLowerCase().includes(searchQuery.toLowerCase())) ||
 (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
 return matchesAction && matchesSearch;
 });

 const getActionBadge = (actionType: AuditLogEntry["actionType"]) => {
 switch (actionType) {
 case "SPECIALIST_OVERRIDDEN":
 return (
 <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300 ">
 <AlertTriangle className="h-3 w-3" /> Clinician Override
 </span>
 );
 case "SPECIALIST_ACCEPTED":
 return (
 <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300 ">
 <CheckCircle2 className="h-3 w-3" /> Specialist Accepted
 </span>
 );
 case "CASE_CLOSED":
 return (
 <span className="inline-flex items-center gap-1 rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-800 border border-purple-300 ">
 <Lock className="h-3 w-3" /> Case Closed
 </span>
 );
 case "INTAKE_REGISTERED":
 return (
 <span className="inline-flex items-center gap-1 rounded-md bg-cyan-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 border border-blue-300 ">
 <UserCheck className="h-3 w-3" /> Intake Registered
 </span>
 );
 case "ALERT_ACKNOWLEDGED":
 return (
 <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-[#164E63]/90 border border-cyan-200 ">
 <CheckCircle2 className="h-3 w-3" /> Alert Acknowledged
 </span>
 );
 default:
 return (
 <span className="inline-flex items-center gap-1 rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800 border border-sky-300 ">
 <FileText className="h-3 w-3" /> {actionType.replace("_", " ")}
 </span>
 );
 }
 };

 return (
 <div
 className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs"
 role="dialog"
 aria-modal="true"
 aria-labelledby="audit-log-title"
 >
 <div className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl ">
 {/* Header */}
 <header className="flex items-center justify-between border-b border-cyan-100 px-6 py-4 ">
 <div className="flex items-center gap-3">
 <div className="grid h-10 w-10 place-items-center rounded-none bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
 <History className="h-5 w-5" />
 </div>
 <div>
 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-600 ">
 <ShieldCheck className="h-3.5 w-3.5" /> Governance Audit Trail
 </div>
 <h2 id="audit-log-title" className="font-display text-lg font-bold text-[#164E63] ">
 Platform Action Audit Log
 </h2>
 </div>
 </div>
 <button
 onClick={onClose}
 className="rounded-none p-2 text-[#164E63]/40 hover:bg-slate-100 :bg-slate-800"
 aria-label="Close audit log"
 >
 <X className="h-5 w-5" />
 </button>
 </header>

 {/* Filter Bar */}
 <div className="border-b border-cyan-100 bg-[#ECFEFF] p-4 ">
 <div className="flex flex-col gap-3 sm:flex-row">
 <div className="relative flex-1">
 <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#164E63]/40" />
 <input
 type="text"
 placeholder="Search audit trail by patient, case, user..."
 value={searchQuery}
 onChange={e => setSearchQuery(e.target.value)}
 className="w-full rounded-none border border-cyan-200 bg-white pl-9 pr-3 py-2 text-xs text-[#164E63] placeholder:text-[#164E63]/40 focus:border-emerald-500 focus:outline-none "
 />
 </div>
 <div className="flex items-center gap-2">
 <Filter className="h-4 w-4 text-[#164E63]/40" />
 <select
 value={filterAction}
 onChange={e => setFilterAction(e.target.value)}
 className="rounded-none border border-cyan-200 bg-white px-3 py-2 text-xs font-semibold text-[#164E63]/90 focus:border-emerald-500 focus:outline-none "
 >
 <option value="ALL">All Actions ({auditLog.length})</option>
 <option value="SPECIALIST_OVERRIDDEN">Overrides Only</option>
 <option value="SPECIALIST_ACCEPTED">Acceptances Only</option>
 <option value="CASE_CLOSED">Case Closures</option>
 <option value="ALERT_ACKNOWLEDGED">Alert Acknowledgements</option>
 <option value="INTAKE_REGISTERED">Intakes</option>
 </select>
 </div>
 </div>
 </div>

 {/* Audit Log Entries List */}
 <div className="flex-1 overflow-y-auto p-6 space-y-4">
 {filteredLogs.length === 0 ? (
 <div className="py-12 text-center text-[#164E63]/40">
 <History className="mx-auto h-10 w-10 text-slate-300 -[#164E63]" />
 <p className="mt-3 text-sm font-semibold">No audit entries found</p>
 <p className="text-xs text-[#164E63]/60">Try clearing search filters.</p>
 </div>
 ) : (
 filteredLogs.map(entry => (
 <div
 key={entry.id}
 className="rounded-none border border-cyan-100 bg-white p-4 shadow-none "
 >
 <div className="flex items-start justify-between gap-3">
 <div>
 {getActionBadge(entry.actionType)}
 <h3 className="mt-2 text-sm font-bold text-[#164E63] ">
 {entry.summary}
 </h3>
 </div>
 <time className="text-[10px] font-mono text-[#164E63]/40 shrink-0">
 {new Date(entry.timestamp).toLocaleTimeString([], {
 hour: "2-digit",
 minute: "2-digit",
 second: "2-digit",
 })}
 </time>
 </div>

 {entry.details && (
 <p className="mt-2 text-xs leading-relaxed text-[#164E63]/70 bg-[#ECFEFF] p-2.5 rounded-none border border-cyan-50 ">
 {entry.details}
 </p>
 )}

 {/* Show Override Reason if present */}
 {entry.overrideReason && (
 <div className="mt-2 rounded-none border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 ">
 <strong className="block font-bold">Documented Override Reason:</strong>
 <p className="mt-0.5">{entry.overrideReason}</p>
 </div>
 )}

 {/* Show Exception Reason if present */}
 {entry.exceptionReason && (
 <div className="mt-2 rounded-none border border-purple-200 bg-purple-50 p-3 text-xs text-purple-900 ">
 <strong className="block font-bold">Documented Clinical Exception:</strong>
 <p className="mt-0.5">{entry.exceptionReason}</p>
 </div>
 )}

 <div className="mt-3 flex flex-wrap items-center justify-between border-t border-cyan-50 pt-2.5 text-[10px] text-[#164E63]/60 ">
 <div className="flex items-center gap-2">
 <span className="font-bold text-[#164E63] ">{entry.user}</span>
 <span>({entry.userRole})</span>
 </div>
 {entry.caseId && (
 <div className="font-mono text-[#164E63]/40">
 Case: <span className="font-semibold text-[#0891B2] -[#0891B2]">{entry.caseId}</span>
 </div>
 )}
 </div>
 </div>
 ))
 )}
 </div>

 {/* Footer */}
 <footer className="border-t border-cyan-100 bg-[#ECFEFF] p-4 text-center text-xs font-semibold text-[#164E63]/60 ">
 Immutable Audit Log Trace · Timestamped ISO 8601 Compliance Standard
 </footer>
 </div>
 </div>
 );
};
