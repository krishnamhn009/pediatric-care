import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  Droplets,
  ShieldAlert,
  CalendarDays,
  Video,
  MessageCircle,
  FileText,
  FlaskConical,
  Scan,
  Upload,
  Download,
  Eye,
  Plus,
  X,
  Check,
  Clock,
  Send,
  Paperclip,
  Sparkles,
  Bot,
  ChevronRight,
  Activity,
  TrendingUp,
  Syringe,
  ShieldCheck,
  Phone,
  LogOut,
  LayoutDashboard,
  Users,
  Stethoscope,
  Search,
  MoreVertical,
  Archive,
  Pin,
  Smile,
  Mic,
  Menu,
  Star,
} from "lucide-react";
import { usePediatric, CARE_STAGES } from "../context/PediatricContext";
import { useAuth } from "../context/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { chatWithOpenRouter, buildParentSystemPrompt } from "@/lib/openRouter";
import { Loader2 } from "lucide-react";

function calcAge(dob: string) {
  const d = new Date(dob);
  const now = new Date();
  let y = now.getFullYear() - d.getFullYear();
  let m = now.getMonth() - d.getMonth();
  if (m < 0) { y--; m += 12; }
  if (now.getDate() < d.getDate()) m = Math.max(0, m - 1);
  return { y, m, text: `${y} yrs ${m} mo` };
}
function bmi(w: number, h: number) { const hh = h / 100; return +(w / (hh * hh)).toFixed(1); }

const MOCK_THREADS = [
  { id: "th-sneha", doctorId: "SPEC-NEURO-SNEHA", name: "Dr. Sneha Reddy", title: "Pediatric Neurologist", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80", last: "Thanks for reaching out — we'll review the EEG shortly.", time: "09:41", unread: 2, pinned: true, online: true },
  { id: "th-anitha", doctorId: "SPEC-CARD-01", name: "Dr. Anitha Raman", title: "Pediatric Cardiology", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80", last: "Aarav's echo looks stable. Continue follow-up in 2 weeks.", time: "Yesterday", unread: 0, pinned: false, online: false },
  { id: "th-sahan", doctorId: "SPEC-NEURO-01", name: "Dr. Sahan Perera", title: "Neurology · Epilepsy", avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80", last: "Please share the latest vitals when you can.", time: "Monday", unread: 1, pinned: false, online: true },
  { id: "th-vikram", doctorId: "SPEC-SURG-01", name: "Dr. Vikram Seth", title: "Pediatric Surgery", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80", last: "Surgery notes uploaded to vault.", time: "Sun", unread: 0, pinned: false, online: false },
  { id: "th-group", doctorId: "group", name: "Care Team — Aarav", title: "Group · 3 doctors", avatar: "", last: "Priya: Thank you, team!", time: "Sat", unread: 0, pinned: true, online: false },
];

export const ParentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    patients, cases, specialists, getPatientById, getCaseByPatientId,
    addGrowthRecord, updateVaccinationStatus, addNotification,
    getChatThread, startChatThread, addChatMessage, requestSecondOpinion,
  } = usePediatric();

  const linkedIds = useMemo(() => {
    const priya = patients.filter(p => p.guardianName === "Priya Sharma").map(p => p.id);
    if (priya.length >= 2) return priya;
    return patients.slice(0, 2).map(p => p.id);
  }, [patients]);
  const [activeChildId, setActiveChildId] = useState<string>(linkedIds[0] || "PT-2001");
  const [addChildOpen, setAddChildOpen] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildDob, setNewChildDob] = useState("");
  const [newChildGender, setNewChildGender] = useState<"Male" | "Female">("Male");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => { if (!linkedIds.includes(activeChildId) && linkedIds[0]) setActiveChildId(linkedIds[0]); }, [linkedIds, activeChildId]);

  const patient = getPatientById(activeChildId);
  const activeCase = getCaseByPatientId(activeChildId);
  const specialist = specialists.find(s => s.id === activeCase?.assignedSpecialistId) || specialists.find(s => s.id === "SPEC-NEURO-SNEHA") || specialists[0];
  const chatThread = getChatThread(activeChildId);

  useEffect(() => { if (activeChildId && !getChatThread(activeChildId)) startChatThread(activeChildId, specialist ? [specialist.id] : []); }, [activeChildId, specialist]);
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<string[]>([specialist?.id].filter(Boolean) as string[]);
  useEffect(() => { if (specialist?.id && !selectedDoctorIds.includes(specialist.id)) setSelectedDoctorIds(prev => prev.length === 0 ? [specialist.id] : prev); }, [specialist?.id]);

  const [tab, setTab] = useState("growth");
  const [logGrowthOpen, setLogGrowthOpen] = useState(false);
  const [gDate, setGDate] = useState(new Date().toISOString().slice(0, 10));
  const [gHeight, setGHeight] = useState(""); const [gWeight, setGWeight] = useState(""); const [gHead, setGHead] = useState("");
  const [vaultFilter, setVaultFilter] = useState("All");
  const [uploadCategory, setUploadCategory] = useState("Lab Reports");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatStatus, setChatStatus] = useState<"Open" | "In Follow-up" | "Resolved">("In Follow-up");
  const [videoOpen, setVideoOpen] = useState(false);
  const [secondOpen, setSecondOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const aiEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMessages, aiOpen]);
  const [localDocs, setLocalDocs] = useState<any[]>(() => {
    try { const raw = localStorage.getItem("pcn_parent_docs"); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });
  useEffect(() => { try { const toStore = localDocs.map((d: any) => ({ ...d, url: d.url?.startsWith("blob:") ? "#" : d.url })); localStorage.setItem("pcn_parent_docs", JSON.stringify(toStore)); } catch { } }, [localDocs]);
  useEffect(() => { return () => { localDocs.forEach((d: any) => { if (d.url?.startsWith("blob:")) try { URL.revokeObjectURL(d.url); } catch { } }); }; }, []);
  const [activeThreadId, setActiveThreadId] = useState<string>(() => { try { return localStorage.getItem("pcn_active_thread") || "th-sneha"; } catch { return "th-sneha"; } });
  useEffect(() => { try { localStorage.setItem("pcn_active_thread", activeThreadId); } catch { } }, [activeThreadId]);
  const [waSearch, setWaSearch] = useState("");
  const [waFilter, setWaFilter] = useState<"All" | "Unread">("All");
  const [showDoctorPicker, setShowDoctorPicker] = useState(false);

  const docs = useMemo(() => {
    const base = [...(activeCase?.documents || []), ...localDocs.filter((d: any) => d.patientId === activeChildId)];
    if (vaultFilter === "All") return base;
    return base.filter((d: any) => d.type === vaultFilter);
  }, [activeCase, localDocs, vaultFilter, activeChildId]);

  const handleAddGrowth = () => {
    if (!patient || !gHeight || !gWeight) return;
    const h = parseFloat(gHeight); const w = parseFloat(gWeight); const hc = gHead ? parseFloat(gHead) : undefined;
    const last = patient.growthRecords?.[patient.growthRecords.length - 1];
    addGrowthRecord(patient.id, { date: gDate, heightCm: h, weightKg: w, headCircumferenceCm: hc, percentileHeight: last?.percentileHeight || 55, percentileWeight: last?.percentileWeight || 65 });
    setLogGrowthOpen(false); setGHeight(""); setGWeight(""); setGHead("");
  };
  const handleUpload = (files: FileList | null, cat: string) => {
    if (!files?.[0] || !activeChildId) return;
    const f = files[0];
    const entry = { id: `DOC-${Date.now()}`, name: f.name, type: cat, url: URL.createObjectURL(f), uploadedAt: new Date().toISOString(), patientId: activeChildId, size: `${(f.size / 1024).toFixed(0)} KB`, doctor: specialist?.name || "Care Team" };
    setLocalDocs(prev => [entry, ...prev]);
    addNotification({ type: "imaging", title: "Document uploaded", message: `${f.name} added to ${patient?.fullName} vault`, patientId: activeChildId, patientName: patient?.fullName, priority: "low", actionLabel: "View Vault", actionTo: "/parent/dashboard" });
  };
  const toggleDoctor = (id: string) => setSelectedDoctorIds(prev => prev.includes(id) ? (prev.length === 1 ? prev : prev.filter(x => x !== id)) : [...prev, id]);
  const handleSendChat = () => {
    if (!chatInput.trim() || selectedDoctorIds.length === 0) return;
    const targetNames = specialists.filter(s => selectedDoctorIds.includes(s.id)).map(s => s.name).join(", ");
    addChatMessage(activeChildId, { senderId: "parent", senderName: patient?.guardianName || "Parent", senderRole: "Parent", text: chatInput.trim() });
    setChatInput("");
    const replyDoc = specialists.find(s => selectedDoctorIds.includes(s.id)) || specialist;
    setTimeout(() => { addChatMessage(activeChildId, { senderId: replyDoc.id, senderName: replyDoc.name, senderRole: replyDoc.title, text: `Thanks for reaching out (${targetNames} notified). We'll review shortly. For fever >38.5°C or breathing difficulty, use emergency contact.` }); }, 1500);
  };
  const handleWaSend = () => {
    if (!chatInput.trim()) return;
    addChatMessage(activeChildId, { senderId: "parent", senderName: patient?.guardianName || "Parent", senderRole: "Parent", text: chatInput.trim() });
    setChatInput("");
    const replyDoc = specialists.find(s => s.id === MOCK_THREADS.find(t => t.id === activeThreadId)?.doctorId) || specialist;
    setTimeout(() => { addChatMessage(activeChildId, { senderId: replyDoc.id, senderName: replyDoc.name, senderRole: replyDoc.title, text: "Got it — reviewing now. We'll update the care plan shortly." }); }, 1400);
  };

  const handleAiSend = async (text?: string) => {
    const prompt = (text ?? aiInput).trim();
    if (!prompt || aiLoading) return;
    const userMsg = { role: "user" as const, content: prompt };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput("");
    setAiLoading(true);
    try {
      const systemPrompt = buildParentSystemPrompt({ patient, activeCase, specialist, ageText: age.text });
      const apiMessages = [
        { role: "system" as const, content: systemPrompt },
        ...aiMessages.map(m => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: prompt },
      ];
      const reply = await chatWithOpenRouter(apiMessages);
      setAiMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setAiMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${e.message || "AI unavailable. Check VITE_OPENROUTER_API_KEY and try again."}` }]);
    } finally {
      setAiLoading(false);
    }
  };

  const messages = chatThread?.messages || [];
  const filteredThreads = MOCK_THREADS.filter(t => {
    if (waFilter === "Unread" && t.unread === 0) return false;
    if (waSearch && !t.name.toLowerCase().includes(waSearch.toLowerCase()) && !t.last.toLowerCase().includes(waSearch.toLowerCase())) return false;
    return true;
  });
  const activeThread = MOCK_THREADS.find(t => t.id === activeThreadId) || MOCK_THREADS[0];

  if (!patient) return <div className="min-h-screen grid place-items-center bg-background text-muted-foreground">No child selected</div>;
  const age = calcAge(patient.dob);
  const lastGrowth = patient.growthRecords?.[patient.growthRecords.length - 1];
  const curBmi = lastGrowth ? bmi(lastGrowth.weightKg, lastGrowth.heightCm) : 15.0;
  const bmiLabel = curBmi < 14 ? "Underweight" : curBmi > 17 ? "Overweight" : "Healthy / Normal";
  const chartData = (patient.growthRecords || []).map(r => ({ date: new Date(r.date).toLocaleDateString(undefined, { month: "short", year: "2-digit" }), weight: r.weightKg, height: r.heightCm, whoWeight: +(r.weightKg - 0.6).toFixed(1), whoHeight: +(r.heightCm - 1.2).toFixed(1) }));

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-card border-r border-white/10 flex flex-col transition-transform duration-300 lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-[64px] flex items-center gap-3 px-4 border-b border-white/10 shrink-0">
          <span className="h-9 w-9 rounded-xl bg-white text-black grid place-items-center shadow-md"><HeartPulse className="w-5 h-5" /></span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold tracking-tight">Pediatric Care</div>
            <div className="text-[11px] tracking-[0.12em] uppercase text-muted-foreground">Network · Guardian</div>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} className="lg:hidden rounded-full"><X className="w-4 h-4" /></Button>
        </div>
        <div className="p-3 border-b border-white/10 space-y-3">
          <div className="text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground">Your Children</div>
          <div className="flex flex-col gap-2">
            {linkedIds.map(id => {
              const p = getPatientById(id); if (!p) return null;
              const a = calcAge(p.dob); const active = id === activeChildId;
              return (
                <button key={id} onClick={() => setActiveChildId(id)} className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${active ? "bg-white text-black border-white shadow-md" : "bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/15"}`}>
                  <img src={`https://i.pravatar.cc/80?u=${p.id}`} alt={p.fullName} className="h-9 w-9 rounded-xl object-cover border border-white/10" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold truncate">{p.fullName}</div>
                    <div className={`text-xs truncate ${active ? "text-black/60" : "text-muted-foreground"}`}>{a.y} yrs · {p.gender} · {p.bloodGroup}</div>
                  </div>
                  {active && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
          <Button onClick={() => setAddChildOpen(true)} variant="outline" size="sm" className="w-full rounded-full border-white/10 bg-white/[0.04] hover:bg-white/10 gap-1"><Plus className="w-4 h-4" /> Add Child</Button>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button onClick={() => setTab("growth")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${tab === "growth" ? "bg-white text-black border-white shadow-md" : "bg-transparent border-transparent hover:bg-white/[0.06] hover:border-white/10 text-muted-foreground hover:text-foreground"}`}>
            <span className={`h-8 w-8 rounded-lg grid place-items-center shrink-0 ${tab === "growth" ? "bg-black text-white" : "bg-white/10 border border-white/10"}`}><TrendingUp className="w-4 h-4" /></span>
            <div className="min-w-0 flex-1 text-left"><div className="text-sm font-semibold leading-none truncate">Growth Tracking</div><div className={`text-xs truncate ${tab === "growth" ? "text-black/60" : "text-muted-foreground"}`}>WHO percentiles</div></div>
          </button>
          <button onClick={() => setTab("vaccination")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${tab === "vaccination" ? "bg-white text-black border-white shadow-md" : "bg-transparent border-transparent hover:bg-white/[0.06] hover:border-white/10 text-muted-foreground hover:text-foreground"}`}>
            <span className={`h-8 w-8 rounded-lg grid place-items-center shrink-0 ${tab === "vaccination" ? "bg-black text-white" : "bg-white/10 border border-white/10"}`}><Syringe className="w-4 h-4" /></span>
            <div className="min-w-0 flex-1 text-left"><div className="text-sm font-semibold leading-none truncate">Vaccination</div><div className={`text-xs truncate ${tab === "vaccination" ? "text-black/60" : "text-muted-foreground"}`}>Schedule & reminders</div></div>
          </button>
          <button onClick={() => setTab("vault")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${tab === "vault" ? "bg-white text-black border-white shadow-md" : "bg-transparent border-transparent hover:bg-white/[0.06] hover:border-white/10 text-muted-foreground hover:text-foreground"}`}>
            <span className={`h-8 w-8 rounded-lg grid place-items-center shrink-0 ${tab === "vault" ? "bg-black text-white" : "bg-white/10 border border-white/10"}`}><FileText className="w-4 h-4" /></span>
            <div className="min-w-0 flex-1 text-left"><div className="text-sm font-semibold leading-none truncate">Health Vault</div><div className={`text-xs truncate ${tab === "vault" ? "text-black/60" : "text-muted-foreground"}`}>Records & scans</div></div>
          </button>
          <button onClick={() => setTab("chat")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${tab === "chat" ? "bg-white text-black border-white shadow-md" : "bg-transparent border-transparent hover:bg-white/[0.06] hover:border-white/10 text-muted-foreground hover:text-foreground"}`}>
            <span className={`h-8 w-8 rounded-lg grid place-items-center shrink-0 ${tab === "chat" ? "bg-black text-white" : "bg-white/10 border border-white/10"}`}><MessageCircle className="w-4 h-4" /></span>
            <div className="min-w-0 flex-1 text-left"><div className="text-sm font-semibold leading-none truncate">Care Chat</div><div className={`text-xs truncate ${tab === "chat" ? "text-black/60" : "text-muted-foreground"}`}>Chat with Doctors</div></div>
          </button>
          <div className="pt-3 mt-1 border-t border-white/10">
            <div className="px-3 py-2 text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground">Quick Actions</div>
            <button onClick={() => setVideoOpen(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.04] text-sm"><Video className="w-4 h-4" /> Join Video Room</button>
            <button onClick={() => setSecondOpen(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.04] text-sm"><ShieldCheck className="w-4 h-4" /> Second Opinion</button>
          </div>
        </nav>
        <div className="p-3 border-t border-white/10 mt-auto">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 flex items-center gap-3">
            <img src={`https://i.pravatar.cc/80?u=${patient.guardianName}`} alt={patient.guardianName} className="h-9 w-9 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{user?.name || "Priya Sharma"}</div>
              <div className="text-xs text-muted-foreground truncate">{patient.guardianPhone}</div>
            </div>
            <Button variant="ghost" size="icon" aria-label="Logout" onClick={() => { logout(); navigate("/"); }} className="rounded-full h-8 w-8"><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </aside>
      {mobileNavOpen && <div onClick={() => setMobileNavOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" />}
      <div className="flex-1 min-w-0 flex flex-col lg:ml-[280px]">
        <header className="sticky top-0 z-20 h-[64px] border-b border-white/10 bg-background/80 backdrop-blur-xl flex items-center gap-3 px-4">
          <Button variant="ghost" size="icon" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)} className="lg:hidden rounded-full border border-white/10"><Menu className="w-4 h-4" /></Button>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold tracking-tight truncate">{patient.fullName} · Parent Dashboard</div>
            <div className="text-xs text-muted-foreground hidden sm:block truncate">Guardian view — all tabs persisted to localStorage, no reload needed</div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Badge variant="outline" className="rounded-full border-white/10 bg-white/[0.04] hidden sm:inline-flex">MRN {patient.id.replace("PT-", "PAT-")}</Badge>
            <Button variant="outline" size="sm" onClick={() => navigate("/")} className="rounded-full border-white/10 bg-white/[0.04]">Home</Button>
          </div>
        </header>
        <div className="flex-1 px-4 md:px-6 py-6 space-y-6 max-w-7xl w-full mx-auto">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="solaris-card rounded-2xl p-5 flex flex-col md:flex-row gap-5">
            <div className="flex gap-4 min-w-0 flex-1">
              <img src={`https://i.pravatar.cc/120?u=${patient.id}`} alt={patient.fullName} className="h-16 w-16 rounded-2xl object-cover border border-white/10" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight truncate">{patient.fullName}</h2>
                  <Badge variant="outline" className="rounded-full border-white/10 bg-white/[0.04]">{patient.gender}</Badge>
                  <Badge className="rounded-full bg-white text-black border-white"><Droplets className="w-3 h-3" /> {patient.bloodGroup}</Badge>
                  <Badge variant="outline" className="rounded-full font-mono text-xs">DOB {new Date(patient.dob).toLocaleDateString()} · {age.text}</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Guardian: {patient.guardianName} · {patient.assignedWard} · {cases.filter(c => c.patientId === patient.id).length} episodes</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {patient.allergies.filter(a => a !== "None").map(a => (
                    <Badge key={a} className="rounded-full bg-red-500/15 text-red-300 border-red-500/20" variant="outline"><ShieldAlert className="w-3 h-3" /> {a}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex md:flex-col items-center md:items-end justify-between gap-3">
              <Badge variant="outline" className="rounded-full bg-white text-black border-white">PAT-10291</Badge>
              <div className="text-xs text-muted-foreground">Emergency badges shown in soft red for safety</div>
            </div>
          </motion.div>
          <Card className="solaris-card rounded-2xl border-white/10 overflow-hidden">
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Activity className="w-4 h-4" /> Live Care Journey · {activeCase ? `Stage ${activeCase.currentStage}` : "No active episode"}</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="relative">
                <div className="grid grid-cols-5 lg:grid-cols-10 gap-3">
                  {CARE_STAGES.map(s => {
                    const active = activeCase?.currentStage === s.stageNumber; const done = activeCase ? s.stageNumber < activeCase.currentStage : false;
                    return (
                      <div key={s.stageNumber} className="flex flex-col items-center gap-1.5 text-center">
                        <div className={`h-9 w-9 rounded-xl grid place-items-center border text-xs font-bold shrink-0 transition-all ${active ? "bg-white text-black border-white shadow-md scale-110" : done ? "bg-white/10 border-white/20 text-foreground" : "bg-white/[0.04] border-white/10 text-muted-foreground"}`}>{done ? <Check className="w-4 h-4" /> : s.stageNumber}</div>
                        <div className={`text-[10px] font-semibold leading-tight line-clamp-2 min-h-[28px] ${active ? "text-foreground" : "text-muted-foreground"}`}>{s.name}</div>
                        {active && <span className="h-1 w-6 rounded-full bg-white" />}
                        {done && <span className="h-1 w-6 rounded-full bg-white/20" />}
                      </div>
                    );
                  })}
                </div>
                <div className="hidden lg:block absolute top-[18px] left-[5%] right-[5%] h-px bg-white/10 -z-10" aria-hidden />
              </div>
              {specialist && activeCase && (
                <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-4">
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 flex gap-4">
                    <img src={specialist.avatar} alt={specialist.name} className="h-14 w-14 rounded-xl object-cover border border-white/10" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{specialist.name} · <span className="text-muted-foreground font-medium">{specialist.title}</span></div>
                      <div className="text-xs text-muted-foreground">{specialist.hospitalAffiliation}</div>
                      <div className="mt-2 text-xs leading-relaxed bg-background/50 border border-white/10 rounded-lg p-2"><span className="font-semibold">Selected for:</span> {specialist.rationale}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5"><Badge className="rounded-full bg-white text-black border-white"><Video className="w-3 h-3" /> Video Consultation</Badge><Badge variant="outline" className="rounded-full">OPD Room 304 · In-Person</Badge></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-card p-4 flex flex-col justify-between gap-3">
                    <div className="text-xs tracking-[0.12em] uppercase text-muted-foreground">Consultation Mode</div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setVideoOpen(true)} className="rounded-full bg-white text-black hover:bg-white/90 gap-2"><Video className="w-4 h-4" /> Join Video Room</Button>
                      <Button variant="outline" onClick={() => setTab("chat")} className="rounded-full border-white/10 bg-white/[0.04] hover:bg-white/10 gap-2"><MessageCircle className="w-4 h-4" /> Message Care Team</Button>
                    </div>
                    <Button variant="outline" onClick={() => setSecondOpen(true)} className="rounded-full border-white/10 bg-transparent hover:bg-white/[0.04] gap-2 w-fit"><ShieldCheck className="w-4 h-4" /> Request Second Opinion</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="hidden"><TabsTrigger value="growth">Growth</TabsTrigger><TabsTrigger value="vaccination">Vaccination</TabsTrigger><TabsTrigger value="vault">Vault</TabsTrigger><TabsTrigger value="chat">Chat</TabsTrigger></TabsList>
            <TabsContent value="growth" className="mt-0 space-y-4">
              <div className="grid lg:grid-cols-3 gap-4">
                <Card className="solaris-card rounded-2xl lg:col-span-2">
                  <CardHeader className="flex-row items-center justify-between"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Height, Weight & BMI vs WHO 50th</CardTitle><Button size="sm" onClick={() => setLogGrowthOpen(true)} className="rounded-full bg-white text-black hover:bg-white/90 gap-1"><Plus className="w-4 h-4" /> Log Measurement</Button></CardHeader>
                  <CardContent>
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="date" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.1)" }} />
                          <YAxis yAxisId="left" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                          <Tooltip contentStyle={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Line yAxisId="left" type="monotone" dataKey="height" stroke="#fff" strokeWidth={2} dot={false} name="Height (cm)" />
                          <Line yAxisId="left" type="monotone" dataKey="whoHeight" stroke="rgba(255,255,255,0.4)" strokeDasharray="6 4" dot={false} name="WHO 50th Height" />
                          <Line yAxisId="right" type="monotone" dataKey="weight" stroke="#22c55e" strokeWidth={2} dot={false} name="Weight (kg)" />
                          <Line yAxisId="right" type="monotone" dataKey="whoWeight" stroke="rgba(34,197,94,0.5)" strokeDasharray="6 4" dot={false} name="WHO 50th Weight" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Dashed = WHO 50th, Solid = child. Instant update on Log.</p>
                  </CardContent>
                </Card>
                <div className="space-y-4">
                  <Card className="solaris-card rounded-2xl"><CardContent className="p-5 text-center"><div className="text-xs tracking-[0.12em] uppercase text-muted-foreground">Weight</div><div className="text-2xl font-black">{lastGrowth?.weightKg ?? 18.2} kg</div><Badge className="mt-1 rounded-full bg-white text-black border-white">65th percentile</Badge></CardContent></Card>
                  <Card className="solaris-card rounded-2xl"><CardContent className="p-5 text-center"><div className="text-xs tracking-[0.12em] uppercase text-muted-foreground">Height</div><div className="text-2xl font-black">{lastGrowth?.heightCm ?? 110} cm</div><Badge variant="outline" className="mt-1 rounded-full">55th percentile</Badge></CardContent></Card>
                  <Card className="solaris-card rounded-2xl"><CardContent className="p-5 text-center"><div className="text-xs tracking-[0.12em] uppercase text-muted-foreground">BMI</div><div className="text-2xl font-black">{curBmi}</div><Badge variant="outline" className={`mt-1 rounded-full ${bmiLabel.includes("Healthy") ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" : ""}`}>{bmiLabel}</Badge></CardContent></Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="vaccination" className="mt-0">
              <Card className="solaris-card rounded-2xl"><CardHeader><CardTitle className="text-base flex items-center gap-2"><Syringe className="w-4 h-4" /> Vaccination Schedule & Reminders</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {(patient.vaccinations || []).map(v => {
                    const s = v.status;
                    return (
                      <div key={v.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05]">
                        <div className="min-w-0"><div className="font-semibold text-sm">{v.vaccineName}</div><div className="text-xs text-muted-foreground">Due: {new Date(v.dueDate).toLocaleDateString()} {v.dateGiven ? `· Given: ${new Date(v.dateGiven).toLocaleDateString()}` : ""} {v.administeredBy ? `· ${v.administeredBy}` : ""}</div></div>
                        <div className="flex items-center gap-2 shrink-0">
                          {s === "Completed" && <Badge className="rounded-full bg-emerald-500 text-white border-emerald-500"><Check className="w-3 h-3" /> Completed</Badge>}
                          {s === "Pending" && <Badge className="rounded-full bg-amber-500/15 text-amber-300 border-amber-500/20">Due Soon</Badge>}
                          {s === "Overdue" && <Badge className="rounded-full bg-red-500/15 text-red-300 border-red-500/20">Overdue</Badge>}
                          <Button size="sm" variant={s === "Overdue" ? "default" : "outline"} className={`rounded-full h-7 text-xs ${s === "Overdue" ? "bg-white text-black hover:bg-white/90" : "border-white/10 bg-white/[0.04]"}`} onClick={() => {
                            if (s !== "Completed") updateVaccinationStatus(patient.id, v.id, s === "Overdue" ? "Completed" : s === "Pending" ? "Completed" : "Pending", new Date().toISOString());
                            else updateVaccinationStatus(patient.id, v.id, "Pending");
                          }}>{s === "Overdue" ? "Book Vaccination" : s === "Completed" ? "Mark Pending" : "Mark Completed"}</Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="vault" className="mt-0 space-y-4">
              <div className="flex flex-wrap gap-1.5">{["All", "Prescriptions", "Lab Reports", "Discharge Summaries", "Scans & Imaging"].map(f => (
                <button key={f} onClick={() => setVaultFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${vaultFilter === f ? "bg-white text-black border-white" : "bg-white/[0.04] border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"}`}>{f}</button>
              ))}</div>
              <Card onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files, uploadCategory); }} className={`solaris-card rounded-2xl border-dashed ${dragOver ? "border-white/30 bg-white/[0.06]" : "border-white/10"}`}>
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <span className="h-12 w-12 rounded-xl bg-white text-black grid place-items-center"><Upload className="w-6 h-6" /></span>
                  <div><div className="font-semibold">Upload Report / Scan</div><div className="text-xs text-muted-foreground">Drop file here or click to browse · PDF, JPG, PNG</div></div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={uploadCategory} onValueChange={v => v && setUploadCategory(v)}><SelectTrigger className="w-[200px] rounded-full border-white/10 bg-white/[0.04]"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Lab Reports">Lab Report</SelectItem><SelectItem value="Prescriptions">Prescription</SelectItem><SelectItem value="Discharge Summaries">Discharge Summary</SelectItem><SelectItem value="Scans & Imaging">Scans & Imaging</SelectItem></SelectContent>
                    </Select>
                    <input ref={fileRef} type="file" className="hidden" onChange={e => handleUpload(e.target.files, uploadCategory)} />
                    <Button onClick={() => fileRef.current?.click()} className="rounded-full bg-white text-black hover:bg-white/90 gap-2"><Upload className="w-4 h-4" /> Browse Files</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="solaris-card rounded-2xl"><CardHeader><CardTitle className="text-base">Documents · {docs.length}</CardTitle></CardHeader><CardContent className="space-y-2">
                {docs.length === 0 ? <p className="text-sm text-muted-foreground">No documents.</p> : docs.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05]">
                    <div className="flex items-center gap-3 min-w-0"><span className="h-9 w-9 rounded-lg bg-white text-black grid place-items-center shrink-0"><FileText className="w-4 h-4" /></span><div className="min-w-0"><div className="text-sm font-medium truncate">{d.name}</div><div className="text-xs text-muted-foreground truncate">{d.doctor || d.type} · {new Date(d.uploadedAt).toLocaleDateString()} · {d.size || "—"}</div></div></div>
                    <div className="flex items-center gap-1 shrink-0"><Button size="sm" variant="outline" className="rounded-full h-7 border-white/10 bg-white/[0.04]"><Eye className="w-3.5 h-3.5" /> View</Button><Button size="sm" variant="outline" className="rounded-full h-7 border-white/10 bg-white/[0.04]"><Download className="w-3.5 h-3.5" /> Download</Button></div>
                  </div>
                ))}
              </CardContent></Card>
            </TabsContent>
            <TabsContent value="chat" className="mt-0">
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-card flex h-[600px] max-h-[70vh]">
                <div className="w-[340px] shrink-0 border-r border-white/10 flex flex-col bg-background hidden md:flex">
                  <div className="h-[64px] px-3 flex items-center gap-2 border-b border-white/10 shrink-0">
                    <span className="h-8 w-8 rounded-full bg-white text-black grid place-items-center"><MessageCircle className="w-4 h-4" /></span>
                    <span className="font-semibold text-sm flex-1">Chats</span>
                    <Button size="icon" variant="ghost" aria-label="Add doctor" onClick={() => setShowDoctorPicker(v => !v)} className="rounded-full h-8 w-8 border border-white/10 bg-white/[0.04]"><Plus className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" aria-label="More options" className="rounded-full h-8 w-8"><MoreVertical className="w-4 h-4" /></Button>
                  </div>
                  <div className="p-2 space-y-2 border-b border-white/10">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input value={waSearch} onChange={e => setWaSearch(e.target.value)} placeholder="Search or start new chat" className="pl-9 rounded-full border-white/10 bg-white/[0.04] h-9 text-sm" />
                    </div>
                    <div className="flex gap-1.5">
                      {(["All", "Unread"] as const).map(f => (
                        <button key={f} onClick={() => setWaFilter(f)} className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer ${waFilter === f ? "bg-white text-black border-white" : "bg-white/[0.04] border-white/10 text-muted-foreground hover:bg-white/10"}`}>{f}</button>
                      ))}
                      <Badge variant="outline" className="ml-auto rounded-full text-xs">{filteredThreads.length} threads</Badge>
                    </div>
                    {showDoctorPicker && (
                      <div className="rounded-xl border border-white/10 bg-card p-2 space-y-1">
                        <div className="text-xs font-semibold px-1">Select doctors to add</div>
                        {specialists.slice(0, 6).map(doc => {
                          const active = selectedDoctorIds.includes(doc.id);
                          return (
                            <button key={doc.id} onClick={() => toggleDoctor(doc.id)} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg border text-left ${active ? "bg-white text-black border-white" : "bg-white/[0.04] border-white/10 hover:bg-white/10"}`}>
                              <img src={doc.avatar} alt={doc.name} className="h-6 w-6 rounded-lg object-cover" />
                              <span className="text-xs font-medium truncate flex-1">{doc.name}</span>
                              {active && <Check className="w-3 h-3" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-white/[0.06]">
                    {filteredThreads.map(t => {
                      const active = t.id === activeThreadId;
                      return (
                        <button key={t.id} onClick={() => setActiveThreadId(t.id)} className={`w-full flex gap-3 p-3 text-left hover:bg-white/[0.04] transition-colors cursor-pointer ${active ? "bg-white/[0.08]" : ""}`}>
                          {t.avatar ? <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover border border-white/10" /> : <span className="h-10 w-10 rounded-full bg-white/10 grid place-items-center border border-white/10"><Users className="w-5 h-5" /></span>}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-semibold truncate flex-1">{t.name}</span>
                              <span className="text-[11px] text-muted-foreground shrink-0">{t.time}</span>
                              {t.pinned && <Pin className="w-3 h-3 text-muted-foreground shrink-0" />}
                            </div>
                            <div className="text-xs text-muted-foreground truncate pr-2">{t.last}</div>
                            <div className="text-[11px] text-muted-foreground truncate">{t.title} {t.online && <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />online</span>}</div>
                          </div>
                          {t.unread > 0 && <span className="h-5 min-w-5 px-1 rounded-full bg-white text-black text-xs font-bold grid place-items-center shrink-0">{t.unread}</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="p-2 border-t border-white/10 flex items-center gap-2 text-xs text-muted-foreground">
                    <Archive className="w-4 h-4" /> Archived · {MOCK_THREADS.length} total
                  </div>
                </div>
                <div className="flex-1 flex flex-col min-w-0 bg-[#0f0f0f]">
                  <div className="h-[64px] px-4 flex items-center gap-3 border-b border-white/10 bg-white/[0.02] shrink-0">
                    {activeThread.avatar ? <img src={activeThread.avatar} alt={activeThread.name} className="h-9 w-9 rounded-full object-cover border border-white/10" /> : <span className="h-9 w-9 rounded-full bg-white/10 grid place-items-center"><Users className="w-5 h-5" /></span>}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold truncate flex items-center gap-1.5">{activeThread.name} {activeThread.online && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}<Star className="w-3 h-3 text-muted-foreground hidden sm:inline" /></div>
                      <div className="text-xs text-muted-foreground truncate">{activeThread.title} · {activeThread.online ? "online" : "last seen today at 09:41"}</div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1">
                      <Button variant="ghost" size="icon" aria-label="Video call" onClick={() => setVideoOpen(true)} className="rounded-full border border-white/10 bg-white/[0.04]"><Video className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" aria-label="Search" className="rounded-full"><Search className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" aria-label="More options" className="rounded-full"><MoreVertical className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04),_transparent_60%)]">
                    <div className="mx-auto w-fit px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-muted-foreground">Today</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedDoctorIds.map(id => {
                        const d = specialists.find(s => s.id === id); if (!d) return null;
                        return <Badge key={id} variant="outline" className="rounded-full bg-white text-black border-white text-xs gap-1"><Stethoscope className="w-3 h-3" /> {d.name} <button onClick={() => toggleDoctor(id)} className="ml-1 hover:text-red-500"><X className="w-3 h-3" /></button></Badge>;
                      })}
                      <Button variant="outline" size="sm" onClick={() => setShowDoctorPicker(v => !v)} className="rounded-full h-6 border-white/10 bg-white/[0.04] text-xs gap-1"><Plus className="w-3 h-3" /> Add doctor</Button>
                    </div>
                    <AnimatePresence>
                      {messages.map(m => (
                        <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.senderRole === "Parent" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[72%] rounded-2xl px-3 py-2 shadow-sm ${m.senderRole === "Parent" ? "bg-white text-black rounded-br-sm" : "bg-white/[0.08] border border-white/10 text-foreground rounded-bl-sm"}`}>
                            <div className="text-[11px] font-semibold opacity-60">{m.senderName} · {m.senderRole}</div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</div>
                            <div className="text-[11px] opacity-60 mt-1 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {m.senderRole === "Parent" && <span className="text-emerald-400">✓✓</span>}</div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 flex items-center justify-between max-w-[72%]">
                      <div className="flex items-center gap-2">
                        <span className="h-8 w-8 rounded-lg bg-white text-black grid place-items-center"><FileText className="w-4 h-4" /></span>
                        <div><div className="text-sm font-medium">Prescription · Amoxicillin 250mg</div><div className="text-xs text-muted-foreground">Dr. Sneha Reddy · 1 tablet every 8h · 7 days</div></div>
                      </div>
                      <Badge variant="outline" className="rounded-full">Attached</Badge>
                    </div>
                  </div>
                  <div className="p-3 border-t border-white/10 bg-card flex items-center gap-2">
                    <Button variant="ghost" size="icon" aria-label="Emoji" className="rounded-full hidden sm:flex border border-white/10 bg-white/[0.04]"><Smile className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" aria-label="Attach file" className="rounded-full border border-white/10 bg-white/[0.04]"><Paperclip className="w-4 h-4" /></Button>
                    <Input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleWaSend()} placeholder={`Message ${activeThread.name}…`} className="flex-1 rounded-full border-white/10 bg-white/[0.04] h-10" />
                    <Button onClick={handleWaSend} size="icon" aria-label="Send message" className="rounded-full bg-white text-black hover:bg-white/90 h-10 w-10 shrink-0"><Send className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" aria-label="Voice message" className="rounded-full border border-white/10 bg-white/[0.04] hidden sm:flex"><Mic className="w-4 h-4" /></Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        <AnimatePresence>
          {aiOpen && (
            <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} className="w-[380px] max-w-[90vw] rounded-2xl border border-white/10 bg-card shadow-[0_24px_64px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col h-[480px]">
              <div className="p-4 border-b border-white/10 flex items-center gap-3 shrink-0"><span className="h-9 w-9 rounded-xl bg-white text-black grid place-items-center"><Bot className="w-5 h-5" /></span><div className="flex-1 min-w-0"><div className="text-sm font-bold">PediaCare AI</div><div className="text-xs text-muted-foreground">Guidance for {patient.fullName} · {age.text}</div></div><Button variant="ghost" size="icon" aria-label="Close AI assistant" onClick={() => setAiOpen(false)} className="rounded-full"><X className="w-4 h-4" /></Button></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 text-xs leading-relaxed">
                  <div className="font-semibold text-foreground flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Hi {patient.guardianName?.split(" ")[0] || "there"}!</div>
                  <div className="text-muted-foreground mt-1">I have {patient.fullName}'s context: {patient.bloodGroup}, allergies {patient.allergies.join(", ")}, stage {activeCase?.currentStage} ({specialist?.name}). Ask me anything — I’ll answer with your child’s data injected.</div>
                </div>
                {aiMessages.map((m,i)=>(
                  <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                    <div className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${m.role==="user"?"bg-white text-black rounded-br-sm":"bg-white/[0.06] border border-white/10 text-foreground rounded-bl-sm"}`}>{m.content}</div>
                  </div>
                ))}
                {aiLoading && <div className="flex justify-start"><div className="bg-white/[0.06] border border-white/10 rounded-2xl rounded-bl-sm px-3 py-2 flex items-center gap-2 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Thinking with {patient.fullName}'s data…</div></div>}
                <div ref={aiEndRef} />
              </div>
              <div className="p-3 border-t border-white/10 bg-white/[0.02] space-y-2 shrink-0">
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {["Explain my child's latest blood test report","When should I take fever to emergency?","Vaccine side effects guidance"].map(chip=>(
                    <button key={chip} onClick={()=>handleAiSend(chip)} disabled={aiLoading} className="shrink-0 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 text-xs font-medium whitespace-nowrap disabled:opacity-50 cursor-pointer">{chip}</button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input value={aiInput} onChange={e=>setAiInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAiSend()} placeholder={`Ask about ${patient.fullName}…`} className="flex-1 rounded-full border-white/10 bg-white/[0.04] h-9 text-sm" disabled={aiLoading} />
                  <Button onClick={()=>handleAiSend()} disabled={!aiInput.trim()||aiLoading} size="icon" aria-label="Send to PediaCare AI" className="rounded-full bg-white text-black hover:bg-white/90 h-9 w-9 shrink-0 disabled:opacity-50"><Send className="w-4 h-4" /></Button>
                </div>
                <div className="text-[11px] text-muted-foreground text-center"><ShieldCheck className="w-3 h-3 inline mr-1" /> PediaCare AI assists with guidance. Qualified clinicians decide all medical actions.</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setAiOpen(v => !v)} className="h-14 w-14 rounded-full bg-white text-black shadow-[0_12px_32px_rgba(255,255,255,0.15)] grid place-items-center border border-white cursor-pointer">{aiOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}</motion.button>
      </div>
      <Dialog open={logGrowthOpen} onOpenChange={setLogGrowthOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-card border-white/10"><DialogHeader><DialogTitle>Log New Measurement</DialogTitle><DialogDescription>Updates chart immediately.</DialogDescription></DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2"><Label>Date</Label><Input type="date" value={gDate} onChange={e => setGDate(e.target.value)} className="rounded-xl border-white/10 bg-white/[0.04]" /></div>
            <div><Label>Height (cm)</Label><Input type="number" value={gHeight} onChange={e => setGHeight(e.target.value)} placeholder="110" className="rounded-xl border-white/10 bg-white/[0.04]" /></div>
            <div><Label>Weight (kg)</Label><Input type="number" value={gWeight} onChange={e => setGWeight(e.target.value)} placeholder="18.2" className="rounded-xl border-white/10 bg-white/[0.04]" /></div>
            <div className="col-span-2"><Label>Head Circumference — optional</Label><Input type="number" value={gHead} onChange={e => setGHead(e.target.value)} placeholder="50" className="rounded-xl border-white/10 bg-white/[0.04]" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setLogGrowthOpen(false)} className="rounded-full border-white/10">Cancel</Button><Button onClick={handleAddGrowth} className="rounded-full bg-white text-black hover:bg-white/90">Save Measurement</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl bg-card border-white/10">
          <div className="aspect-video rounded-xl bg-black grid place-items-center border border-white/10 relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent" /><div className="relative text-center"><span className="h-14 w-14 rounded-xl bg-white text-black grid place-items-center mx-auto"><Video className="w-7 h-7" /></span><div className="mt-3 text-sm font-semibold">Simulated Teleconsultation</div><div className="text-xs text-muted-foreground">Joining {specialist.name} · OPD Room 304</div></div></div>
          <DialogFooter><Button variant="outline" onClick={() => setVideoOpen(false)} className="rounded-full border-white/10">Leave Room</Button><Button onClick={() => setVideoOpen(false)} className="rounded-full bg-white text-black hover:bg-white/90">End Call</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={secondOpen} onOpenChange={setSecondOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-card border-white/10"><DialogHeader><DialogTitle>Request Second Opinion?</DialogTitle><DialogDescription>Independent review with no penalty.</DialogDescription></DialogHeader><div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-muted-foreground">Reviewed by senior clinician outside current team. Update within 24h.</div><DialogFooter><Button variant="outline" onClick={() => setSecondOpen(false)} className="rounded-full border-white/10">Cancel</Button><Button onClick={() => { if (activeCase) requestSecondOpinion(activeCase.id); setSecondOpen(false); addNotification({ type: "consult", title: "Second opinion requested", message: `Independent review requested for ${patient.fullName}`, patientId: patient.id, patientName: patient.fullName, priority: "high" }); }} className="rounded-full bg-white text-black hover:bg-white/90">Confirm Request</Button></DialogFooter></DialogContent>
      </Dialog>
      <Dialog open={addChildOpen} onOpenChange={setAddChildOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-card border-white/10"><DialogHeader><DialogTitle>Add Child</DialogTitle><DialogDescription>Register a new child linked to {user?.name || "Priya Sharma"}.</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2"><div><Label>Full Name</Label><Input value={newChildName} onChange={e => setNewChildName(e.target.value)} placeholder="e.g., Aarav Sharma" className="rounded-xl border-white/10 bg-white/[0.04]" /></div><div><Label>Date of Birth</Label><Input type="date" value={newChildDob} onChange={e => setNewChildDob(e.target.value)} className="rounded-xl border-white/10 bg-white/[0.04]" /></div><div><Label>Gender</Label><Select value={newChildGender} onValueChange={v => v && setNewChildGender(v as any)}><SelectTrigger className="rounded-xl border-white/10 bg-white/[0.04]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select></div></div>
          <DialogFooter><Button variant="outline" onClick={() => setAddChildOpen(false)} className="rounded-full border-white/10">Cancel</Button><Button onClick={() => { if (!newChildName || !newChildDob) return; const dob = new Date(newChildDob); const now = new Date(); let y = now.getFullYear() - dob.getFullYear(); let m = now.getMonth() - dob.getMonth(); if (m < 0) { y--; m += 12; } const id = `PT-${Date.now().toString().slice(-4)}`; const newPat = { id, fullName: newChildName, dob: newChildDob, ageYears: Math.max(0, y), ageMonths: Math.max(0, m), gender: newChildGender, bloodGroup: "O+", allergies: ["None"], guardianName: user?.name || "Priya Sharma", guardianRelation: "Mother", guardianPhone: "+91 98765 43210", insuranceId: `HDFC-${Date.now().toString().slice(-4)}`, consentSigned: true, consentTimestamp: new Date().toISOString(), medicalHistory: [], riskCategory: "Low" as const, assignedWard: "OPD" as const, vaccinations: [], growthRecords: [] }; const saved = JSON.parse(localStorage.getItem("pcn_patients") || "[]"); localStorage.setItem("pcn_patients", JSON.stringify([newPat, ...saved])); location.reload(); }} className="rounded-full bg-white text-black hover:bg-white/90">Add Child</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
