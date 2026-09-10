import { createContext, useContext, useState, type ReactNode } from "react";
import { Check, ShieldCheck, X } from "lucide-react";

export type GovernanceItem = {
 id: number;
 kind: "recommendation" | "alert";
 title: string;
 detail: string;
};

export type AuditEntry = {
 id: string;
 at: string;
 itemId: number;
 itemTitle: string;
 decision: "accepted" | "overridden" | "acknowledged";
 detail: string;
};

type AuditContextValue = {
 auditLog: AuditEntry[];
 addAuditEntry: (entry: Omit<AuditEntry, "id" | "at">) => void;
};

const AuditContext = createContext<AuditContextValue | null>(null);

export function ClinicalGovernanceProvider({ children }: { children: ReactNode }) {
 const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
 const addAuditEntry = (entry: Omit<AuditEntry, "id" | "at">) =>
 setAuditLog(log => [
 ...log,
 { ...entry, id: crypto.randomUUID(), at: new Date().toISOString() },
 ]);

 return (
 <AuditContext.Provider value={{ auditLog, addAuditEntry }}>
 {children}
 </AuditContext.Provider>
 );
}

export function useAuditLog() {
 const context = useContext(AuditContext);
 if (!context) throw new Error("useAuditLog must be used within ClinicalGovernanceProvider");
 return context;
}

const specialists = ["Dr. Anitha · General Pediatrics", "Dr. Nimal · Pediatric Cardiology", "Dr. Sahan · Pediatric Neurology"];
const alertActions = ["Reviewed patient record", "Escalated to attending", "Updated care plan", "No immediate action required"];

export function ClinicalGovernancePanel({ item, onClose, onComplete }: { item: GovernanceItem | null; onClose: () => void; onComplete: () => void }) {
 const { addAuditEntry } = useAuditLog();
 const [overriding, setOverriding] = useState(false);
 const [specialist, setSpecialist] = useState("");
 const [reason, setReason] = useState("");
 const [alertAction, setAlertAction] = useState("");
 if (!item) return null;

 const finish = (decision: AuditEntry["decision"], detail: string) => {
 addAuditEntry({ itemId: item.id, itemTitle: item.title, decision, detail });
 onComplete();
 onClose();
 };
 const isRecommendation = item.kind === "recommendation";
 const validOverride = specialist && reason.trim();

 return (
 <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 p-0 sm:p-4" role="presentation" onMouseDown={onClose}>
 <aside aria-modal="true" aria-labelledby="governance-title" role="dialog" onMouseDown={event => event.stopPropagation()} className="flex h-full w-full max-w-[520px] flex-col bg-white shadow-2xl -[#111b2b] sm:rounded-none">
 <header className="flex items-start justify-between border-b border-cyan-100 p-5 ">
 <div>
 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 "><ShieldCheck className="h-4 w-4" /> Clinical governance</div>
 <h2 id="governance-title" className="mt-2 font-display text-xl font-extrabold text-[#164E63] ">{isRecommendation ? "Specialist recommendation" : "Clinical intelligence alert"}</h2>
 </div>
 <button aria-label="Close governance panel" onClick={onClose} className="rounded-none p-2 text-[#164E63]/40 hover:bg-slate-100 :bg-white/10"><X className="h-5 w-5" /></button>
 </header>
 <div className="flex-1 overflow-y-auto p-5">
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-4 ">
 <h3 className="text-sm font-bold text-[#164E63] ">{item.title}</h3>
 <p className="mt-2 text-sm leading-6 text-[#164E63]/70 ">{item.detail}</p>
 </div>
 {isRecommendation ? <>
 <p className="mt-5 rounded-none bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-900 ">Human decision required. This recommendation cannot assign a specialist automatically.</p>
 {overriding && <div className="mt-5 space-y-4">
 <label className="block text-xs font-bold text-[#164E63] ">Alternative specialist <select value={specialist} onChange={event => setSpecialist(event.target.value)} className="mt-2 min-h-11 w-full rounded-none border border-cyan-200 bg-white px-3 text-sm font-medium text-[#164E63]/90 "><option value="">Select specialist</option>{specialists.map(name => <option key={name}>{name}</option>)}</select></label>
 <label className="block text-xs font-bold text-[#164E63] ">Structured reason <textarea value={reason} onChange={event => setReason(event.target.value)} placeholder="Document the clinical or operational reason for this override." className="mt-2 min-h-28 w-full rounded-none border border-cyan-200 bg-white p-3 text-sm font-medium text-[#164E63]/90 placeholder:text-[#164E63]/40 " /></label>
 </div>}
 </> : <label className="mt-5 block text-xs font-bold text-[#164E63] ">Action taken <select value={alertAction} onChange={event => setAlertAction(event.target.value)} className="mt-2 min-h-11 w-full rounded-none border border-cyan-200 bg-white px-3 text-sm font-medium text-[#164E63]/90 "><option value="">Select action taken</option>{alertActions.map(action => <option key={action}>{action}</option>)}</select></label>}
 </div>
 <footer className="flex flex-col-reverse gap-3 border-t border-cyan-100 p-5 sm:flex-row sm:justify-end ">
 <button onClick={onClose} className="min-h-11 rounded-none px-4 text-sm font-bold text-[#164E63]/70 hover:bg-slate-100 :bg-white/10">Cancel</button>
 {isRecommendation ? (overriding ? <button disabled={!validOverride} onClick={() => finish("overridden", `Alternative: ${specialist}. Reason: ${reason.trim()}`)} className="min-h-11 rounded-none bg-amber-600 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45">Confirm override</button> : <><button onClick={() => setOverriding(true)} className="min-h-11 rounded-none border border-amber-300 px-4 text-sm font-bold text-amber-800 hover:bg-amber-50 :bg-amber-400/10">Override</button><button onClick={() => finish("accepted", "Recommendation accepted by clinician.")} className="min-h-11 rounded-none bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800"><Check className="mr-1 inline h-4 w-4" /> Accept</button></>) : <button disabled={!alertAction} onClick={() => finish("acknowledged", `Action taken: ${alertAction}`)} className="min-h-11 rounded-none bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-45"><Check className="mr-1 inline h-4 w-4" /> Acknowledge</button>}
 </footer>
 </aside>
 </div>
 );
}
