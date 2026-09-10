import React, { useState } from "react";
import { usePediatric } from "../context/PediatricContext";
import { User, Activity, Clock, FileText, RefreshCcw, CheckCircle, HelpCircle } from "lucide-react";

export function ParentPortalPage() {
 const { cases, specialists } = usePediatric();
 
 // For demo, we just pick the first case that has an assigned specialist
 const activeCase = cases.find(c => c.assignedSpecialistId) || cases[0];
 const assignedSpecialist = specialists.find(s => s.id === activeCase?.assignedSpecialistId);
 const [secondOpinionRequested, setSecondOpinionRequested] = useState(false);

 const handleSecondOpinion = () => {
 // In a real app, this would trigger a frictionless request to the backend.
 setSecondOpinionRequested(true);
 setTimeout(() => {
 alert("Second opinion request logged successfully. A Care Coordinator will contact you shortly.");
 }, 500);
 };

 if (!activeCase) {
 return (
 <div className="p-4 sm:p-6 min-h-screen bg-gray-50 flex items-center justify-center">
 <p className="text-gray-500">No active cases found for this portal.</p>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-gray-50 pb-20 sm:pb-10 font-sans animate-in fade-in zoom-in duration-500">
 {/* Mobile-Friendly Header */}
 <div className="bg-white shadow-none border border-cyan-100 border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
 <div className="max-w-3xl mx-auto flex justify-between items-center">
 <div className="flex items-center space-x-2">
 <User className="w-6 h-6 text-indigo-600" />
 <h1 className="text-xl font-bold text-gray-900">Parent Portal</h1>
 </div>
 <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-none">
 {activeCase.patientName}
 </div>
 </div>
 </div>

 <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
 
 {/* Journey Tracker */}
 <div className="bg-white rounded-none shadow-none border border-cyan-100 border border-gray-100 p-5">
 <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
 <Activity className="w-5 h-5 mr-2 text-[#0891B2]" />
 Care Journey
 </h2>
 <div className="relative border-l-2 border-cyan-200 ml-3 pl-4 pb-2 space-y-6">
 <div className="relative">
 <span className="absolute -left-6 top-1 w-4 h-4 rounded-none bg-blue-500 border-2 border-white shadow-none border border-cyan-100"></span>
 <p className="font-semibold text-gray-800 text-sm">Stage {activeCase.currentStage}</p>
 <p className="text-xs text-gray-500 mt-1">Current phase of the care plan</p>
 <div className="mt-2 bg-cyan-50 text-blue-800 text-sm p-3 rounded-none border border-blue-100">
 <strong>What happens next:</strong> Based on the current stage, the clinical team is actively monitoring progress and will communicate the next steps soon.
 </div>
 </div>
 {/* Mock Future Step */}
 <div className="relative opacity-50">
 <span className="absolute -left-6 top-1 w-4 h-4 rounded-none bg-gray-300 border-2 border-white shadow-none border border-cyan-100"></span>
 <p className="font-semibold text-gray-600 text-sm">Resolution & Discharge</p>
 <p className="text-xs text-gray-500 mt-1">Final specialist sign-off</p>
 </div>
 </div>
 </div>

 {/* Specialist Transparency */}
 {assignedSpecialist && (
 <div className="bg-white rounded-none shadow-none border border-cyan-100 border border-gray-100 overflow-hidden">
 <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 flex items-center space-x-4">
 <img 
 src={assignedSpecialist.avatar} 
 alt={assignedSpecialist.name} 
 className="w-16 h-16 rounded-none border-2 border-white shadow-md object-cover"
 />
 <div className="text-white">
 <h2 className="text-lg font-bold">{assignedSpecialist.name}</h2>
 <p className="text-indigo-100 text-sm font-medium">{assignedSpecialist.title}</p>
 </div>
 </div>
 <div className="p-5 space-y-4">
 <div>
 <h3 className="text-sm font-semibold text-gray-700 flex items-center"><CheckCircle className="w-4 h-4 mr-1 text-green-500" /> Why were they selected?</h3>
 <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-none">{assignedSpecialist.rationale}</p>
 </div>
 <div className="grid grid-cols-2 gap-4">
 <div className="bg-gray-50 p-3 rounded-none border border-gray-100 text-center">
 <div className="text-2xl font-bold text-indigo-600">{assignedSpecialist.rating}</div>
 <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Outcome Score</div>
 </div>
 <div className="bg-gray-50 p-3 rounded-none border border-gray-100 text-center">
 <div className="text-2xl font-bold text-indigo-600">{assignedSpecialist.activeCasesCount * 15}+</div>
 <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">Similar Cases</div>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Plain-Language Care Plan */}
 <div className="bg-white rounded-none shadow-none border border-cyan-100 border border-gray-100 p-5">
 <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
 <FileText className="w-5 h-5 mr-2 text-teal-500" />
 Your Child's Care Plan
 </h2>
 <div className="space-y-3">
 <div className="p-4 bg-teal-50 border border-teal-100 rounded-none">
 <h3 className="font-semibold text-teal-900 text-sm">Diagnosis & Goal</h3>
 <p className="text-sm text-teal-800 mt-1">
 Your child is being treated for <strong>{activeCase.primaryCondition}</strong>. The primary goal is to stabilize and monitor progress closely.
 </p>
 </div>
 <div className="p-4 border border-gray-200 rounded-none">
 <h3 className="font-semibold text-gray-800 text-sm flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-500" /> Recent Updates</h3>
 <ul className="mt-2 space-y-2">
 {activeCase.clinicalNotes.slice(0, 2).map(note => (
 <li key={note.id} className="text-sm text-gray-600 flex items-start">
 <span className="w-1.5 h-1.5 bg-gray-400 rounded-none mt-1.5 mr-2 flex-shrink-0"></span>
 <span>{note.text}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>

 {/* Second Opinion Workflow */}
 <div className="bg-white rounded-none shadow-none border border-cyan-100 border border-gray-200 p-5 flex flex-col items-center text-center space-y-3">
 <div className="w-12 h-12 bg-purple-100 rounded-none flex items-center justify-center text-purple-600">
 <HelpCircle className="w-6 h-6" />
 </div>
 <div>
 <h2 className="text-lg font-bold text-gray-900">Want another perspective?</h2>
 <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
 We completely support your right to a second opinion. It's fast, free, and won't disrupt current care.
 </p>
 </div>
 <button 
 onClick={handleSecondOpinion}
 disabled={secondOpinionRequested}
 className={`mt-2 w-full sm:w-auto px-6 py-3 rounded-none font-medium flex items-center justify-center transition-all shadow-none border border-cyan-100 ${
 secondOpinionRequested 
 ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
 : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-md'
 }`}
 >
 {secondOpinionRequested ? (
 <><CheckCircle className="w-5 h-5 mr-2" /> Request Received</>
 ) : (
 <><RefreshCcw className="w-5 h-5 mr-2" /> Request Second Opinion</>
 )}
 </button>
 </div>

 </div>
 </div>
 );
}
