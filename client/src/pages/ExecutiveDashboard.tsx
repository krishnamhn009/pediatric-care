import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  BedDouble,
  Siren,
  Stethoscope,
  ChevronRight,
  Bell,
  TrendingUp,
  TrendingDown,
  ArrowRight
} from "lucide-react";
import { usePediatric, ExecutiveAlert } from "../context/PediatricContext";

interface WardData {
  id: string;
  name: string;
  short: string;
  occupancy: number;
  capacity: number;
  occupiedBeds: number;
  status: "Low" | "Moderate" | "High" | "Critical";
  note: string;
  color: string;
  activePatients: Array<{
    name: string;
    id: string;
    acuity: string;
    wait: string;
  }>;
}

const INITIAL_WARDS: WardData[] = [
  {
    id: "picu",
    name: "Pediatric Intensive Care (PICU)",
    short: "PICU",
    occupancy: 92,
    capacity: 25,
    occupiedBeds: 23,
    status: "Critical",
    note: "2 beds available · Cardiac & Neuro intensive monitoring",
    color: "#0891B2", // Cyan 600
    activePatients: [
      { name: "Ishaan Menon", id: "PT-1001", acuity: "Critical · Cardiac VSD", wait: "Stage 9" },
      { name: "Anaya Rao", id: "PT-1002", acuity: "Urgent · Post-Op Fever", wait: "Stage 8" },
      { name: "Rehan Sharma", id: "PT-1003", acuity: "Critical · Status Epilepticus", wait: "Stage 5" },
    ],
  },
  {
    id: "nicu",
    name: "Neonatal Intensive Care (NICU)",
    short: "NICU",
    occupancy: 74,
    capacity: 19,
    occupiedBeds: 14,
    status: "High",
    note: "3 step-down candidates identified for ward transfer",
    color: "#22D3EE", // Cyan 400
    activePatients: [
      { name: "Baby Aarohi M.", id: "PT-1008", acuity: "High · Preterm 28wk", wait: "Stage 7" },
      { name: "Baby Dev N.", id: "PT-1009", acuity: "Moderate · Respiratory", wait: "Stage 8" },
    ],
  },
  {
    id: "emergency",
    name: "Emergency & Triage Unit",
    short: "ER",
    occupancy: 78,
    capacity: 27,
    occupiedBeds: 21,
    status: "High",
    note: "2 red-tag patients · Active specialist dispatch",
    color: "#059669", // Emerald 600
    activePatients: [
      { name: "Niya Patel", id: "PT-1011", acuity: "Red Tag · Respiratory", wait: "12m" },
      { name: "Arjun V.", id: "PT-1012", acuity: "Amber Tag · Trauma", wait: "18m" },
    ],
  },
  {
    id: "opd",
    name: "Pediatric OPD & Consult",
    short: "OPD",
    occupancy: 61,
    capacity: 62,
    occupiedBeds: 38,
    status: "Moderate",
    note: "Steady flow · 4 specialty consult rooms active",
    color: "#0284C7", // Light Blue
    activePatients: [
      { name: "Kabir Joshi", id: "PT-1005", acuity: "Moderate · VSD Consult", wait: "Stage 4" },
      { name: "Tara S.", id: "PT-1014", acuity: "Routine · Follow-up", wait: "15m" },
    ],
  },
  {
    id: "wards",
    name: "General Pediatric Wards",
    short: "Wards",
    occupancy: 48,
    capacity: 118,
    occupiedBeds: 56,
    status: "Low",
    note: "Capacity available · 8 discharges projected today",
    color: "#14B8A6", // Teal 500
    activePatients: [
      { name: "Myra Joseph", id: "PT-1004", acuity: "Moderate · Bronchiolitis", wait: "Stage 9" },
      { name: "Vihaan S.", id: "PT-1016", acuity: "Low · Observation", wait: "Stage 8" },
    ],
  },
  {
    id: "imaging",
    name: "Pediatric Imaging & PACS",
    short: "PACS",
    occupancy: 67,
    capacity: 14,
    occupiedBeds: 9,
    status: "Moderate",
    note: "MRI queue at 2 · Echocardiography on schedule",
    color: "#6366F1", // Indigo 500
    activePatients: [
      { name: "Rudra K.", id: "PT-1018", acuity: "Echocardiogram", wait: "10m" },
      { name: "Nia A.", id: "PT-1019", acuity: "Chest X-Ray", wait: "05m" },
    ],
  },
];

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;
  const step = width / (data.length - 1);
  
  const points = data.map((val, i) => {
    const x = i * step;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="100%" height="100%" viewBox={`0 -5 ${width} ${height + 10}`} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        className="drop-shadow-sm"
      />
    </svg>
  );
};

export const ExecutiveDashboard: React.FC = () => {
  const { cases, alerts, acknowledgeAlert } = usePediatric();
  const [wards] = useState<WardData[]>(INITIAL_WARDS);
  const [selectedWardId, setSelectedWardId] = useState<string>("picu");
  const [acknowledgeModalAlert, setAcknowledgeModalAlert] = useState<ExecutiveAlert | null>(null);
  const [actionInput, setActionInput] = useState("");

  const activeCasesCount = cases.filter(c => c.currentStage < 10).length;
  const criticalCasesCount = cases.filter(c => c.urgency === "Critical" && c.currentStage < 10).length;
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const selectedWard = wards.find(w => w.id === selectedWardId) || wards[0];

  const handleAcknowledge = () => {
    if (!acknowledgeModalAlert || !actionInput.trim()) return;
    acknowledgeAlert(acknowledgeModalAlert.id, actionInput.trim());
    setAcknowledgeModalAlert(null);
    setActionInput("");
  };

  const kpis = [
    {
      label: "Active Cases",
      value: activeCasesCount + 14,
      subtext: "Children under care",
      variance: "+8.6%",
      positive: true,
      chartData: [10, 11, 14, 13, 15, 15, activeCasesCount + 14]
    },
    {
      label: "Avg Match Time",
      value: "16.4 m",
      subtext: "SLA target < 30m",
      variance: "-18%",
      positive: true,
      chartData: [24, 22, 23, 19, 18, 17, 16.4]
    },
    {
      label: "Critical Cases",
      value: criticalCasesCount + 2,
      subtext: "PICU / ER priority",
      variance: "High",
      positive: false,
      chartData: [4, 5, 3, 2, 4, 3, criticalCasesCount + 2]
    },
    {
      label: "Continuity Rate",
      value: "94.2%",
      subtext: "10-Stage Compliance",
      variance: "+1.2%",
      positive: true,
      chartData: [89, 90, 92, 91, 93, 94, 94.2]
    },
    {
      label: "Open Alerts",
      value: unacknowledgedAlerts.length,
      subtext: "Action required",
      variance: "Action",
      positive: unacknowledgedAlerts.length === 0,
      chartData: [6, 4, 5, 3, 2, 1, unacknowledgedAlerts.length]
    },
    {
      label: "Specialist On-call",
      value: "100%",
      subtext: "Coverage Active",
      variance: "6/6",
      positive: true,
      chartData: [85, 90, 100, 100, 100, 100, 100]
    }
  ];

  return (
    <div className="min-h-screen bg-[#ECFEFF] font-sans p-6 lg:p-12 text-[#164E63] dashboard-page-transition selection:bg-cyan-200 selection:text-cyan-900">
      <div className="mx-auto max-w-7xl space-y-12">
        
        {/* Minimal Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-cyan-200" style={{ animationDelay: "50ms" }}>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0891B2]">
              <Activity className="h-4 w-4" /> Command Center
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#164E63]">
                Executive Dashboard
              </h1>
              <select className="ml-4 mt-2 rounded-none border border-cyan-200 bg-white px-3 py-1.5 text-sm font-bold text-[#164E63] focus:border-blue-600 focus:outline-none">
                <option value="all">Consolidated Network View (All Facilities)</option>
                <option value="main">Main Hospital</option>
                <option value="north">North Clinic</option>
                <option value="south">South Campus</option>
              </select>
            </div>
          </div>
          <Link
            to="/intake"
            className="group inline-flex h-12 items-center justify-center gap-2 bg-[#059669] px-6 text-sm font-medium text-white transition-all hover:bg-emerald-700 hover:shadow-lg focus:ring-4 focus:ring-emerald-600/30 rounded-none"
          >
            New Patient Intake
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </header>

        {/* Minimal KPIs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {kpis.map((kpi, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col justify-between bg-white p-6 transition-all hover:shadow-md cursor-pointer border border-transparent hover:border-cyan-100"
              style={{ animationDelay: `${(idx + 2) * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#0891B2]/70">
                  {kpi.label}
                </span>
              </div>
              <div>
                <div className="text-4xl font-light tracking-tighter text-[#164E63]">
                  {kpi.value}
                </div>
                <div className="h-10 mt-3 w-full">
                  <Sparkline data={kpi.chartData} color={kpi.positive ? "#059669" : "#E11D48"} />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-cyan-50 pt-3">
                  <span className="text-xs text-[#164E63]/60">{kpi.subtext}</span>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                    kpi.positive ? 'text-[#059669]' : 'text-rose-600'
                  }`}>
                    {kpi.variance}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Hospital Ward Map & Acuity */}
        <div className="grid lg:grid-cols-12 gap-8 dashboard-page-transition" style={{ animationDelay: "450ms" }}>
          
          {/* Ward List */}
          <section className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#059669]"></span>
              </span>
              <h2 className="text-lg font-medium tracking-wide uppercase text-[#164E63]">
                Live Ward Capacity
              </h2>
            </div>

            <div className="space-y-3">
              {wards.map((ward, idx) => {
                const isSelected = ward.id === selectedWardId;
                return (
                  <button
                    key={ward.id}
                    onClick={() => setSelectedWardId(ward.id)}
                    className={`w-full group relative flex items-center justify-between bg-white p-4 text-left transition-all duration-300
                      ${isSelected ? "shadow-md ring-1 ring-cyan-200 scale-[1.02]" : "hover:bg-cyan-50/50 hover:scale-[1.01]"}`}
                    style={{ animationDelay: `${500 + idx * 50}ms` }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 transition-opacity" style={{ backgroundColor: ward.color, opacity: isSelected ? 1 : 0 }} />
                    
                    <div className="flex-1 px-4">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <h3 className={`text-sm font-semibold transition-colors ${isSelected ? 'text-[#0891B2]' : 'text-[#164E63]'}`}>
                            {ward.name}
                          </h3>
                          <span className="text-[10px] uppercase tracking-widest text-[#164E63]/50">
                            {ward.occupiedBeds} of {ward.capacity} Beds
                          </span>
                        </div>
                        <span className="text-lg font-light text-[#164E63]">
                          {Math.round(ward.occupancy)}%
                        </span>
                      </div>
                      
                      {/* Minimal Progress Bar */}
                      <div className="h-1 w-full bg-cyan-100 overflow-hidden">
                        <div
                          className="h-full transition-all duration-1000 ease-out"
                          style={{ width: `${Math.min(100, ward.occupancy)}%`, backgroundColor: ward.color }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Selected Ward Details */}
          <section className="lg:col-span-7">
            {selectedWard && (
              <div className="bg-white h-full p-8 transition-all animate-[dashboard-page-enter_240ms_cubic-bezier(0.23,1,0.32,1)_both]">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cyan-100 pb-6 mb-6">
                  <div>
                    <h4 className="text-2xl font-light tracking-tight text-[#164E63]">
                      {selectedWard.name}
                    </h4>
                    <p className="text-sm text-[#164E63]/60 mt-1">
                      {selectedWard.note}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-3xl font-light text-[#0891B2]">{selectedWard.occupiedBeds}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#164E63]/50">Active Patients</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedWard.activePatients.map(pt => (
                    <div key={pt.id} className="group flex items-center justify-between border-b border-cyan-50 pb-4 last:border-0 hover:bg-cyan-50/30 p-2 -mx-2 transition-colors">
                      <div>
                        <div className="text-base font-medium text-[#164E63]">{pt.name}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[11px] font-mono text-[#0891B2]">{pt.id}</span>
                          <span className="text-xs text-[#164E63]/70">{pt.acuity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-semibold text-[#164E63]/60 uppercase tracking-wider">
                          {pt.wait}
                        </span>
                        <Link
                          to={`/patients/${pt.id}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50 text-[#0891B2] transition-colors hover:bg-[#0891B2] hover:text-white"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Phase 3: Predictive Capacity Analytics */}
        <section className="dashboard-page-transition" style={{ animationDelay: "700ms" }}>
          <div className="flex items-center justify-between border-b border-cyan-200 pb-4 mb-6">
            <h2 className="text-lg font-medium tracking-wide uppercase text-[#164E63]">
              Predictive Analytics & Capacity Forecasting
            </h2>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3" /> ML Pipeline Active
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 shadow-sm border border-cyan-50 col-span-2">
              <h3 className="text-sm font-bold text-[#164E63] uppercase tracking-wider mb-4">7-Day Ward Load Forecast</h3>
              <div className="flex h-32 items-end gap-2 border-b border-l border-slate-200 p-2">
                {/* Synthetic 7-day projection data */}
                {[78, 85, 92, 98, 91, 84, 75].map((val, i) => (
                  <div key={i} className="group relative flex-1 flex flex-col justify-end">
                    <div 
                      className={`w-full transition-all duration-500 ${val > 90 ? 'bg-rose-400' : val > 80 ? 'bg-amber-400' : 'bg-cyan-400'}`} 
                      style={{ height: `${val}%` }}
                    ></div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-500">
                      Day {i + 1}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-sm text-slate-600 flex justify-between">
                <span>Current: 78% occupancy</span>
                <span className="text-rose-600 font-bold">Peak Predicted: Day 4 (98%)</span>
              </div>
            </div>

            <div className="bg-white p-6 shadow-sm border border-cyan-50">
              <h3 className="text-sm font-bold text-[#164E63] uppercase tracking-wider mb-4">Resource Constraints</h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">PICU Ventilator Availability</p>
                    <p className="text-xs text-slate-500 mt-0.5">Projected shortfall in 48h</p>
                  </div>
                  <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-bold">High Risk</span>
                </li>
                <li className="flex justify-between items-start border-t border-slate-100 pt-3">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Pediatric Surgery Staffing</p>
                    <p className="text-xs text-slate-500 mt-0.5">Surplus predicted for weekend</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">Optimal</span>
                </li>
                <li className="flex justify-between items-start border-t border-slate-100 pt-3">
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">NICU Step-down Beds</p>
                    <p className="text-xs text-slate-500 mt-0.5">Bottleneck expected Day 3</p>
                  </div>
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">Monitor</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Action Items / Alerts Feed */}
        <section className="dashboard-page-transition" style={{ animationDelay: "800ms" }}>
          <div className="flex items-center justify-between border-b border-cyan-200 pb-4 mb-6">
            <h2 className="text-lg font-medium tracking-wide uppercase text-[#164E63]">
              Decision Support
            </h2>
            {unacknowledgedAlerts.length > 0 && (
              <span className="bg-rose-100 text-rose-700 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                {unacknowledgedAlerts.length} Action Items
              </span>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {alerts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-[#164E63]/50">All systems nominal. No active alerts.</div>
            ) : (
              alerts.map((alert, idx) => {
                const isCritical = alert.severity === "critical";
                const isAmber = alert.severity === "amber";
                
                return (
                  <div 
                    key={alert.id} 
                    className={`flex flex-col justify-between p-6 bg-white transition-all duration-300 ${
                      alert.acknowledged ? "opacity-60 grayscale hover:grayscale-0" : "hover:shadow-md border border-transparent hover:border-cyan-100"
                    }`}
                    style={{ animationDelay: `${850 + idx * 50}ms` }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        {!alert.acknowledged && (
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                            isCritical ? "bg-rose-100 text-rose-700" : 
                            isAmber ? "bg-amber-100 text-amber-700" : 
                            "bg-cyan-100 text-[#0891B2]"
                          }`}>
                            {alert.severity}
                          </span>
                        )}
                        {alert.acknowledged && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#059669]">
                            <CheckCircle2 className="h-3 w-3" /> Resolved
                          </span>
                        )}
                        {alert.patientName && (
                          <span className="text-[11px] font-mono text-[#0891B2]">
                            {alert.patientId}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-[#164E63] mb-2 leading-snug">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-[#164E63]/70 line-clamp-3">
                        {alert.detail}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-cyan-50 flex items-center justify-between">
                      {alert.acknowledged ? (
                        <span className="text-[10px] uppercase tracking-widest text-[#164E63]/40">
                          By {alert.acknowledgedBy}
                        </span>
                      ) : (
                        <button
                          onClick={() => setAcknowledgeModalAlert(alert)}
                          className="text-xs font-semibold text-[#0891B2] hover:text-[#164E63] transition-colors flex items-center gap-1"
                        >
                          Acknowledge <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </div>

      {/* Acknowledge Alert Modal */}
      {acknowledgeModalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#164E63]/80 backdrop-blur-sm transition-opacity" onClick={() => setAcknowledgeModalAlert(null)}></div>
          <div className="relative w-full max-w-lg bg-white p-8 shadow-2xl animate-[dashboard-page-enter_200ms_ease-out]">
            <h3 className="text-2xl font-light text-[#164E63]">
              Acknowledge Alert
            </h3>
            <p className="text-xs text-[#164E63]/60 mt-2 uppercase tracking-wide">
              Document clinical action for audit trail
            </p>

            <div className="mt-6 bg-cyan-50 p-4 border-l-2 border-[#0891B2]">
              <div className="text-sm font-semibold text-[#164E63]">
                {acknowledgeModalAlert.title}
              </div>
              <p className="text-sm text-[#164E63]/70 mt-1">
                {acknowledgeModalAlert.detail}
              </p>
            </div>

            <div className="mt-8">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#164E63]/70 mb-2">
                Action Taken
              </label>
              <textarea
                value={actionInput}
                onChange={e => setActionInput(e.target.value)}
                placeholder="Details..."
                className="w-full min-h-[120px] border border-cyan-200 bg-transparent p-4 text-sm text-[#164E63] placeholder:text-[#164E63]/30 focus:border-[#0891B2] focus:ring-1 focus:ring-[#0891B2] focus:outline-none transition-all resize-none rounded-none"
                autoFocus
              />
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setAcknowledgeModalAlert(null)}
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#164E63]/60 hover:text-[#164E63] transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!actionInput.trim()}
                onClick={handleAcknowledge}
                className="bg-[#059669] px-8 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Log Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
