import React, { useState } from "react";
import { usePediatric, Specialist } from "../context/PediatricContext";
import { ShieldCheck, Plus, Pencil, Trash2, Users } from "lucide-react";

export const MasterDataAdminPage: React.FC = () => {
  const { specialists, addSpecialist, removeSpecialist } = usePediatric();
  const [showAddModal, setShowAddModal] = useState(false);

  const [newSpec, setNewSpec] = useState<Partial<Specialist>>({
    name: "Dr. ",
    title: "Senior Pediatrician",
    specialty: "Cardiology",
    subSpecialty: "",
    experienceYears: 10,
    activeCasesCount: 0,
    maxCapacity: 10,
    responseSlaMinutes: 30,
    matchScoreDefault: 80,
    status: "Available",
    hospitalAffiliation: "Main Network Hospital",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8
  });

  const handleAdd = () => {
    addSpecialist(newSpec as Omit<Specialist, "id">);
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-indigo-600" />
            Master Data Administration
          </h1>
          <p className="text-slate-500 mt-2">Manage the clinical specialist directory and recommendation engine weights.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded shadow-sm font-bold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" /> Add Specialist
        </button>
      </div>

      <div className="bg-white rounded border shadow-sm">
        <div className="px-6 py-4 border-b flex items-center gap-2 bg-slate-50">
          <Users className="h-5 w-5 text-slate-600" />
          <h2 className="font-bold text-slate-700">Specialist Directory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3">Name & Title</th>
                <th className="px-6 py-3">Specialty</th>
                <th className="px-6 py-3">Base Match Score</th>
                <th className="px-6 py-3">SLA (Mins)</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {specialists.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} className="h-10 w-10 rounded-full object-cover" alt="" />
                      <div>
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-xs text-slate-500">{s.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{s.specialty}</div>
                    <div className="text-xs text-slate-500">{s.subSpecialty}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-indigo-600">{s.matchScoreDefault}%</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{s.responseSlaMinutes} m</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button 
                      onClick={() => removeSpecialist(s.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Add New Specialist</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={newSpec.name} 
                  onChange={e => setNewSpec({...newSpec, name: e.target.value})}
                  className="w-full border border-slate-300 rounded p-2 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specialty</label>
                <select 
                  value={newSpec.specialty}
                  onChange={e => setNewSpec({...newSpec, specialty: e.target.value as any})}
                  className="w-full border border-slate-300 rounded p-2 focus:border-indigo-500 outline-none"
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatric Surgery">Pediatric Surgery</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Base Match Score (Recommendation Engine)</label>
                <input 
                  type="number" 
                  value={newSpec.matchScoreDefault} 
                  onChange={e => setNewSpec({...newSpec, matchScoreDefault: Number(e.target.value)})}
                  className="w-full border border-slate-300 rounded p-2 focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdd}
                  className="px-4 py-2 font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded shadow"
                >
                  Save Specialist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
