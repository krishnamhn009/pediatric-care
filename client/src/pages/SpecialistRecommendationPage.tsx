import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
 BrainCircuit,
 ShieldCheck,
 CheckCircle2,
 AlertTriangle,
 Users,
 Clock,
 Award,
 Stethoscope,
 ChevronRight,
 ArrowRight,
 Info,
 X,
 FileHeart,
} from "lucide-react";
import { usePediatric, Specialist, PatientCase } from "../context/PediatricContext";

export const SpecialistRecommendationPage: React.FC = () => {
 const [searchParams] = useSearchParams();
 const caseIdFromUrl = searchParams.get("caseId");

 const { cases, specialists, acceptSpecialist, overrideSpecialist } = usePediatric();

 // Selected case
 const [selectedCaseId, setSelectedCaseId] = useState<string>(
 caseIdFromUrl || cases[0]?.id || "CASE-2026-001"
 );

 // Override Modal State
 const [overrideModalOpen, setOverrideModalOpen] = useState(false);
 const [overrideTargetSpec, setOverrideTargetSpec] = useState<Specialist | null>(null);
 const [overrideReason, setOverrideReason] = useState("");
 const [overrideCategory, setOverrideCategory] = useState("Patient/Family Preference");

 const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

 // Calculate dynamic match scores for active case condition
 const rankedSpecialists = useMemo(() => {
 if (!activeCase) return specialists;

 return [...specialists].sort((a, b) => {
 // Prioritize condition match score
 let scoreA = a.matchScoreDefault;
 let scoreB = b.matchScoreDefault;

 // Adjust score if subspecialty aligns with primary condition
 if (
 activeCase.primaryCondition.toLowerCase().includes("cardiac") ||
 activeCase.primaryCondition.toLowerCase().includes("vsd")
 ) {
 if (a.specialty === "Cardiology") scoreA += 5;
 if (b.specialty === "Cardiology") scoreB += 5;
 } else if (
 activeCase.primaryCondition.toLowerCase().includes("seizure") ||
 activeCase.primaryCondition.toLowerCase().includes("epilep")
 ) {
 if (a.specialty === "Neurology") scoreA += 5;
 if (b.specialty === "Neurology") scoreB += 5;
 }

 return scoreB - scoreA;
 });
 }, [activeCase, specialists]);

 const handleAccept = (spec: Specialist) => {
 if (!activeCase) return;
 acceptSpecialist(activeCase.id, spec.id, "Dr. Anitha Raman");
 };

 const openOverrideModal = (spec: Specialist) => {
 setOverrideTargetSpec(spec);
 setOverrideReason("");
 setOverrideModalOpen(true);
 };

 const handleConfirmOverride = () => {
 if (!activeCase || !overrideTargetSpec || !overrideReason.trim()) return;

 const fullReason = `[${overrideCategory}] ${overrideReason.trim()}`;
 overrideSpecialist(activeCase.id, overrideTargetSpec.id, fullReason, "Dr. Prabhu");
 setOverrideModalOpen(false);
 };

 return (
 <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
 {/* Header */}
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0891B2] -[#0891B2]">
 <BrainCircuit className="h-4 w-4" /> Stage 5 & 6 Care Journey
 </div>
 <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#164E63] mt-1">
 Intelligent Specialist Recommendation Engine
 </h1>
 <p className="text-sm text-[#164E63]/70 -[#164E63]/40 mt-1">
 AI clinical match scoring across Cardiology, Neurology, and Surgery. Human decision is mandatory.
 </p>
 </div>

 {/* Case Selector Dropdown */}
 <div className="flex items-center gap-2">
 <label className="text-xs font-bold text-[#164E63] ">Selected Case:</label>
 <select
 value={selectedCaseId}
 onChange={e => setSelectedCaseId(e.target.value)}
 className="rounded-none border border-cyan-200 bg-white px-3.5 py-2 text-xs font-bold text-[#164E63] focus:border-blue-600 focus:outline-none "
 >
 {cases.map(c => (
 <option key={c.id} value={c.id}>
 {c.patientName} ({c.id}) - Urgency: {c.urgency}
 </option>
 ))}
 </select>
 </div>
 </div>

 {/* Human-in-the-Loop Guard Banner */}
 <div className="rounded-none border border-cyan-200 bg-cyan-50/80 p-4 flex items-start gap-3">
 <ShieldCheck className="h-5 w-5 text-[#0891B2] -[#0891B2] shrink-0 mt-0.5" />
 <div className="text-xs text-blue-900 leading-relaxed">
 <strong className="block font-bold">Strict Clinical Governance Policy:</strong>
 This recommendation engine generates ranked candidate specialists using clinical acuity, subspecialty alignment, and response SLA data. <span className="underline font-bold">The system never auto-assigns a specialist</span>. A clinician must explicitly click <strong>Accept</strong> or document a structured text reason when choosing an <strong>Override</strong>.
 </div>
 </div>

 {/* Active Case Context Summary Header */}
 {activeCase && (
 <div className="rounded-none border border-cyan-100 bg-white p-6 shadow-none border border-cyan-100 ">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-100 pb-4">
 <div>
 <span className="text-[10px] font-bold uppercase tracking-wider text-[#164E63]/40">
 Current Case Context
 </span>
 <h2 className="font-display text-xl font-bold text-[#164E63] mt-1">
 {activeCase.patientName} ({activeCase.patientId})
 </h2>
 <p className="text-xs text-[#164E63]/60 -[#164E63]/40 mt-0.5">
 Age: {activeCase.ageText} · Ward: {activeCase.ward} · Urgency:{" "}
 <span className="font-bold text-rose-600 ">{activeCase.urgency}</span>
 </p>
 </div>

 <div className="flex items-center gap-3">
 <span className="rounded-none bg-slate-100 px-3 py-1.5 text-xs font-bold text-[#164E63] ">
 Care Stage: {activeCase.currentStage} / 10
 </span>
 <Link
 to={`/patients/${activeCase.patientId}`}
 className="inline-flex items-center gap-1 text-xs font-bold text-[#0891B2] -[#0891B2] hover:underline"
 >
 <FileHeart className="h-4 w-4" /> Open Full Health Record
 </Link>
 </div>
 </div>

 <div className="mt-4 grid gap-4 sm:grid-cols-2 text-xs">
 <div>
 <strong className="text-[#164E63]/40 block font-bold">Primary Condition:</strong>
 <span className="text-[#164E63] font-semibold">{activeCase.primaryCondition}</span>
 </div>
 <div>
 <strong className="text-[#164E63]/40 block font-bold">Chief Complaint:</strong>
 <span className="text-[#164E63] font-semibold">{activeCase.chiefComplaint}</span>
 </div>
 </div>

  {activeCase.assignedSpecialistName && (
  <div className="mt-4 rounded-none border border-emerald-200 bg-emerald-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
  <div>
  <span className="flex items-center gap-2 font-bold text-sm text-emerald-900">
  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
  Current Assigned Specialist: {activeCase.assignedSpecialistName}
  </span>
  {activeCase.overrideReason && (
  <span className="text-xs font-semibold text-emerald-800 mt-1 block">
  (Assigned via Clinician Override)
  </span>
  )}
  </div>
  <Link
  to="/specialist-workspace"
  className="inline-flex items-center justify-center gap-2 bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all rounded-none whitespace-nowrap"
  >
  Proceed to Consultation <ArrowRight className="h-4 w-4" />
  </Link>
  </div>
  )}
 </div>
 )}

 {/* Ranked Specialists List */}
 <div className="space-y-4">
 <h3 className="font-display text-lg font-bold text-[#164E63] ">
 Ranked Specialist Recommendations
 </h3>

 {rankedSpecialists.map((spec, index) => {
 const isTopMatch = index === 0;
 const isCurrentlyAssigned = activeCase?.assignedSpecialistId === spec.id;

 return (
 <div
 key={spec.id}
 className={`rounded-none border p-6 transition-all shadow-none border border-cyan-100 ${
 isCurrentlyAssigned
 ? "border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/30 "
 : isTopMatch
 ? "border-blue-300 bg-gradient-to-r from-blue-50/50 to-white "
 : "border-cyan-100 bg-white "
 }`}
 >
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 {/* Left Profile Info */}
 <div className="flex items-start gap-4">
 <img
 src={spec.avatar}
 alt={spec.name}
 className="h-16 w-16 rounded-none object-cover ring-2 ring-slate-200 shrink-0"
 />
 <div>
 <div className="flex items-center gap-2">
 <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-[#164E63] ">
 #{index + 1} Recommendation
 </span>
 <span className="text-xs font-bold text-[#0891B2] -[#0891B2]">
 {spec.specialty}
 </span>
 </div>

 <h4 className="font-display text-lg font-bold text-[#164E63] mt-1">
 {spec.name}
 </h4>
 <p className="text-xs font-semibold text-[#164E63]/60 -[#164E63]/40">
 {spec.title} · {spec.subSpecialty}
 </p>
 <p className="text-[11px] text-[#164E63]/40 mt-0.5">
 {spec.hospitalAffiliation} · {spec.experienceYears} Years Experience
 </p>
 </div>
 </div>

 {/* Center Match Score & Stats */}
 <div className="flex items-center gap-6 border-y md:border-y-0 md:border-x border-cyan-50 py-3 md:py-0 md:px-6">
 <div className="text-center">
 <div className="font-display text-2xl font-extrabold text-[#0891B2] -[#0891B2]">
 {spec.matchScoreDefault}%
 </div>
 <div className="text-[10px] uppercase font-bold text-[#164E63]/40">Match Score</div>
 </div>

 <div className="text-center">
 <div className="font-display text-lg font-bold text-[#164E63] ">
 {spec.responseSlaMinutes}m
 </div>
 <div className="text-[10px] uppercase font-bold text-[#164E63]/40">Response SLA</div>
 </div>

 <div className="text-center">
 <div className="font-display text-lg font-bold text-[#164E63] ">
 {spec.activeCasesCount} / {spec.maxCapacity}
 </div>
 <div className="text-[10px] uppercase font-bold text-[#164E63]/40">Active Load</div>
 </div>
 </div>

 {/* Right Action Buttons */}
 <div className="shrink-0 flex items-center gap-3">
 {isCurrentlyAssigned ? (
 <span className="inline-flex items-center gap-1.5 rounded-none bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md">
 <CheckCircle2 className="h-4 w-4" /> Currently Assigned
 </span>
 ) : (
 <>
 <button
 onClick={() => openOverrideModal(spec)}
 className="rounded-none border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100 "
 >
 Override & Select
 </button>
 <button
 onClick={() => handleAccept(spec)}
 className="inline-flex items-center gap-1.5 rounded-none bg-[#059669] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
 >
 <CheckCircle2 className="h-4 w-4" /> Accept Match
 </button>
 </>
 )}
 </div>
 </div>

 {/* Match Rationale Callout */}
 <div className="mt-4 rounded-none bg-[#ECFEFF] p-3.5 border border-cyan-50 text-xs leading-relaxed text-[#164E63]/70 ">
 <strong className="text-[#164E63] font-bold">Clinical Rationale: </strong>
 {spec.rationale}
 </div>
 </div>
 );
 })}
 </div>

 {/* Phase 3: External Referral Network */}
 <div className="mt-8 rounded-none border border-indigo-200 bg-indigo-50/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border-dashed">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-none uppercase tracking-widest">Phase 3 Analytics</span>
 <h3 className="font-display text-base font-bold text-indigo-900">External Partner Network Routing</h3>
 </div>
 <p className="text-xs text-indigo-800/80 max-w-xl leading-relaxed">
 If local network specialists cannot meet the required acuity, SLA, or subspecialty, you can query the extended regional partner network for an immediate placement.
 </p>
 </div>
 <button className="shrink-0 bg-white border-2 border-indigo-200 text-indigo-700 px-6 py-2.5 rounded-none text-sm font-bold shadow-xs hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex items-center gap-2 cursor-pointer">
 Query External Network <ArrowRight className="h-4 w-4" />
 </button>
 </div>

 {/* Override Structured Reason Modal */}
 {overrideModalOpen && overrideTargetSpec && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
 <div className="w-full max-w-lg rounded-none border border-cyan-100 bg-white p-6 shadow-2xl ">
 <div className="flex items-center justify-between border-b border-cyan-100 pb-3">
 <h3 className="font-display text-lg font-bold text-[#164E63] flex items-center gap-2">
 <AlertTriangle className="h-5 w-5 text-amber-500" /> Confirm Specialist Override
 </h3>
 <button
 onClick={() => setOverrideModalOpen(false)}
 className="rounded-none p-1.5 text-[#164E63]/40 hover:bg-slate-100 :bg-slate-800"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 <p className="text-xs text-[#164E63]/60 -[#164E63]/40 mt-3">
 You are overriding the system's top recommendation for <strong>{activeCase?.patientName}</strong> and manually selecting <strong>{overrideTargetSpec.name}</strong> ({overrideTargetSpec.specialty}).
 </p>

 <div className="mt-4 space-y-3">
 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Override Category Reason *
 </label>
 <select
 value={overrideCategory}
 onChange={e => setOverrideCategory(e.target.value)}
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#164E63] focus:border-blue-600 focus:outline-none "
 >
 <option value="Patient/Family Preference">Patient / Family Request</option>
 <option value="Prior Surgical History">Prior Surgical Relationship</option>
 <option value="On-Call Coverage Shift">On-Call Coverage Shift Conflict</option>
 <option value="Specialized Equipment">Specialized Equipment Requirement</option>
 <option value="Custom Clinical Reason">Custom Clinical Judgement</option>
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Structured Text Reason (Mandatory) *
 </label>
 <textarea
 required
 value={overrideReason}
 onChange={e => setOverrideReason(e.target.value)}
 placeholder="Document the exact clinical or operational reason for this override..."
 className="w-full min-h-[100px] rounded-none border border-cyan-200 bg-white p-3 text-xs text-[#164E63] placeholder:text-[#164E63]/40 focus:border-amber-500 focus:outline-none "
 />
 </div>
 </div>

 <div className="mt-6 flex justify-end gap-3">
 <button
 onClick={() => setOverrideModalOpen(false)}
 className="rounded-none px-4 py-2.5 text-xs font-bold text-[#164E63]/70 hover:bg-slate-100 :bg-slate-800"
 >
 Cancel
 </button>
 <button
 disabled={!overrideReason.trim()}
 onClick={handleConfirmOverride}
 className="rounded-none bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
 >
 Confirm Override & Log to Audit Trail
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};
