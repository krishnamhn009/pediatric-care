import React, { useState } from "react";
import { usePediatric, CARE_STAGES } from "../context/PediatricContext";
import { User, Activity, FileText, RefreshCcw, CheckCircle, HelpCircle, ShieldCheck, Calendar, Video } from "lucide-react";
import { TeleconsultModal } from "../components/TeleconsultModal";

export const ParentPortal: React.FC = () => {
  const { getPatientById, getCaseByPatientId, specialists, requestSecondOpinion } = usePediatric();
  
  // Simulated Guardian Session for a specific child to enforce access scoping
  const activeChildId = "PT-1001";
  
  const patient = getPatientById(activeChildId);
  const activeCase = getCaseByPatientId(activeChildId);
  const assignedSpecialist = specialists.find(s => s.id === activeCase?.assignedSpecialistId);
  
  const [secondOpinionRequested, setSecondOpinionRequested] = useState(false);
  const [isTeleconsultOpen, setIsTeleconsultOpen] = useState(false);

  const handleSecondOpinion = () => {
    if (activeCase && !secondOpinionRequested) {
      requestSecondOpinion(activeCase.id);
      setSecondOpinionRequested(true);
    }
  };

  if (!patient || !activeCase) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <p className="text-slate-500 text-lg">No active records found for your child.</p>
        </div>
      </div>
    );
  }

  // Find current stage info
  const currentStageInfo = CARE_STAGES.find(s => s.stageNumber === activeCase.currentStage);

  return (
    <div className="min-h-screen bg-[#F0F7FF] font-sans text-slate-800 pb-20 selection:bg-blue-200">
      {/* Calm Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Care Portal</h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">Guardian Access for {patient.fullName}</p>
          </div>
          <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 border border-blue-100">
            <User className="w-5 h-5" />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        
        {/* Journey Tracker */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-blue-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-50 p-2 rounded-xl">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Current Care Journey</h2>
          </div>
          
          <div className="relative pl-6 pb-2 border-l-2 border-blue-100 space-y-8">
            <div className="relative">
              <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-50"></span>
              <div className="bg-blue-50 text-blue-900 px-3 py-1 rounded-full text-xs font-bold inline-block mb-2 uppercase tracking-wide">
                Stage {activeCase.currentStage} of 10
              </div>
              <h3 className="font-semibold text-slate-900 text-lg">{currentStageInfo?.name}</h3>
              <p className="text-slate-600 mt-1">{currentStageInfo?.description}</p>
              
              <div className="mt-4 bg-[#F8FAFC] p-4 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700">
                  <strong className="text-slate-900 block mb-1">What happens next:</strong>
                  The clinical team is reviewing all data and will communicate the subsequent steps directly with you. 
                </p>
              </div>
            </div>
            
            {/* Future Mock Step */}
            {activeCase.currentStage < 10 && (
              <div className="relative opacity-60">
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white"></span>
                <h3 className="font-semibold text-slate-500 text-base">Resolution & Discharge</h3>
                <p className="text-sm text-slate-500 mt-1">Final clearance and home care instructions.</p>
              </div>
            )}
          </div>
        </section>

        {/* Plain-Language Care Plan */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-blue-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-50 p-2 rounded-xl">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Treatment Plan</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-[#F8FAFC] p-5 rounded-xl border border-slate-100">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-2">
                Diagnosis & Goal
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Your child is currently being monitored for <strong>{activeCase.primaryCondition}</strong>. The primary objective today is to stabilize their condition and ensure comfort while the care team prepares the long-term plan.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-slate-100">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-slate-400" /> Upcoming Schedule & Updates
              </h3>
              <ul className="space-y-4">
                {activeCase.clinicalNotes.slice(0, 2).map(note => (
                  <li key={note.id} className="text-sm text-slate-600 flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{note.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Specialist Transparency Profile */}
        {assignedSpecialist && (
          <section className="bg-white rounded-2xl shadow-sm overflow-hidden border border-blue-50">
            <div className="bg-blue-600 p-6 sm:p-8 flex items-center gap-5">
              <img 
                src={assignedSpecialist.avatar} 
                alt={assignedSpecialist.name} 
                className="w-20 h-20 rounded-full ring-4 ring-white shadow-lg object-cover bg-blue-100 shrink-0"
              />
              <div className="text-white">
                <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Assigned Specialist</p>
                <h2 className="text-2xl font-bold">{assignedSpecialist.name}</h2>
                <p className="text-blue-100 text-sm mt-1">{assignedSpecialist.title}</p>
              </div>
              <div className="ml-auto">
                <button 
                  onClick={() => setIsTeleconsultOpen(true)}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-2 px-4 rounded-xl flex items-center shadow-md transition-colors text-sm cursor-pointer"
                >
                  <Video className="w-4 h-4 mr-2" /> Join Teleconsultation
                </button>
              </div>
            </div>

            <TeleconsultModal
              isOpen={isTeleconsultOpen}
              onClose={() => setIsTeleconsultOpen(false)}
              patientName={patient.fullName}
              specialistName={`Dr. ${assignedSpecialist.name}`}
            />
            
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100/50">
                <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Why were they selected for {patient.fullName}?
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {assignedSpecialist.rationale}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-3xl font-light text-blue-600 mb-1">{assignedSpecialist.experienceYears}</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Years Experience</div>
                </div>
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-100 text-center">
                  <div className="text-3xl font-light text-emerald-600 mb-1">{assignedSpecialist.rating}</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Outcome Score</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Second Opinion Workflow */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-purple-100 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-4 rotate-3">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Want another perspective?</h2>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
            We completely support your right to a second opinion. It's fast, free, and won't disrupt your child's current care plan.
          </p>
          
          <button 
            onClick={handleSecondOpinion}
            disabled={secondOpinionRequested}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 mx-auto transition-all ${
              secondOpinionRequested 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
            {secondOpinionRequested ? (
              <><CheckCircle className="w-5 h-5" /> Second Opinion Requested</>
            ) : (
              <><RefreshCcw className="w-5 h-5" /> Request Second Opinion</>
            )}
          </button>
          
          {secondOpinionRequested && (
            <p className="text-xs text-emerald-600 font-medium mt-4">
              Your request has been logged. A care coordinator will contact you shortly.
            </p>
          )}
        </section>

      </main>
    </div>
  );
};
