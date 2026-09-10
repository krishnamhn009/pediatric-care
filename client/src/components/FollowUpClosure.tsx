import { useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardCheck, X } from "lucide-react";
import { useAuditLog } from "./ClinicalGovernance";

const pendingFollowUps = [
 { task: "Cardiology reassessment", owner: "Dr. Nimal", due: "Today · 14:00", ageing: "Due in 2h", overdue: false },
 { task: "Guardian follow-up call", owner: "Care coordinator", due: "Yesterday · 16:00", ageing: "Overdue · 18h", overdue: true },
 { task: "Discharge medication review", owner: "Dr. Anitha", due: "Tomorrow · 09:00", ageing: "Due tomorrow", overdue: false },
];

export default function FollowUpClosure({ patientId }: { patientId: string }) {
 const { addAuditEntry } = useAuditLog();
 const [documentedException, setDocumentedException] = useState(false);
 const [confirming, setConfirming] = useState(false);
 const [specialistSignOff, setSpecialistSignOff] = useState(false);
 const [clinicalResolution, setClinicalResolution] = useState(false);
 const [closed, setClosed] = useState(false);
 const hasMandatoryCheckpoint = pendingFollowUps.some(item => item.overdue);
 const canStartClosure = !hasMandatoryCheckpoint || documentedException;

 const closeCase = () => {
 addAuditEntry({
 itemId: 0,
 itemTitle: `Case closure · ${patientId}`,
 decision: "acknowledged",
 detail: `Specialist sign-off and clinical resolution confirmed${documentedException ? "; documented exception recorded" : ""}.`,
 });
 setClosed(true);
 setConfirming(false);
 };

 return <>
 <section className="rounded-none border border-cyan-100/80 bg-white p-5 shadow-[0_8px_24px_rgba(30,48,75,0.04)] /[0.045]">
 <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
 <div>
 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0891B2] "><ClipboardCheck className="h-4 w-4" /> Follow-up & case closure</div>
 <h3 className="mt-2 font-display text-lg font-bold">Pending follow-up work queue</h3>
 <p className="mt-1 text-[12px] text-[#164E63]/70 ">All mandatory checkpoints must be completed before closure.</p>
 </div>
 <button disabled={!canStartClosure || closed} onClick={() => setConfirming(true)} className="min-h-11 rounded-none bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-45">{closed ? "Case closed" : "Close case"}</button>
 </div>
 <div className="mt-5 overflow-x-auto rounded-none border border-cyan-100 ">
 <table className="w-full min-w-[570px] text-left text-[11px]">
 <thead className="bg-[#ECFEFF] text-[10px] uppercase tracking-wide text-[#164E63]/60 "><tr><th className="px-4 py-3 font-bold">Follow-up</th><th className="px-4 py-3 font-bold">Owner</th><th className="px-4 py-3 font-bold">Due date</th><th className="px-4 py-3 font-bold">Ageing</th></tr></thead>
 <tbody>{pendingFollowUps.map(item => <tr key={item.task} className="border-t border-cyan-50 "><td className="px-4 py-3 font-bold text-[#164E63]/90 ">{item.task}</td><td className="px-4 py-3 text-[#164E63]/70 ">{item.owner}</td><td className="px-4 py-3 text-[#164E63]/70 ">{item.due}</td><td className={item.overdue ? "px-4 py-3 font-bold text-rose-700 " : "px-4 py-3 font-semibold text-[#164E63]/60"}>{item.ageing}</td></tr>)}</tbody>
 </table>
 </div>
 {hasMandatoryCheckpoint && !closed && <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-none border border-amber-200 bg-amber-50 p-3 text-[12px] leading-5 text-amber-900 "><input checked={documentedException} onChange={event => setDocumentedException(event.target.checked)} type="checkbox" className="mt-0.5 h-4 w-4 accent-amber-600" /><span><strong className="block">Documented exception</strong>One mandatory follow-up is overdue. Confirm an approved, documented exception before you can begin case closure.</span></label>}
 </section>
 {confirming && <div role="presentation" onMouseDown={() => setConfirming(false)} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"><div role="dialog" aria-modal="true" aria-labelledby="case-closure-title" onMouseDown={event => event.stopPropagation()} className="w-full max-w-lg rounded-none bg-white p-6 shadow-2xl -[#111b2b]"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-700 "><AlertTriangle className="h-4 w-4" /> Strict confirmation required</div><h2 id="case-closure-title" className="mt-2 font-display text-xl font-extrabold">Confirm case closure</h2></div><button onClick={() => setConfirming(false)} aria-label="Cancel case closure" className="rounded-none p-2 text-[#164E63]/40 hover:bg-slate-100 :bg-white/10"><X className="h-5 w-5" /></button></div><p className="mt-4 text-sm leading-6 text-[#164E63]/70 ">Closing a case ends its active follow-up workflow. A specialist must explicitly sign off and confirm clinical resolution.</p><div className="mt-5 space-y-3"><label className="flex cursor-pointer items-start gap-3 rounded-none border border-cyan-100 p-3 text-sm font-semibold "><input checked={specialistSignOff} onChange={event => setSpecialistSignOff(event.target.checked)} type="checkbox" className="mt-0.5 h-4 w-4 accent-emerald-700" />I am the responsible specialist and provide explicit sign-off.</label><label className="flex cursor-pointer items-start gap-3 rounded-none border border-cyan-100 p-3 text-sm font-semibold "><input checked={clinicalResolution} onChange={event => setClinicalResolution(event.target.checked)} type="checkbox" className="mt-0.5 h-4 w-4 accent-emerald-700" />I confirm the clinical issue is resolved and follow-up is no longer required.</label></div><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button onClick={() => setConfirming(false)} className="min-h-11 rounded-none px-4 text-sm font-bold text-[#164E63]/70 hover:bg-slate-100 :bg-white/10">Cancel</button><button disabled={!specialistSignOff || !clinicalResolution} onClick={closeCase} className="min-h-11 rounded-none bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-45"><CheckCircle2 className="mr-1 inline h-4 w-4" /> Confirm & close case</button></div></div></div>}
 </>;
}
