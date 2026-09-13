import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserCheck, Activity, ShieldCheck, FileHeart } from "lucide-react";
import { usePediatric } from "../context/PediatricContext";

export const PatientListPage: React.FC = () => {
  const { patients, cases } = usePediatric();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(patient => 
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#164E63] flex items-center gap-2">
            <FileHeart className="w-8 h-8 text-[#0891B2]" /> Patient Directory
          </h1>
          <p className="text-sm text-[#164E63]/70 mt-1">
            Search and access longitudinal Master Health Records for all registered patients.
          </p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#164E63]/40 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-cyan-200 bg-white focus:outline-none focus:border-[#0891B2]"
          />
        </div>
      </div>

      <div className="bg-white border border-cyan-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cyan-50 border-b border-cyan-100">
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#164E63]">Patient ID</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#164E63]">Name & Age</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#164E63]">Risk Level</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#164E63]">Active Stage</th>
              <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#164E63]">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(patient => {
              const activeCase = cases.find(c => c.patientId === patient.id);
              return (
                <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm text-[#164E63]/70">{patient.id}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#164E63]">{patient.fullName}</div>
                    <div className="text-xs text-[#164E63]/60">{patient.ageYears} yrs {patient.ageMonths} mo</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                      patient.riskCategory === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                      patient.riskCategory === 'High' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {patient.riskCategory}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {activeCase ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0891B2]">
                        <Activity className="w-3.5 h-3.5" /> Stage {activeCase.currentStage}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">No active cases</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Link 
                      to={`/patients/${patient.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#059669] hover:text-emerald-700 hover:underline"
                    >
                      View Record &rarr;
                    </Link>
                  </td>
                </tr>
              );
            })}
            
            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-slate-500 font-medium">
                  No patients found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
