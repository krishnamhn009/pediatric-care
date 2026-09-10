import React, { useState } from "react";
import { usePediatric } from "../context/PediatricContext";
import { BookOpen, Search, Filter, FileText, Database, Shield } from "lucide-react";

export const KnowledgeRepositoryPage: React.FC = () => {
  const { cases } = usePediatric();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Phase 2: Only show closed, consented cases that have been de-identified
  const publishedCases = cases
    .filter(c => c.currentStage === 10)
    .map(c => ({
      ...c,
      // De-identification simulation
      patientName: "[REDACTED]",
      patientId: c.patientId.replace(/PT-/g, "ANON-"),
      dob: "[REDACTED]",
      ageText: c.ageText, // Age is retained
      guardianName: "[REDACTED]",
      guardianPhone: "[REDACTED]",
    }));

  const filteredCases = publishedCases.filter(c => 
    c.primaryCondition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.assignedSpecialistName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Database className="h-8 w-8 text-indigo-600" />
            Institutional Knowledge Repository
          </h1>
          <p className="text-slate-500 mt-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600" />
            De-identified clinical history, outcomes, and intelligence for medical education.
          </p>
        </div>
      </div>

      {/* Phase 3: Medical Education Module */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-none border border-indigo-200 shadow-sm p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-indigo-100 p-2 text-indigo-700 rounded-none"><BookOpen className="w-5 h-5"/></div>
            <h3 className="font-display font-bold text-slate-900 text-lg">Curated Teaching Sets</h3>
          </div>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            Standardized case collections designed for residents and junior doctors. Contains annotated timelines, diagnostic branching logic, and peer-reviewed treatment paths.
          </p>
          <div className="flex gap-2">
            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 font-bold">Congenital Heart Defects</span>
            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 font-bold">PICU Triage</span>
          </div>
        </div>

        <div className="bg-white rounded-none border border-amber-200 shadow-sm p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-amber-100 p-2 text-amber-700 rounded-none"><Database className="w-5 h-5"/></div>
            <h3 className="font-display font-bold text-slate-900 text-lg">Rare-Case Collections</h3>
          </div>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            High-complexity, multi-disciplinary cases isolated for institutional review. Fully de-identified and approved by Clinical Governance for academic publication.
          </p>
          <div className="flex gap-2">
            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 font-bold">Neuromuscular</span>
            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 font-bold">Neonatal Surgery</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded border shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by diagnosis, symptom, or procedure..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded border border-slate-200">
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="space-y-4">
          {filteredCases.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p>No closed cases available for the repository yet.</p>
              <p className="text-sm">Complete a clinical case to Stage 10 to publish it here.</p>
            </div>
          ) : (
            filteredCases.map(c => (
              <div key={c.id} className="border border-slate-200 rounded p-5 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded">
                        {c.patientId}
                      </span>
                      <span className="text-sm font-semibold text-slate-500">
                        Age: {c.ageText} • {c.ward}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{c.primaryCondition}</h3>
                    <p className="text-slate-600 text-sm mt-2 font-medium">Chief Complaint: {c.chiefComplaint}</p>
                  </div>
                  <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-4 py-2 rounded">
                    <FileText className="h-4 w-4" /> View Full Case
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="block text-slate-400 font-bold text-xs uppercase mb-1">Treated By</span>
                    <span className="font-semibold text-slate-800">{c.assignedSpecialistName || "Unknown"}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-bold text-xs uppercase mb-1">Risk Category</span>
                    <span className="font-semibold text-slate-800">{c.urgency}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-slate-400 font-bold text-xs uppercase mb-1">Resolution Note</span>
                    <span className="font-medium text-slate-700 italic">
                      "{c.stageHistory.find(h => h.stageNumber === 10)?.note || "Case successfully resolved and closed."}"
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
