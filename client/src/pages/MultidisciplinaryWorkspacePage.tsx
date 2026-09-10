import React, { useState } from "react";
import { usePediatric } from "../context/PediatricContext";
import { Users, FileText, CheckCircle2, MessageSquare, Video } from "lucide-react";

export const MultidisciplinaryWorkspacePage: React.FC = () => {
  const { cases, specialists, addAuditEntry, updateCaseStage, addClinicalNote } = usePediatric();
  
  // Find cases that might need MDT (e.g. Stage 7 or 8)
  const mdtCases = cases.filter(c => c.currentStage >= 6 && c.currentStage <= 9);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(mdtCases[0]?.id || null);
  const [decisionText, setDecisionText] = useState("");
  const [guardianInformed, setGuardianInformed] = useState(false);

  const selectedCase = mdtCases.find(c => c.id === selectedCaseId);

  const handlePublishDecision = () => {
    if (!selectedCaseId || !decisionText) return;
    
    addClinicalNote(
      selectedCaseId, 
      `MDT Decision Published: ${decisionText}. ${guardianInformed ? "Guardian acknowledged." : "Guardian notification pending."}`, 
      "Tumor/MDT Board"
    );
    
    // Log audit
    addAuditEntry({
      user: "Tumor Board / MDT",
      userRole: "Specialist",
      actionType: "NOTE_ADDED",
      caseId: selectedCaseId,
      summary: "Multidisciplinary team decision published.",
      details: decisionText
    });

    setDecisionText("");
    alert("MDT Decision published successfully.");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Users className="h-8 w-8 text-indigo-600" />
            Multidisciplinary Team Workspace
          </h1>
          <p className="text-slate-500 mt-2">Shared collaborative space for complex cases spanning multiple sub-specialties.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded shadow-sm font-bold flex items-center gap-2">
          <Video className="h-5 w-5" /> Convene Secure Virtual MDT Call
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded border shadow-sm p-4">
          <h2 className="font-bold text-slate-800 mb-4 border-b pb-2">MDT Queue (Complex Cases)</h2>
          <div className="space-y-3">
            {mdtCases.map(c => (
              <button 
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`w-full text-left p-3 rounded border transition ${selectedCaseId === c.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-300'}`}
              >
                <div className="font-bold text-slate-800">{c.patientName}</div>
                <div className="text-xs text-indigo-600 mt-1 font-semibold">{c.primaryCondition}</div>
              </button>
            ))}
            {mdtCases.length === 0 && <p className="text-sm text-slate-500">No active cases flagged for MDT.</p>}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedCase ? (
            <>
              <div className="bg-white rounded border shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedCase.patientName} ({selectedCase.patientId})</h2>
                    <p className="text-sm font-semibold text-slate-600">Chief Complaint: {selectedCase.chiefComplaint}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded text-xs font-bold uppercase">
                    MDT Review Required
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-4 rounded border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Assigned Specialist</h3>
                    <div className="font-semibold text-slate-800">{selectedCase.assignedSpecialistName || "None"}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Requested MDT Participants</h3>
                    <div className="font-semibold text-slate-800">Cardiology, Neurology, Surgery</div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-indigo-600" /> Document MDT Decision & Rationale
                  </h3>
                  <textarea 
                    value={decisionText}
                    onChange={e => setDecisionText(e.target.value)}
                    placeholder="Enter collaborative clinical decision, evidence considered, and updated treatment protocol..."
                    className="w-full h-32 border border-slate-300 p-3 rounded focus:ring-1 focus:ring-indigo-500 outline-none mb-4"
                  />
                  
                  <label className="flex items-center gap-2 mb-6 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={guardianInformed}
                      onChange={e => setGuardianInformed(e.target.checked)}
                      className="rounded accent-indigo-600 h-4 w-4" 
                    />
                    <span className="text-sm font-semibold text-slate-700">Guardian informed of outcome and acknowledged</span>
                  </label>

                  <button 
                    onClick={handlePublishDecision}
                    disabled={!decisionText.trim()}
                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded shadow hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    Publish Decision to Health Record
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded p-12 text-center text-slate-500">
              <Users className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h2 className="text-xl font-bold">No Case Selected</h2>
              <p>Select a case from the MDT queue to document board decisions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
