import React, { useState } from "react";
import { usePediatric, CARE_STAGES } from "../context/PediatricContext";
import { User, Activity, FileText, RefreshCcw, CheckCircle, HelpCircle, ShieldCheck, Calendar, Video, Home, FileUp, Pill, Clock, LayoutDashboard, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TeleconsultModal } from "../components/TeleconsultModal";
import { QuickChat } from "../components/QuickChat";
import { AIHelperBot } from "../components/AIHelperBot";

export const ParentPortal: React.FC = () => {
  const { getPatientById, getCaseByPatientId, specialists, requestSecondOpinion } = usePediatric();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const activeChildId = "PT-1001";
  
  const patient = getPatientById(activeChildId);
  const activeCase = getCaseByPatientId(activeChildId);
  const assignedSpecialist = specialists.find(s => s.id === activeCase?.assignedSpecialistId);
  
  const [secondOpinionRequested, setSecondOpinionRequested] = useState(false);
  const [isTeleconsultOpen, setIsTeleconsultOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

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

  const currentStageInfo = CARE_STAGES.find(s => s.stageNumber === activeCase.currentStage);

  return (
    <div className="min-h-screen bg-[#F0F7FF] font-sans text-slate-800 flex flex-col md:flex-row selection:bg-blue-200">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-blue-100 shadow-sm md:min-h-screen flex flex-col">
        <div className="p-6 border-b border-blue-50">
          <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">Care Portal</h1>
          <p className="text-xs text-blue-600 font-semibold mt-1 uppercase tracking-wider">Patient Dashboard</p>
        </div>
        
        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {[
            { id: "overview", icon: <LayoutDashboard className="w-5 h-5"/>, label: "Overview" },
            { id: "profile", icon: <User className="w-5 h-5"/>, label: "My Profile" },
            { id: "documents", icon: <FileUp className="w-5 h-5"/>, label: "Reports" },
            { id: "careteam", icon: <ShieldCheck className="w-5 h-5"/>, label: "Care Team & Chat" },
            { id: "prescriptions", icon: <Pill className="w-5 h-5"/>, label: "Prescriptions" },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap md:whitespace-normal cursor-pointer ${
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-blue-50 hidden md:block">
          <button 
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-3 bg-blue-50 p-3 rounded-xl hover:bg-red-50 hover:text-red-700 transition-colors group cursor-pointer text-left"
          >
            <div className="bg-blue-600 group-hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold transition-colors">
              {patient.guardianName.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-slate-900 group-hover:text-red-700 truncate transition-colors">{patient.guardianName}</p>
              <p className="text-xs text-slate-500 group-hover:text-red-500 truncate transition-colors">Click to Logout</p>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Header context */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{patient.fullName}</h2>
              <p className="text-slate-500 font-medium">Patient ID: {patient.id} • {patient.ageYears} yrs • {patient.gender}</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm border border-emerald-100 flex items-center gap-2">
              <Activity className="w-4 h-4"/>
              Status: Stage {activeCase.currentStage}
            </div>
          </div>

          {/* Tab Content: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="bg-white rounded-2xl shadow-sm p-6 border border-blue-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-50 p-2 rounded-xl"><Activity className="w-5 h-5 text-blue-600" /></div>
                  <h3 className="text-lg font-semibold text-slate-900">Care Journey</h3>
                </div>
                <div className="relative pl-6 pb-2 border-l-2 border-blue-100 space-y-6">
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-50"></span>
                    <h4 className="font-semibold text-slate-900">{currentStageInfo?.name}</h4>
                    <p className="text-sm text-slate-600 mt-1">{currentStageInfo?.description}</p>
                  </div>
                  {activeCase.currentStage < 10 && (
                    <div className="relative opacity-50">
                      <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-300 ring-4 ring-white"></span>
                      <h4 className="font-semibold text-slate-500 text-sm">Resolution & Discharge</h4>
                    </div>
                  )}
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-sm p-6 border border-blue-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-50 p-2 rounded-xl"><FileText className="w-5 h-5 text-emerald-600" /></div>
                  <h3 className="text-lg font-semibold text-slate-900">Treatment Plan</h3>
                </div>
                <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-100 mb-4">
                  <h4 className="font-semibold text-sm text-slate-900 mb-1">Diagnosis</h4>
                  <p className="text-slate-700 text-sm">{activeCase.primaryCondition}</p>
                </div>
                <h4 className="font-semibold text-sm text-slate-900 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> Recent Updates</h4>
                <ul className="space-y-3">
                  {activeCase.clinicalNotes.slice(0, 2).map(note => (
                    <li key={note.id} className="text-sm text-slate-600 flex items-start gap-3 bg-white p-3 border border-slate-100 rounded-lg">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                      <span>{note.text}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {/* Tab Content: PROFILE */}
          {activeTab === "profile" && (
            <section className="bg-white rounded-2xl shadow-sm p-6 border border-blue-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-50 p-2 rounded-xl"><Settings className="w-5 h-5 text-blue-600" /></div>
                <h3 className="text-lg font-semibold text-slate-900">Patient Details</h3>
              </div>
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                    <input type="text" defaultValue={patient.fullName} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth</label>
                    <input type="date" defaultValue={patient.dob} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Blood Group</label>
                    <input type="text" defaultValue={patient.bloodGroup} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Known Allergies</label>
                    <input type="text" defaultValue={patient.allergies.join(", ")} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <hr className="border-gray-100" />
                <h4 className="font-semibold text-slate-900">Guardian Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Guardian Name</label>
                    <input type="text" defaultValue={patient.guardianName} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Number</label>
                    <input type="text" defaultValue={patient.guardianPhone} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Tab Content: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <section className="bg-white rounded-2xl shadow-sm p-6 border border-blue-50 flex flex-col items-center justify-center border-dashed border-2 border-blue-200 bg-blue-50/30">
                <FileUp className="w-12 h-12 text-blue-400 mb-3" />
                <h3 className="text-lg font-bold text-blue-900 mb-1">Upload Medical Report</h3>
                <p className="text-sm text-slate-500 mb-4 text-center max-w-sm">Upload past prescriptions, lab results, or imaging reports to share with the care team.</p>
                <label className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition shadow-md">
                  Browse Files
                  <input type="file" className="hidden" />
                </label>
              </section>
              
              <section className="bg-white rounded-2xl shadow-sm p-6 border border-blue-50">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Previous Uploads</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FileText className="w-5 h-5"/></div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">Previous_Echo_Report.pdf</p>
                        <p className="text-xs text-slate-500">Uploaded on Sept 01, 2026</p>
                      </div>
                    </div>
                    <button className="text-blue-600 text-sm font-semibold hover:underline">View</button>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Tab Content: CARE TEAM & CHAT */}
          {activeTab === "careteam" && (
            <div className="space-y-6">
              {assignedSpecialist && (
                <section className="bg-white rounded-2xl shadow-sm overflow-hidden border border-blue-50">
                  <div className="bg-blue-600 p-6 flex items-center gap-5">
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
                    <div className="ml-auto hidden sm:block">
                      <button 
                        onClick={() => setIsTeleconsultOpen(true)}
                        className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-2 px-4 rounded-xl flex items-center shadow-md transition-colors text-sm cursor-pointer"
                      >
                        <Video className="w-4 h-4 mr-2" /> Teleconsult
                      </button>
                    </div>
                  </div>
                  
                  <TeleconsultModal
                    isOpen={isTeleconsultOpen}
                    onClose={() => setIsTeleconsultOpen(false)}
                    patientName={patient.fullName}
                    specialistName={`Dr. ${assignedSpecialist.name}`}
                  />
                  
                  <div className="p-6">
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 mb-4">
                      <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-blue-600" /> AI Selection Rationale
                      </h3>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {assignedSpecialist.rationale}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={handleSecondOpinion}
                        disabled={secondOpinionRequested}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                          secondOpinionRequested 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                        }`}
                      >
                        {secondOpinionRequested ? "Second Opinion Logged" : "Request Second Opinion"}
                      </button>
                    </div>
                  </div>
                </section>
              )}

              <QuickChat
                patientId={patient.id}
                currentUserId="U1"
                currentUserName={patient.guardianName}
                currentUserRole="Parent"
              />
            </div>
          )}

          {/* Tab Content: PRESCRIPTIONS & APPOINTMENTS */}
          {activeTab === "prescriptions" && (
            <div className="space-y-6">
              <section className="bg-white rounded-2xl shadow-sm p-6 border border-blue-50 flex flex-col md:flex-row gap-6 justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div>
                  <h3 className="text-xl font-bold mb-1">Book Follow-up Appointment</h3>
                  <p className="text-blue-100 text-sm">Schedule your next consultation with the specialist.</p>
                </div>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold whitespace-nowrap shadow-md hover:bg-blue-50 transition-colors flex items-center gap-2">
                  <Calendar className="w-5 h-5"/> Schedule Now
                </button>
              </section>

              <section className="bg-white rounded-2xl shadow-sm p-6 border border-blue-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-amber-50 p-2 rounded-xl"><Pill className="w-5 h-5 text-amber-600" /></div>
                  <h3 className="text-lg font-semibold text-slate-900">Active Prescriptions</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { meds: "Amoxicillin 250mg", dose: "1 tablet every 8 hours", duration: "7 days", doc: "Dr. Anitha Raman" },
                    { meds: "Ibuprofen Syrup", dose: "5ml as needed for fever", duration: "3 days", doc: "Dr. Anitha Raman" }
                  ].map((rx, i) => (
                    <div key={i} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <h4 className="font-bold text-slate-900">{rx.meds}</h4>
                        <p className="text-sm text-slate-600 mt-1">{rx.dose} • {rx.duration}</p>
                        <p className="text-xs text-slate-400 mt-2">Prescribed by {rx.doc}</p>
                      </div>
                      <button className="text-blue-600 text-sm font-semibold border border-blue-200 bg-white px-4 py-2 rounded-lg hover:bg-blue-50">
                        Request Refill
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

        </div>
        
        <AIHelperBot />
      </main>
    </div>
  );
};
