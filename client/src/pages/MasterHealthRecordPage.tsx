import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
 FileHeart,
 CalendarDays,
 Droplets,
 AlertTriangle,
 Clock3,
 FileText,
 FlaskConical,
 FileImage,
 Activity,
 CheckCircle2,
 UserCheck,
 Stethoscope,
 ChevronRight,
 Download,
 Eye,
 X,
 MessageSquare,
 ShieldCheck,
} from "lucide-react";
import { usePediatric, CARE_STAGES, CareStageNumber } from "../context/PediatricContext";

type RecordTab = "overview" | "timeline" | "documents" | "reports";

export const MasterHealthRecordPage: React.FC = () => {
 const { id } = useParams<{ id: string }>();
 const { getPatientById, getCaseByPatientId, addClinicalNote } = usePediatric();

 const patientId = id || "PT-1001";
 const patient = getPatientById(patientId);
 const activeCase = getCaseByPatientId(patientId);

 const [activeTab, setActiveTab] = useState<RecordTab>("overview");
 const [newNoteText, setNewNoteText] = useState("");
 const [previewDocument, setPreviewDocument] = useState<{
 title: string;
 type: string;
 date: string;
 content: string;
 } | null>(null);

 if (!patient || !activeCase) {
 return (
 <div className="p-8 text-center">
 <h2 className="text-xl font-bold text-[#164E63] ">Patient Record Not Found</h2>
 <p className="text-xs text-[#164E63]/60 mt-2">Patient ID: {patientId}</p>
 <Link to="/dashboard" className="mt-4 inline-block text-xs font-bold text-[#0891B2]">
 Return to Command Center
 </Link>
 </div>
 );
 }

 const handleAddNote = (e: React.FormEvent) => {
 e.preventDefault();
 if (!newNoteText.trim()) return;
 addClinicalNote(activeCase.id, newNoteText.trim(), "Dr. Anitha Raman");
 setNewNoteText("");
 };

 const tabs: Array<{ key: RecordTab; label: string }> = [
 { key: "overview", label: "Clinical Overview" },
 { key: "timeline", label: "10-Stage Timeline" },
 { key: "documents", label: "Documents & PACS" },
 { key: "reports", label: "Trajectory Reports" },
 ];

 return (
 <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
 {/* Persistent Longitudinal Banner Header */}
 <div className="overflow-hidden rounded-none border border-cyan-200 bg-white shadow-md ">
 <div className="bg-gradient-to-r from-[#0891B2] to-[#059669] p-6 text-white">
 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
 <div>
 <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-100">
 <FileHeart className="h-4 w-4 text-cyan-200" /> Longitudinal Master Health Record
 </div>
 <h1 className="text-4xl font-light tracking-tight tracking-tight mt-1">
 {patient.fullName}
 </h1>
 <p className="text-xs text-cyan-50 font-semibold mt-1">
 Patient ID: <span className="font-mono text-white">{patient.id}</span> · Case ID:{" "}
 <span className="font-mono text-white">{activeCase.id}</span>
 </p>
 </div>

 <div className="flex flex-wrap items-center gap-2">
 <span
 className={`rounded-none px-3 py-1.5 text-xs font-extrabold border ${
 patient.riskCategory === "Critical"
 ? "bg-rose-500/20 text-rose-100 border-rose-400/30"
 : "bg-amber-500/20 text-amber-100 border-amber-400/30"
 }`}
 >
 Risk Level: {patient.riskCategory}
 </span>
 <span className="rounded-none bg-cyan-500/20 px-3 py-1.5 text-xs font-extrabold text-cyan-50 border border-cyan-400/30">
 Ward: {activeCase.ward}
 </span>
 </div>
 </div>
 </div>

 {/* Demographics Strip */}
 <dl className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-[#ECFEFF]/80 p-4 text-xs">
 <div className="p-2">
 <dt className="text-[10px] font-bold uppercase tracking-wider text-[#164E63]/40">
 Age & DOB
 </dt>
 <dd className="font-bold text-[#164E63] mt-0.5 flex items-center gap-1.5">
 <CalendarDays className="h-3.5 w-3.5 text-[#0891B2]" />
 {patient.ageYears} yrs ({patient.dob})
 </dd>
 </div>

 <div className="p-2">
 <dt className="text-[10px] font-bold uppercase tracking-wider text-[#164E63]/40">
 Biological Sex & Blood Group
 </dt>
 <dd className="font-bold text-[#164E63] mt-0.5 flex items-center gap-1.5">
 <Droplets className="h-3.5 w-3.5 text-rose-500" />
 {patient.gender} · {patient.bloodGroup}
 </dd>
 </div>

 <div className="p-2">
 <dt className="text-[10px] font-bold uppercase tracking-wider text-[#164E63]/40">
 Allergies (Highlighted)
 </dt>
 <dd className="font-bold text-rose-600 mt-0.5">
 {patient.allergies.join(", ") || "None Known"}
 </dd>
 </div>

 <div className="p-2">
 <dt className="text-[10px] font-bold uppercase tracking-wider text-[#164E63]/40">
 Guardian & Contact
 </dt>
 <dd className="font-bold text-[#164E63] mt-0.5 truncate">
 {patient.guardianName} ({patient.guardianRelation}) · {patient.guardianPhone}
 </dd>
 </div>
 </dl>
 </div>

 {/* Navigation Tabs Bar */}
 <div className="rounded-none border border-cyan-100 bg-white p-1.5 shadow-none ">
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
 {tabs.map(tab => (
 <button
 key={tab.key}
 onClick={() => setActiveTab(tab.key)}
 className={`rounded-none px-4 py-2.5 text-xs font-bold transition ${
 activeTab === tab.key
 ? "bg-[#059669] text-white shadow-md"
 : "text-[#164E63]/70 hover:bg-slate-100 -[#164E63]/40 :bg-slate-800"
 }`}
 >
 {tab.label}
 </button>
 ))}
 </div>
 </div>

 {/* TAB 1: OVERVIEW */}
 {activeTab === "overview" && (
 <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
 <div className="space-y-6">
 {/* Condition Card */}
 <article className="rounded-none border border-cyan-100 bg-white p-6 shadow-none border border-cyan-100 space-y-4">
 <h3 className="font-display text-lg font-bold text-[#164E63] ">
 Active Clinical Condition & Assignment
 </h3>
 <p className="text-xs text-[#164E63]/70 leading-relaxed">
 <strong className="text-[#164E63] block font-bold">Chief Complaint:</strong>
 {activeCase.chiefComplaint}
 </p>

 <div className="grid gap-3 sm:grid-cols-3">
 <div className="rounded-none bg-cyan-50 p-3.5 border border-blue-100 ">
 <div className="text-[10px] font-bold uppercase tracking-wider text-[#0891B2] -[#0891B2]">
 Assigned Specialist
 </div>
 <div className="text-xs font-bold text-[#164E63] mt-1">
 {activeCase.assignedSpecialistName || "Pending Decision"}
 </div>
 </div>

 <div className="rounded-none bg-emerald-50 p-3.5 border border-emerald-100 ">
 <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 ">
 Care Stage
 </div>
 <div className="text-xs font-bold text-[#164E63] mt-1">
 Stage {activeCase.currentStage} / 10
 </div>
 </div>

 <div className="rounded-none bg-purple-50 p-3.5 border border-purple-100 ">
 <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600 ">
 Digital Consent
 </div>
 <div className="text-xs font-bold text-[#164E63] mt-1 flex items-center gap-1">
 <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Verified
 </div>
 </div>
 </div>
 </article>

 {/* Vitals Summary Card */}
 <article className="rounded-none border border-cyan-100 bg-white p-6 shadow-none border border-cyan-100 space-y-4">
 <div className="flex items-center justify-between">
 <h3 className="font-display text-lg font-bold text-[#164E63] flex items-center gap-2">
 <Activity className="h-5 w-5 text-[#0891B2]" /> Telemetric Vitals Summary
 </h3>
 <span className="text-[10px] text-[#164E63]/40 font-mono">
 Recorded: {new Date(activeCase.vitals.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </span>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-3 text-center ">
 <div className="text-[10px] font-bold text-[#164E63]/40 uppercase">Heart Rate</div>
 <div className="font-display text-xl font-extrabold text-[#164E63] mt-0.5">
 {activeCase.vitals.heartRate} <span className="text-xs font-normal">bpm</span>
 </div>
 </div>
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-3 text-center ">
 <div className="text-[10px] font-bold text-[#164E63]/40 uppercase">Resp. Rate</div>
 <div className="font-display text-xl font-extrabold text-[#164E63] mt-0.5">
 {activeCase.vitals.respiratoryRate} <span className="text-xs font-normal">/min</span>
 </div>
 </div>
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-3 text-center ">
 <div className="text-[10px] font-bold text-[#164E63]/40 uppercase">SpO2</div>
 <div className={`font-display text-xl font-extrabold mt-0.5 ${activeCase.vitals.spO2 < 95 ? "text-rose-600" : "text-emerald-600"}`}>
 {activeCase.vitals.spO2}%
 </div>
 </div>
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-3 text-center ">
 <div className="text-[10px] font-bold text-[#164E63]/40 uppercase">Temp</div>
 <div className="font-display text-xl font-extrabold text-[#164E63] mt-0.5">
 {activeCase.vitals.temperature}°C
 </div>
 </div>
 </div>
 </article>

 {/* Add Clinical Note Form */}
 <article className="rounded-none border border-cyan-100 bg-white p-6 shadow-none border border-cyan-100 space-y-4">
 <h3 className="font-display text-base font-bold text-[#164E63] flex items-center gap-2">
 <MessageSquare className="h-4 w-4 text-[#0891B2]" /> Add Signed Clinical Note
 </h3>
 <form onSubmit={handleAddNote} className="space-y-3">
 <textarea
 value={newNoteText}
 onChange={e => setNewNoteText(e.target.value)}
 placeholder="Type new clinical evaluation note or progress entry..."
 className="w-full min-h-[80px] rounded-none border border-cyan-200 bg-white p-3 text-xs text-[#164E63] focus:border-blue-600 focus:outline-none "
 />
 <button
 type="submit"
 disabled={!newNoteText.trim()}
 className="rounded-none bg-[#059669] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-40"
 >
 Save Note to Longitudinal Record
 </button>
 </form>

 {/* Notes List */}
 <div className="mt-4 space-y-3 border-t border-cyan-50 pt-3">
 {activeCase.clinicalNotes.map(note => (
 <div key={note.id} className="rounded-none bg-[#ECFEFF] p-3.5 border border-cyan-100 text-xs">
 <div className="flex items-center justify-between text-[11px] font-bold text-[#164E63] ">
 <span>{note.author} ({note.role})</span>
 <time className="text-[10px] text-[#164E63]/40 font-mono">
 {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
 </time>
 </div>
 <p className="mt-1.5 text-[#164E63]/70 leading-relaxed">{note.text}</p>
 </div>
 ))}
 </div>
 </article>
 </div>

 {/* Right Column: Emergency & Safeguards */}
 <div className="space-y-6">
 <article className="rounded-none border border-rose-200 bg-rose-50/60 p-6 space-y-3">
 <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 ">
 <AlertTriangle className="h-4 w-4" /> Active Safeguard Alerts
 </div>
 <p className="text-xs text-rose-900 leading-relaxed">
 Patient is receiving high-acuity telemetry monitoring in PICU. Any modification to oxygen support or specialist assignment requires immediate attending sign-off.
 </p>
 </article>
 </div>
 </div>
 )}

 {/* TAB 2: TIMELINE */}
 {activeTab === "timeline" && (
 <div className="space-y-6">
 {/* 10-Stage Care Journey Progress Bar */}
 <div className="rounded-none border border-cyan-100 bg-white p-6 shadow-none border border-cyan-100 ">
 <h3 className="font-display text-lg font-bold text-[#164E63] mb-6">
 10-Stage Pediatric Care Journey Tracker
 </h3>

 <div className="relative">
 <div className="absolute top-5 left-4 right-4 h-1 bg-slate-200 -z-0" />
 <div className="grid grid-cols-5 md:grid-cols-10 gap-2 relative z-10">
 {CARE_STAGES.map(stage => {
 const isCompleted = stage.stageNumber <= activeCase.currentStage;
 const isCurrent = stage.stageNumber === activeCase.currentStage;

 return (
 <div key={stage.stageNumber} className="flex flex-col items-center text-center">
 <div
 className={`grid h-10 w-10 place-items-center rounded-none font-display text-xs font-extrabold border-2 transition ${
 isCurrent
 ? "bg-[#059669] text-white border-cyan-400 ring-4 ring-[#0891B2]/20 shadow-lg scale-110"
 : isCompleted
 ? "bg-emerald-600 text-white border-emerald-500"
 : "bg-slate-100 text-[#164E63]/40 border-cyan-200 "
 }`}
 >
 {stage.stageNumber}
 </div>
 <span className="mt-2 text-[10px] font-bold text-[#164E63] line-clamp-1">
 {stage.name}
 </span>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 {/* Chronological History List */}
 <div className="rounded-none border border-cyan-100 bg-white p-6 shadow-none border border-cyan-100 ">
 <h3 className="font-display text-base font-bold text-[#164E63] mb-4">
 Chronological Audit & Visit History
 </h3>

 <ol className="relative border-l border-cyan-100 ml-4 space-y-6">
 {activeCase.stageHistory.map((hist, i) => (
 <li key={i} className="ml-6">
 <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-none bg-[#059669] text-white text-[10px] font-bold ring-4 ring-white ">
 {hist.stageNumber}
 </span>
 <div className="rounded-none bg-[#ECFEFF] p-4 border border-cyan-100 text-xs">
 <div className="flex items-center justify-between font-bold text-[#164E63] ">
 <span>Stage {hist.stageNumber}: {CARE_STAGES.find(s => s.stageNumber === hist.stageNumber)?.name}</span>
 <time className="text-[10px] text-[#164E63]/40 font-mono">
 {new Date(hist.updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
 </time>
 </div>
 <div className="text-[11px] text-[#164E63]/60 mt-1">Actor: {hist.updatedBy}</div>
 {hist.note && <p className="mt-2 text-[#164E63] font-semibold">{hist.note}</p>}
 </div>
 </li>
 ))}
 </ol>
 </div>
 </div>
 )}

 {/* TAB 3: DOCUMENTS */}
 {activeTab === "documents" && (
 <div className="grid gap-4 sm:grid-cols-3">
 {[
 {
 title: "Chest X-Ray (AP Portable)",
 type: "PACS Imaging",
 date: "2026-09-08",
 icon: FileImage,
 content: "DICOM Preview Study #8891: Mild bilateral perihilar opacities; no pleural effusion reported.",
 },
 {
 title: "Pediatric Echocardiogram Report",
 type: "Cardiology Lab",
 date: "2026-09-08",
 icon: FlaskConical,
 content: "Perimembranous VSD 4.2mm with left-to-right shunt. LVEF 62%. Preserved LV systolic function.",
 },
 {
 title: "Digital Guardian Consent Form",
 type: "Legal Consent",
 date: "2026-09-08",
 icon: FileText,
 content: "HIPAA / DPDP 2023 Digital Consent signed by Sunita Menon (Mother). Verified timestamp 08:30 UTC.",
 },
 ].map((doc, idx) => {
 const Icon = doc.icon;
 return (
 <div
 key={idx}
 className="rounded-none border border-cyan-100 bg-white p-5 shadow-none border border-cyan-100 flex flex-col justify-between"
 >
 <div>
 <div className="grid h-10 w-10 place-items-center rounded-none bg-[#059669]/10 text-[#0891B2] font-bold -[#0891B2]">
 <Icon className="h-5 w-5" />
 </div>
 <h4 className="font-display text-sm font-bold text-[#164E63] mt-4">
 {doc.title}
 </h4>
 <p className="text-[11px] text-[#164E63]/60 mt-1">{doc.type} · {doc.date}</p>
 </div>

 <div className="mt-6 flex items-center gap-2">
 <button
 onClick={() => setPreviewDocument(doc)}
 className="flex-1 inline-flex items-center justify-center gap-1 rounded-none border border-cyan-200 bg-[#ECFEFF] px-3 py-2 text-xs font-bold text-[#164E63] hover:bg-slate-100 "
 >
 <Eye className="h-3.5 w-3.5" /> Preview
 </button>
 </div>
 </div>
 );
 })}
 </div>
 )}

 {/* TAB 4: REPORTS */}
 {activeTab === "reports" && (
 <div className="rounded-none border border-cyan-100 bg-white p-6 shadow-none border border-cyan-100 space-y-4">
 <h3 className="font-display text-lg font-bold text-[#164E63] ">
 Clinical Trajectory & Signed Reports
 </h3>
 <p className="text-xs text-[#164E63]/60">
 Export longitudinal clinical summary for insurance claim or inter-hospital transfer.
 </p>

 <div className="rounded-none border border-dashed border-cyan-200 p-6 text-center text-xs text-[#164E63]/60 ">
 <FileText className="mx-auto h-8 w-8 text-[#164E63]/40 mb-2" />
 <p className="font-bold text-[#164E63] ">Signed Clinical Summary PDF Ready</p>
 <p className="mt-1">Generated: 2026-09-09 · Attending: Dr. Anitha Raman</p>
 </div>
 </div>
 )}

 {/* Document Preview Modal */}
 {previewDocument && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
 <div className="w-full max-w-lg rounded-none border border-cyan-100 bg-white p-6 shadow-2xl ">
 <div className="flex items-center justify-between border-b border-cyan-100 pb-3">
 <h3 className="font-display text-base font-bold text-[#164E63] ">
 {previewDocument.title}
 </h3>
 <button
 onClick={() => setPreviewDocument(null)}
 className="rounded-none p-1 text-[#164E63]/40 hover:bg-slate-100 :bg-slate-800"
 >
 <X className="h-5 w-5" />
 </button>
 </div>

 <div className="mt-4 rounded-none bg-[#ECFEFF] p-4 border border-cyan-100 text-xs font-mono leading-relaxed text-[#164E63]/90 ">
 {previewDocument.content}
 </div>

 <div className="mt-6 flex justify-end">
 <button
 onClick={() => setPreviewDocument(null)}
 className="rounded-none bg-[#059669] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
 >
 Close Preview
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};
