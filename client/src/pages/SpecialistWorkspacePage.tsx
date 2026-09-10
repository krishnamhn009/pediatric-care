import React, { useState } from "react";
import { usePediatric } from "../context/PediatricContext";
import { CheckCircle, XCircle, Activity, Save, CheckSquare, Stethoscope, BriefcaseMedical, Video } from "lucide-react";
import { TeleconsultModal } from "../components/TeleconsultModal";

export function SpecialistWorkspacePage() {
 const { cases, specialists, acceptSpecialist, overrideSpecialist, updateCaseStage, addClinicalNote, closeCase } = usePediatric();

 // Find cases assigned to a mock specialist, or pending recommendation
 const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
 
 // States for different sections
 const [declineReason, setDeclineReason] = useState("");
 const [icdCode, setIcdCode] = useState("");
 const [consultOutcome, setConsultOutcome] = useState("");
 const [treatmentPlan, setTreatmentPlan] = useState("");
 const [isTeleconsultOpen, setIsTeleconsultOpen] = useState(false);
 
 const pendingCases = cases.filter(c => c.currentStage === 5 || c.currentStage === 4);
 const activeCases = cases.filter(c => c.currentStage >= 6 && c.currentStage < 10);
 
 const selectedCase = cases.find(c => c.id === selectedCaseId);

 const handleAccept = (caseId: string) => {
    updateCaseStage(caseId, 6, "Specialist accepted referral. Consultation initiated.");
    setSelectedCaseId(caseId);
  };

  const handleDecline = (caseId: string) => {
    if (!declineReason) {
      alert("You must select a reason to decline.");
      return;
    }
    updateCaseStage(caseId, 4, `Referral declined: ${declineReason}`);
    setDeclineReason("");
  };

 const handleDiagnosisSubmit = () => {
 if (!selectedCaseId || !icdCode || !consultOutcome) return;
 addClinicalNote(selectedCaseId, `Consultation Outcome: ${consultOutcome} | Diagnosis: ${icdCode}`);
 updateCaseStage(selectedCaseId, 8, `Diagnosis confirmed: ${icdCode}`);
 setIcdCode("");
 setConsultOutcome("");
 };

 const handleTreatmentPlanSubmit = () => {
 if (!selectedCaseId || !treatmentPlan) return;
 addClinicalNote(selectedCaseId, `Treatment Plan Initiated: ${treatmentPlan}`);
 updateCaseStage(selectedCaseId, 9, "Treatment plan initiated and monitoring active");
 setTreatmentPlan("");
 };

 const handleCaseClosure = () => {
 if (!selectedCaseId) return;
 const res = closeCase(selectedCaseId, true);
 if (!res.success) {
 alert(res.error);
 } else {
 setSelectedCaseId(null);
 }
 };

 return (
 <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
 <div className="flex items-center space-x-3 mb-6">
 <Stethoscope className="w-8 h-8 text-[#0891B2]" />
 <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Specialist Workspace</h1>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Sidebar: Case Queue */}
 <div className="lg:col-span-1 space-y-6">
 <div className="bg-white rounded-none shadow-none border border-cyan-100 border border-gray-100 overflow-hidden">
 <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
 <h2 className="text-lg font-semibold text-white">Referral Inbox</h2>
 </div>
 <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
 {pendingCases.length === 0 && <p className="text-gray-500 text-sm">No pending referrals.</p>}
 {pendingCases.map(c => (
 <div key={c.id} className="border border-gray-200 rounded-none p-4 bg-gray-50 hover:shadow-md transition">
 <div className="font-semibold text-gray-800">{c.patientName}</div>
 <div className="text-sm text-gray-600 mb-2">{c.primaryCondition}</div>
 <div className="flex space-x-2 mt-3">
 <button onClick={() => handleAccept(c.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-none flex items-center justify-center transition">
 <CheckCircle className="w-4 h-4 mr-1" /> Accept
 </button>
 </div>
 <div className="mt-2 space-y-2">
 <select 
 className="w-full text-sm border-gray-300 rounded-none p-2"
 value={declineReason}
 onChange={(e) => setDeclineReason(e.target.value)}
 >
 <option value="">Select decline reason...</option>
 <option value="Over capacity">Over capacity</option>
 <option value="Outside sub-specialty">Outside sub-specialty</option>
 <option value="Conflict of interest">Conflict of interest</option>
 </select>
 <button onClick={() => handleDecline(c.id)} className="w-full bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium py-2 rounded-none flex items-center justify-center transition border border-red-200">
 <XCircle className="w-4 h-4 mr-1" /> Decline
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="bg-white rounded-none shadow-none border border-cyan-100 border border-gray-100 overflow-hidden">
 <div className="bg-gray-100 p-4 border-b border-gray-200">
 <h2 className="text-lg font-semibold text-gray-800">My Active Cases</h2>
 </div>
 <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
 {activeCases.map(c => (
 <button 
 key={c.id}
 onClick={() => setSelectedCaseId(c.id)}
 className={`w-full text-left p-3 rounded-none border transition ${selectedCaseId === c.id ? 'border-blue-500 bg-cyan-50' : 'border-gray-200 hover:border-blue-300'}`}
 >
 <div className="font-semibold text-gray-800">{c.patientName}</div>
 <div className="text-xs text-[#0891B2] mt-1">Stage: {c.currentStage}</div>
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* Main Workspace Area */}
 <div className="lg:col-span-2 space-y-6">
 {selectedCase ? (
 <div className="space-y-6">
 {/* Consultation & Diagnosis */}
 <div className="bg-white rounded-none shadow-md border border-gray-100 p-6">
 <div className="flex items-center justify-between mb-4">
 <div className="flex items-center space-x-2">
 <Activity className="w-5 h-5 text-indigo-600" />
 <h2 className="text-xl font-bold text-gray-800">Consultation & Diagnosis</h2>
 </div>
 <button 
  onClick={() => setIsTeleconsultOpen(true)}
  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center shadow-sm"
 >
 <Video className="w-4 h-4 mr-2" /> Launch Virtual Teleconsultation
 </button>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">ICD-10/ICD-11 Code</label>
 <select 
 className="w-full border-gray-300 rounded-none p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
 value={icdCode}
 onChange={(e) => setIcdCode(e.target.value)}
 >
 <option value="">Select confirmed diagnosis...</option>
 <option value="Q21.0 - Ventricular Septal Defect">Q21.0 - Ventricular Septal Defect</option>
 <option value="G40.3 - Generalized Idiopathic Epilepsy">G40.3 - Generalized Idiopathic Epilepsy</option>
 <option value="J21.9 - Acute Bronchiolitis, Unspecified">J21.9 - Acute Bronchiolitis, Unspecified</option>
 <option value="Q21.3 - Tetralogy of Fallot">Q21.3 - Tetralogy of Fallot</option>
 </select>
 </div>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Outcome</label>
 <input 
 type="text"
 placeholder="e.g., Patient stable, continue meds"
 className="w-full border-gray-300 rounded-none p-2.5 focus:ring-2 focus:ring-indigo-500"
 value={consultOutcome}
 onChange={(e) => setConsultOutcome(e.target.value)}
 />
 </div>
 </div>
 <button onClick={handleDiagnosisSubmit} disabled={!icdCode || !consultOutcome} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-none flex items-center transition disabled:opacity-50">
 <Save className="w-4 h-4 mr-2" /> Save Diagnosis
 </button>
 </div>

 {/* Treatment Plan Builder */}
 <div className="bg-white rounded-none shadow-md border border-gray-100 p-6">
 <div className="flex items-center space-x-2 mb-4">
 <BriefcaseMedical className="w-5 h-5 text-teal-600" />
 <h2 className="text-xl font-bold text-gray-800">Treatment Plan Builder</h2>
 </div>
 <div className="mb-4">
 <label className="block text-sm font-medium text-gray-700 mb-1">Protocol / Interventions / Milestones</label>
 <textarea 
 rows={4}
 placeholder="Enter personalized treatment plan linked to evidence-based protocol..."
 className="w-full border-gray-300 rounded-none p-3 focus:ring-2 focus:ring-teal-500"
 value={treatmentPlan}
 onChange={(e) => setTreatmentPlan(e.target.value)}
 ></textarea>
 </div>
 <button onClick={handleTreatmentPlanSubmit} disabled={!treatmentPlan} className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-none flex items-center transition disabled:opacity-50">
 <CheckSquare className="w-4 h-4 mr-2" /> Initiate Plan
 </button>
 </div>

 {/* Case Closure */}
 <div className="bg-green-50 border border-green-200 rounded-none p-6 flex flex-col sm:flex-row items-center justify-between shadow-none border border-cyan-100">
 <div>
 <h3 className="text-lg font-bold text-green-800">Clinical Resolution</h3>
 <p className="text-sm text-green-700 mt-1">Sign off on this case to confirm all milestones have been met.</p>
 </div>
 <button onClick={handleCaseClosure} className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-none flex items-center transition transform hover:scale-105 shadow-md">
 <CheckCircle className="w-5 h-5 mr-2" /> Sign-off & Close Case
 </button>
 </div>

 </div>
 ) : (
 <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-none text-gray-500">
 <Stethoscope className="w-16 h-16 text-gray-300 mb-4" />
 <p className="text-lg font-medium">Select a case from your queue to begin.</p>
 </div>
 )}
 </div>
 </div>

 {selectedCase && (
  <TeleconsultModal
    isOpen={isTeleconsultOpen}
    onClose={() => setIsTeleconsultOpen(false)}
    patientName={selectedCase.patientName}
    specialistName={selectedCase.assignedSpecialistName || "Specialist"}
  />
 )}
 </div>
 );
}
