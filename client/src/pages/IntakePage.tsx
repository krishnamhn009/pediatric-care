import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
 UserPlus,
 HeartPulse,
 ShieldCheck,
 CheckCircle2,
 AlertTriangle,
 FileText,
 Activity,
 ArrowRight,
 Sparkles,
} from "lucide-react";
import { usePediatric, VitalsData } from "../context/PediatricContext";
import { evaluateVitals, getPediatricVitalsRange } from "../utils/vitalsThresholds";

export const IntakePage: React.FC = () => {
 const { registerIntake } = usePediatric();
 const navigate = useNavigate();

 // Form State
 const [fullName, setFullName] = useState("Aarav Patel");
 const [dob, setDob] = useState("2024-05-10");
 const [ageYears, setAgeYears] = useState(2);
 const [ageMonths, setAgeMonths] = useState(4);
 const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
 const [bloodGroup, setBloodGroup] = useState("A positive");
 const [allergiesText, setAllergiesText] = useState("Penicillin, Latex");

 const [guardianName, setGuardianName] = useState("Rajesh Patel");
 const [guardianRelation, setGuardianRelation] = useState("Father");
 const [guardianPhone, setGuardianPhone] = useState("+91 98220 77112");
 const [insuranceId, setInsuranceId] = useState("HDFC-ERGO-KID-8832");
 const [consentConfirmed, setConsentConfirmed] = useState(true);

 // Clinical & Vitals State
 const [ward, setWard] = useState<"OPD" | "Emergency" | "PICU" | "NICU" | "Pediatric Wards" | "Imaging">("Emergency");
 const [urgency, setUrgency] = useState<"Routine" | "Moderate" | "Urgent" | "Critical">("Critical");
 const [chiefComplaint, setChiefComplaint] = useState(
 "Sudden onset lethargy, cyanosis during feeding, respiratory grunting."
 );
 const [primaryCondition, setPrimaryCondition] = useState(
 "Suspected Congenital Cardiac Anomaly / Acute Heart Failure"
 );

 const [heartRate, setHeartRate] = useState(165);
 const [respiratoryRate, setRespiratoryRate] = useState(48);
 const [systolicBp, setSystolicBp] = useState(82);
 const [diastolicBp, setDiastolicBp] = useState(54);
 const [spO2, setSpO2] = useState(91);
 const [temperature, setTemperature] = useState(38.2);
 const [weightKg, setWeightKg] = useState(12.5);
 const [painScale, setPainScale] = useState(5);

 // Calculate age-based vitals evaluation
 const vitalsRange = useMemo(() => getPediatricVitalsRange(ageYears), [ageYears]);
 const vitalsFlags = useMemo(
 () =>
 evaluateVitals(ageYears, {
 heartRate,
 respiratoryRate,
 systolicBp,
 spO2,
 temperature,
 }),
 [ageYears, heartRate, respiratoryRate, systolicBp, spO2, temperature]
 );

 const criticalFlagsCount = vitalsFlags.filter(f => f.status === "Critical").length;
 const warningFlagsCount = vitalsFlags.filter(f => f.status === "Warning").length;

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!consentConfirmed) {
 alert("Digital Guardian Consent is mandatory for clinical registration.");
 return;
 }

 const vitalsObj: VitalsData = {
 heartRate,
 respiratoryRate,
 systolicBp,
 diastolicBp,
 spO2,
 temperature,
 weightKg,
 painScale,
 timestamp: new Date().toISOString(),
 };

 const allergiesArray = allergiesText
 .split(",")
 .map(a => a.trim())
 .filter(Boolean);

 const { caseId } = registerIntake(
 {
 fullName,
 dob,
 ageYears,
 ageMonths,
 gender,
 bloodGroup,
 allergies: allergiesArray,
 guardianName,
 guardianRelation,
 guardianPhone,
 insuranceId,
 consentSigned: true,
 medicalHistory: [primaryCondition],
 riskCategory: criticalFlagsCount > 0 ? "Critical" : warningFlagsCount > 0 ? "High" : "Moderate",
 assignedWard: ward,
 },
 {
 chiefComplaint,
 primaryCondition,
 urgency,
 vitals: vitalsObj,
 ward,
 }
 );

 // Redirect to Specialist Recommendation engine for this case!
 navigate(`/recommendation?caseId=${caseId}`);
 };

 return (
 <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
 {/* Header */}
 <div>
 <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0891B2] -[#0891B2]">
 <UserPlus className="h-4 w-4" /> Stage 1 & 2 Care Journey
 </div>
 <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#164E63] mt-1">
 Registration & Clinical Assessment Intake
 </h1>
 <p className="text-sm text-[#164E63]/70 -[#164E63]/40 mt-1">
 Register new pediatric admission, record digital consent, and perform age-threshold vitals triage.
 </p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-8">
 {/* Section 1: Demographics & Digital Consent */}
 <section className="rounded-none border border-cyan-100 bg-white p-6 shadow-none border border-cyan-100 space-y-6">
 <div className="flex items-center gap-2 border-b border-cyan-100 pb-4">
 <div className="grid h-8 w-8 place-items-center rounded-none bg-[#059669]/10 text-[#0891B2] font-bold -[#0891B2]">
 1
 </div>
 <h2 className="font-display text-lg font-bold text-[#164E63] ">
 Child Demographics & Guardian Digital Consent
 </h2>
 </div>

 <div className="grid gap-4 sm:grid-cols-3">
 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Child Full Name *
 </label>
 <input
 type="text"
 required
 value={fullName}
 onChange={e => setFullName(e.target.value)}
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs text-[#164E63] focus:border-blue-600 focus:outline-none "
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Date of Birth *
 </label>
 <input
 type="date"
 required
 value={dob}
 onChange={e => setDob(e.target.value)}
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs text-[#164E63] focus:border-blue-600 focus:outline-none "
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Gender *
 </label>
 <select
 value={gender}
 onChange={e => setGender(e.target.value as any)}
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#164E63] focus:border-blue-600 focus:outline-none "
 >
 <option value="Male">Male</option>
 <option value="Female">Female</option>
 <option value="Other">Other</option>
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Age (Years) *
 </label>
 <input
 type="number"
 min="0"
 max="18"
 required
 value={ageYears}
 onChange={e => setAgeYears(parseInt(e.target.value) || 0)}
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs text-[#164E63] focus:border-blue-600 focus:outline-none "
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Blood Group
 </label>
 <input
 type="text"
 value={bloodGroup}
 onChange={e => setBloodGroup(e.target.value)}
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs text-[#164E63] focus:border-blue-600 focus:outline-none "
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Known Allergies
 </label>
 <input
 type="text"
 value={allergiesText}
 onChange={e => setAllergiesText(e.target.value)}
 placeholder="e.g. Penicillin, Peanuts"
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs text-[#164E63] focus:border-blue-600 focus:outline-none "
 />
 </div>
 </div>

 <div className="grid gap-4 sm:grid-cols-3 border-t border-cyan-50 pt-4">
 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Guardian Full Name *
 </label>
 <input
 type="text"
 required
 value={guardianName}
 onChange={e => setGuardianName(e.target.value)}
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs text-[#164E63] focus:border-blue-600 focus:outline-none "
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Guardian Relation *
 </label>
 <input
 type="text"
 required
 value={guardianRelation}
 onChange={e => setGuardianRelation(e.target.value)}
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs text-[#164E63] focus:border-blue-600 focus:outline-none "
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Guardian Phone / Contact *
 </label>
 <input
 type="text"
 required
 value={guardianPhone}
 onChange={e => setGuardianPhone(e.target.value)}
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs text-[#164E63] focus:border-blue-600 focus:outline-none "
 />
 </div>
 </div>

 {/* Digital Consent Checkbox */}
 <div className="rounded-none border border-cyan-200 bg-cyan-50/60 p-4 ">
 <label className="flex items-start gap-3 cursor-pointer">
 <input
 type="checkbox"
 checked={consentConfirmed}
 onChange={e => setConsentConfirmed(e.target.checked)}
 className="mt-1 h-4 w-4 rounded accent-blue-600"
 />
 <div className="text-xs text-[#164E63] ">
 <span className="font-bold text-blue-900 block mb-0.5">
 Digital Guardian Consent & HIPAA Authorization Verified
 </span>
 I confirm that legal guardian authorization has been obtained for clinical triage, emergency specialist decision-support matching, and telemetry monitoring under HIPAA / DPDP 2023 guidelines.
 </div>
 </label>
 </div>
 </section>

 {/* Section 2: Clinical Assessment & Vitals with Age-based Flagging */}
 <section className="rounded-none border border-cyan-100 bg-white p-6 shadow-none border border-cyan-100 space-y-6">
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-100 pb-4">
 <div className="flex items-center gap-2">
 <div className="grid h-8 w-8 place-items-center rounded-none bg-[#059669]/10 text-[#0891B2] font-bold -[#0891B2]">
 2
 </div>
 <h2 className="font-display text-lg font-bold text-[#164E63] ">
 Clinical Vitals Assessment & Age-Based Threshold Flagging
 </h2>
 </div>
 <span className="rounded-none bg-slate-100 px-3 py-1 text-xs font-bold text-[#164E63] border border-cyan-100 ">
 Evaluated Category: <strong className="text-[#0891B2] -[#0891B2]">{vitalsRange.ageGroup}</strong>
 </span>
 </div>

 {/* Condition Details */}
 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Assigned Unit / Ward *
 </label>
 <select
 value={ward}
 onChange={e => setWard(e.target.value as any)}
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#164E63] focus:border-blue-600 focus:outline-none "
 >
 <option value="Emergency">Emergency / Triage</option>
 <option value="PICU">PICU (Pediatric ICU)</option>
 <option value="NICU">NICU (Neonatal ICU)</option>
 <option value="OPD">OPD Consult</option>
 <option value="Pediatric Wards">General Pediatric Wards</option>
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Clinical Urgency Level *
 </label>
 <select
 value={urgency}
 onChange={e => setUrgency(e.target.value as any)}
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-[#164E63] focus:border-blue-600 focus:outline-none "
 >
 <option value="Routine">Routine</option>
 <option value="Moderate">Moderate</option>
 <option value="Urgent">Urgent</option>
 <option value="Critical">Critical</option>
 </select>
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Chief Complaint *
 </label>
 <input
 type="text"
 required
 value={chiefComplaint}
 onChange={e => setChiefComplaint(e.target.value)}
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs text-[#164E63] focus:border-blue-600 focus:outline-none "
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Primary Suspected Condition *
 </label>
 <input
 type="text"
 required
 value={primaryCondition}
 onChange={e => setPrimaryCondition(e.target.value)}
 className="w-full rounded-none border border-cyan-200 bg-white px-3.5 py-2.5 text-xs text-[#164E63] focus:border-blue-600 focus:outline-none "
 />
 </div>

 {/* Vitals Inputs Grid */}
 <div className="border-t border-cyan-50 pt-4 space-y-4">
 <h3 className="text-xs font-bold uppercase tracking-wider text-[#164E63]/40">
 Vitals Inputs & Real-time Threshold Flags
 </h3>

 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 {/* Heart Rate */}
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-4 ">
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Heart Rate (bpm)
 </label>
 <input
 type="number"
 value={heartRate}
 onChange={e => setHeartRate(parseInt(e.target.value) || 0)}
 className="w-full rounded-none border border-cyan-200 bg-white p-2.5 text-sm font-bold text-[#164E63] "
 />
 <div className="mt-2 text-[10px] text-[#164E63]/60">
 Normal for {vitalsRange.ageGroup}: {vitalsRange.hrMin}-{vitalsRange.hrMax} bpm
 </div>
 </div>

 {/* Respiratory Rate */}
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-4 ">
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Respiratory Rate (/min)
 </label>
 <input
 type="number"
 value={respiratoryRate}
 onChange={e => setRespiratoryRate(parseInt(e.target.value) || 0)}
 className="w-full rounded-none border border-cyan-200 bg-white p-2.5 text-sm font-bold text-[#164E63] "
 />
 <div className="mt-2 text-[10px] text-[#164E63]/60">
 Normal for {vitalsRange.ageGroup}: {vitalsRange.rrMin}-{vitalsRange.rrMax}/min
 </div>
 </div>

 {/* SpO2 */}
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-4 ">
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 SpO2 Saturation (%)
 </label>
 <input
 type="number"
 value={spO2}
 onChange={e => setSpO2(parseInt(e.target.value) || 0)}
 className="w-full rounded-none border border-cyan-200 bg-white p-2.5 text-sm font-bold text-[#164E63] "
 />
 <div className="mt-2 text-[10px] text-[#164E63]/60">
 Normal threshold: ≥{vitalsRange.spO2Min}%
 </div>
 </div>

 {/* Temperature */}
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-4 ">
 <label className="block text-xs font-bold text-[#164E63] mb-1">
 Temperature (°C)
 </label>
 <input
 type="number"
 step="0.1"
 value={temperature}
 onChange={e => setTemperature(parseFloat(e.target.value) || 0)}
 className="w-full rounded-none border border-cyan-200 bg-white p-2.5 text-sm font-bold text-[#164E63] "
 />
 <div className="mt-2 text-[10px] text-[#164E63]/60">
 Normal range: {vitalsRange.tempMin}-{vitalsRange.tempMax}°C
 </div>
 </div>
 </div>

 {/* Threshold Evaluation Summary Card */}
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF] p-4 space-y-3">
 <div className="flex items-center justify-between">
 <span className="text-xs font-bold text-[#164E63] flex items-center gap-1.5">
 <Activity className="h-4 w-4 text-[#0891B2] -[#0891B2]" />
 Real-time Age-Based Threshold Flags for {fullName} ({ageYears} yrs)
 </span>
 {criticalFlagsCount > 0 ? (
 <span className="rounded-none bg-rose-500 px-3 py-0.5 text-[10px] font-extrabold text-white">
 {criticalFlagsCount} CRITICAL THRESHOLD BREACHES
 </span>
 ) : warningFlagsCount > 0 ? (
 <span className="rounded-none bg-amber-500 px-3 py-0.5 text-[10px] font-extrabold text-white">
 {warningFlagsCount} WARNING THRESHOLDS
 </span>
 ) : (
 <span className="rounded-none bg-emerald-500 px-3 py-0.5 text-[10px] font-extrabold text-white">
 ALL VITALS WITHIN NORMAL LIMITS
 </span>
 )}
 </div>

 <div className="grid gap-2 sm:grid-cols-2">
 {vitalsFlags.map(flag => (
 <div
 key={flag.param}
 className={`rounded-none p-3 border text-xs ${
 flag.status === "Critical"
 ? "border-rose-300 bg-rose-50 text-rose-900 "
 : flag.status === "Warning"
 ? "border-amber-300 bg-amber-50 text-amber-900 "
 : "border-emerald-200 bg-emerald-50/60 text-emerald-900 "
 }`}
 >
 <div className="flex items-center justify-between font-bold">
 <span>{flag.param}: {flag.value}</span>
 <span className="uppercase text-[10px]">{flag.status}</span>
 </div>
 <p className="mt-1 text-[11px] opacity-90">{flag.message}</p>
 <div className="mt-1 text-[10px] opacity-75">Target: {flag.expectedRange}</div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </section>

 {/* Submit & Trigger Recommendation Button */}
 <div className="flex justify-end gap-4">
 <button
 type="submit"
 className="inline-flex min-h-12 items-center gap-2 rounded-none bg-[#059669] px-8 text-sm font-bold text-white shadow-md hover:bg-emerald-700"
 >
 Complete Intake & Launch AI Specialist Recommendation <ArrowRight className="h-4 w-4" />
 </button>
 </div>
 </form>
 </div>
 );
};
