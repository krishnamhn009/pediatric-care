import React, { useState } from "react";
import {
 Siren,
 AlertTriangle,
 CheckCircle2,
 Lock,
 X,
 ShieldCheck,
 Clock3,
 Filter,
 FileHeart,
 ChevronRight,
} from "lucide-react";
import { usePediatric, PatientCase } from "../context/PediatricContext";

export const AlertsClosurePage: React.FC = () => {
 const { cases, alerts, closeCase } = usePediatric();

 // Active closure target case modal state
 const [closingCase, setClosingCase] = useState<PatientCase | null>(null);
 const [specialistSignOff, setSpecialistSignOff] = useState(false);
 const [clinicalResolution, setClinicalResolution] = useState(false);
 const [useException, setUseException] = useState(false);
 const [exceptionReason, setExceptionReason] = useState("");
 const [closureError, setClosureError] = useState("");

 const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

 const openCases = cases.filter(c => c.currentStage < 10);

 const filteredAlerts = alerts.filter(a => {
 if (filterSeverity === "ALL") return true;
 return a.severity === filterSeverity;
 });

 const handleOpenClosureModal = (c: PatientCase) => {
 setClosingCase(c);
 setSpecialistSignOff(c.specialistSignOff || false);
 setClinicalResolution(false);
 setUseException(false);
 setExceptionReason("");
 setClosureError("");
 };

 const handleConfirmClosure = () => {
 if (!closingCase) return;

 if (!specialistSignOff && (!useException || !exceptionReason.trim())) {
 setClosureError("Strict Governance: You must record explicit Specialist Sign-off OR document a clinical exception reason.");
 return;
 }

 const result = closeCase(
 closingCase.id,
 specialistSignOff,
 useException ? exceptionReason.trim() : undefined,
 "Dr. Anitha Raman"
 );

 if (!result.success) {
 setClosureError(result.error || "Failed to close case.");
 return;
 }

 setClosingCase(null);
 };

 const pendingAlerts = closingCase ? alerts.filter(a => a.caseId === closingCase.id && !a.acknowledged) : [];
 const hasPendingAlerts = pendingAlerts.length > 0;
 const isOverrideReady = useException && exceptionReason.trim().length > 0;

 return (
 <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-600 ">
 <Siren className="h-4 w-4" /> Stage 9 & 10 Care Continuity
 </div>
 <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#164E63] mt-1">
 Clinical Escalation & Case Closure Queue
 </h1>
 <p className="text-sm text-[#164E63]/70 -[#164E63]/40 mt-1">
 Continuous evaluation of 5 clinical checkpoints. Strict case closure safeguards enforced.
 </p>
 </div>
 </div>

 {/* 5 Clinical Checkpoints Explanation Banner */}
 <div className="rounded-none border border-cyan-100 bg-white p-6 shadow-none border border-cyan-100 space-y-4">
 <h2 className="font-display text-base font-bold text-[#164E63] flex items-center gap-2">
 <ShieldCheck className="h-5 w-5 text-emerald-500" /> Active 5 Clinical Checkpoint Rules
 </h2>
 <div className="grid gap-3 grid-cols-1 sm:grid-cols-5 text-xs">
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-3 ">
 <strong className="block text-[#164E63] font-bold mb-1">1. Overdue Consult</strong>
 <span className="text-[#164E63]/60">&gt;48h without specialist progress note</span>
 </div>
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-3 ">
 <strong className="block text-[#164E63] font-bold mb-1">2. Delayed Treatment</strong>
 <span className="text-[#164E63]/60">&gt;24h post assignment without orders</span>
 </div>
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-3 ">
 <strong className="block text-[#164E63] font-bold mb-1">3. Abnormal Vitals</strong>
 <span className="text-[#164E63]/60">Out-of-range vitals without review</span>
 </div>
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-3 ">
 <strong className="block text-[#164E63] font-bold mb-1">4. Discharge Checkpoint</strong>
 <span className="text-[#164E63]/60">Missing final discharge sign-off</span>
 </div>
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-3 ">
 <strong className="block text-[#164E63] font-bold mb-1">5. 7-Day Continuity</strong>
 <span className="text-[#164E63]/60">Post-consultation monitoring check</span>
 </div>
 </div>
 </div>

 {/* Open Cases Closure Work Queue Table */}
 <section className="rounded-none border border-cyan-100 bg-white p-6 shadow-none border border-cyan-100 space-y-4">
 <div className="flex items-center justify-between border-b border-cyan-100 pb-4">
 <h2 className="font-display text-lg font-bold text-[#164E63] ">
 Active Open Cases & Closure Safeguards
 </h2>
 <span className="text-xs font-bold text-[#164E63]/60">
 {openCases.length} Active Open Cases
 </span>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead className="bg-[#ECFEFF] text-[10px] uppercase font-bold text-[#164E63]/40 ">
 <tr>
 <th className="p-3.5">Patient / Case ID</th>
 <th className="p-3.5">Condition & Ward</th>
 <th className="p-3.5">Assigned Specialist</th>
 <th className="p-3.5">Current Stage</th>
 <th className="p-3.5">Sign-off Status</th>
 <th className="p-3.5 text-right">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 ">
 {cases.map(c => {
 const isClosed = c.currentStage === 10;
 return (
 <tr key={c.id} className="hover:bg-[#ECFEFF]/50 :bg-slate-800/40">
 <td className="p-3.5">
 <div className="font-bold text-[#164E63] ">{c.patientName}</div>
 <div className="font-mono text-[10px] text-[#0891B2] -[#0891B2]">{c.id}</div>
 </td>
 <td className="p-3.5">
 <div className="font-semibold text-[#164E63]/90 ">{c.primaryCondition}</div>
 <div className="text-[10px] text-[#164E63]/40">{c.ward}</div>
 </td>
 <td className="p-3.5">
 {c.assignedSpecialistName ? (
 <span className="font-semibold text-[#164E63] ">{c.assignedSpecialistName}</span>
 ) : (
 <span className="text-rose-500 font-bold">Unassigned</span>
 )}
 </td>
 <td className="p-3.5 font-bold">
 <span className="rounded-none bg-cyan-50 px-2.5 py-1 text-[11px] text-[#0891B2] ">
 Stage {c.currentStage} / 10
 </span>
 </td>
 <td className="p-3.5">
 {isClosed ? (
 <span className="inline-flex items-center gap-1 font-bold text-emerald-600 ">
 <CheckCircle2 className="h-3.5 w-3.5" /> Closed
 </span>
 ) : c.specialistSignOff ? (
 <span className="text-emerald-600 font-semibold">Signed Off</span>
 ) : (
 <span className="text-amber-600 font-semibold">Pending Sign-off</span>
 )}
 </td>
 <td className="p-3.5 text-right">
 {isClosed ? (
 <span className="text-[11px] font-bold text-[#164E63]/40">Closed</span>
 ) : (
 <button
 onClick={() => handleOpenClosureModal(c)}
 className="inline-flex items-center gap-1 rounded-none bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-none border border-cyan-100 hover:bg-emerald-500"
 >
 <Lock className="h-3.5 w-3.5" /> Close Case
 </button>
 )}
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </section>

 {/* Case Closure Mandatory Confirmation Modal */}
 {closingCase && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
 <div className="w-full max-w-lg rounded-none border border-cyan-100 bg-white p-6 shadow-2xl ">
 <div className="flex items-center justify-between border-b border-cyan-100 pb-3">
 <h3 className="font-display text-lg font-bold text-[#164E63] flex items-center gap-2">
 <AlertTriangle className="h-5 w-5 text-rose-500" /> Mandatory Clinical Case Closure Check
 </h3>
 <button
 onClick={() => setClosingCase(null)}
 className="rounded-none p-1 text-[#164E63]/40 hover:bg-slate-100 :bg-slate-800"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 <p className="text-xs text-[#164E63]/60 -[#164E63]/40 mt-3">
 Closing case <strong>#{closingCase.id}</strong> for <strong>{closingCase.patientName}</strong> removes it from active monitoring queue. The platform requires explicit specialist sign-off or a documented exception.
 </p>

 {hasPendingAlerts && (
 <div className="mt-3 rounded-none border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
 <div className="font-bold flex items-center gap-2 mb-1">
 <AlertTriangle className="h-4 w-4" />
 Warning: Mandatory Checkpoints Incomplete
 </div>
 <div>There are {pendingAlerts.length} unacknowledged alerts for this case. Case closure is blocked.</div>
 </div>
 )}

 {closureError && (
 <div className="mt-3 rounded-none border border-rose-300 bg-rose-50 p-3 text-xs text-rose-900 ">
 <strong>Safeguard Error:</strong> {closureError}
 </div>
 )}

 <div className="mt-4 space-y-3">
 <label className="flex items-start gap-3 rounded-none border border-cyan-100 p-3.5 text-xs font-semibold cursor-pointer hover:border-emerald-500">
 <input
 type="checkbox"
 checked={specialistSignOff}
 onChange={e => setSpecialistSignOff(e.target.checked)}
 className="mt-0.5 h-4 w-4 rounded accent-emerald-600"
 />
 <div>
 <span className="font-bold text-[#164E63] block">
 Specialist Explicit Sign-off Recorded
 </span>
 <span className="text-[11px] text-[#164E63]/60">
 I confirm that the assigned specialist ({closingCase.assignedSpecialistName || "Attending"}) has performed final evaluation and signed off.
 </span>
 </div>
 </label>

 <label className="flex items-start gap-3 rounded-none border border-cyan-100 p-3.5 text-xs font-semibold cursor-pointer hover:border-emerald-500">
 <input
 type="checkbox"
 checked={clinicalResolution}
 onChange={e => setClinicalResolution(e.target.checked)}
 className="mt-0.5 h-4 w-4 rounded accent-emerald-600"
 />
 <div>
 <span className="font-bold text-[#164E63] block">
 Clinical Issue Resolved
 </span>
 <span className="text-[11px] text-[#164E63]/60">
 Patient condition is stabilized and continuity checkpoints are met.
 </span>
 </div>
 </label>

 <label className="flex items-start gap-3 rounded-none border border-cyan-100 p-3.5 text-xs font-semibold cursor-pointer hover:border-amber-500">
 <input
 type="checkbox"
 checked={useException}
 onChange={e => setUseException(e.target.checked)}
 className="mt-0.5 h-4 w-4 rounded accent-amber-600"
 />
 <div>
 <span className="font-bold text-[#164E63] block">
 Close under authorised clinical exception
 </span>
 <span className="text-[11px] text-[#164E63]/60">
 If closing with incomplete mandatory checkpoints, provide a clinical rationale.
 </span>
 </div>
 </label>

 {useException && (
 <div className="pl-7">
 <textarea
 required
 value={exceptionReason}
 onChange={e => setExceptionReason(e.target.value)}
 placeholder="Document the exact clinical exception reason..."
 className="w-full min-h-[70px] rounded-none border border-cyan-200 bg-white p-3 text-xs text-[#164E63] focus:border-amber-500 focus:outline-none "
 />
 </div>
 )}
 </div>

 <div className="mt-6 flex justify-end gap-3">
 <button
 onClick={() => setClosingCase(null)}
 className="rounded-none px-4 py-2.5 text-xs font-bold text-[#164E63]/70 hover:bg-slate-100 :bg-slate-800"
 >
 Cancel
 </button>
 {hasPendingAlerts ? (
 <button
 disabled={!isOverrideReady}
 onClick={handleConfirmClosure}
 className="rounded-none bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
 >
 Override & Close
 </button>
 ) : (
 <button
 onClick={handleConfirmClosure}
 className="rounded-none bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500"
 >
 Confirm Case Closure & Log Audit
 </button>
 )}
 </div>
 </div>
 </div>
 )}
 </div>
 );
};
