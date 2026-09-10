import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
 HeartPulse,
 BrainCircuit,
 FileHeart,
 ShieldCheck,
 Stethoscope,
 ArrowRight,
 CheckCircle2,
 Activity,
 X,
 Clock,
 ChevronRight,
 AlertTriangle,
 UserPlus
} from "lucide-react";
import { usePediatric } from "../context/PediatricContext";
import { useAuth, Role } from "../context/AuthContext";
import { LandingStaticSections } from "../components/LandingStaticSections";

export const LandingPage: React.FC = () => {
 const navigate = useNavigate();
 const pediatricContext = usePediatric();
 const { login } = useAuth();
 const specialists = pediatricContext?.specialists || [];
 
 // Hero Simulator State
 const [selectedCondition, setSelectedCondition] = useState<"Cardiology" | "Neurology" | "Pediatric Surgery">("Cardiology");
 const [selectedUrgency, setSelectedUrgency] = useState<"Moderate" | "Urgent" | "Critical">("Urgent");
 
 // Login Modal State
 const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
 const [selectedRole, setSelectedRole] = useState("Chief Pediatrician");

 // Prevent background scrolling when modal is open
 useEffect(() => {
   if (isLoginModalOpen) {
     document.body.style.overflow = 'hidden';
   } else {
     document.body.style.overflow = 'unset';
   }
   return () => {
     document.body.style.overflow = 'unset';
   };
 }, [isLoginModalOpen]);

 const matchingSpecialist = specialists.find(s => s.specialty === selectedCondition) || specialists[0];

 const calculateMatchScore = () => {
 if (!matchingSpecialist) return 96;
 let base = matchingSpecialist.matchScoreDefault;
 if (selectedUrgency === "Critical") base = Math.min(99, base + 2);
 if (selectedUrgency === "Moderate") base = Math.max(88, base - 3);
 return base;
 };

 const handleSimulatedLogin = (roleName: string) => {
 setIsLoginModalOpen(false);
 
 let userRole: Role = "Pediatrician";
 let targetPath = "/dashboard";
 
    if (roleName.includes("Executive")) { userRole = "Executive"; targetPath = "/dashboard"; }
    else if (roleName.includes("Nurse")) { userRole = "Nurse"; targetPath = "/intake"; }
    else if (roleName.includes("Pediatrician")) { userRole = "Pediatrician"; targetPath = "/dashboard"; }
    else if (roleName.includes("Cardiologist") || roleName.includes("Neurologist") || roleName.includes("Specialist")) { userRole = "Specialist"; targetPath = "/specialist-workspace"; }
    else if (roleName.includes("Parent")) { userRole = "Parent"; targetPath = "/guardian"; }
    else if (roleName.includes("Administrator")) { userRole = "Admin"; targetPath = "/admin"; }
 
 login({ id: "U1", name: roleName, role: userRole });
 navigate(targetPath);
 };

 // Scroll Animations Setup
 const containerRef = useRef(null);
 const { scrollYProgress } = useScroll({ target: containerRef });

 // Act 1: Recognition (Parallax Hero)
 const heroY = useTransform(scrollYProgress, [0, 0.2], ["0%", "50%"]);
 const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
 const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

 // Act 2: Tension (Sticky Text Assembly)
 const tensionOpacity1 = useTransform(scrollYProgress, [0.15, 0.2, 0.3], [0, 1, 0]);
 const tensionOpacity2 = useTransform(scrollYProgress, [0.22, 0.27, 0.35], [0, 1, 0]);

 // Act 3: Turn (Reveal Wipe)
 const wipeClip = useTransform(scrollYProgress, [0.35, 0.45], ["circle(0% at 50% 50%)", "circle(150% at 50% 50%)"]);

 // Act 4: Range (Lateral Scroll)
 const lateralX = useTransform(scrollYProgress, [0.55, 0.8], ["0%", "-66.66%"]);

 return (
 <>
 <div ref={containerRef} className="relative bg-slate-950 text-slate-50 font-sans hide-scrollbar dashboard-page-transition" style={{ height: "500vh" }}>
 
 {/* Global Navigation - Minimal & Premium */}
 <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference px-6 py-6 flex items-center justify-between text-white pointer-events-auto">
 <Link to="/" className="flex items-center gap-3">
 <HeartPulse className="h-6 w-6 text-white" />
 <span className="font-display font-bold tracking-tight text-lg">Pediatric Care Network</span>
 </Link>
 <div className="flex items-center gap-6 text-sm font-semibold">
 <button onClick={() => setIsLoginModalOpen(true)} className="hover:text-slate-300 transition-colors cursor-pointer">Login</button>
 <Link to="/dashboard" className="bg-white text-[#164E63] px-5 py-2.5 rounded-none hover:bg-slate-200 transition-colors">Command Center</Link>
 </div>
 </header>

 {/* Act 1: Recognition (Hero Parallax) - 0 to 0.2 */}
 <motion.div className="sticky top-0 h-screen w-full overflow-hidden bg-slate-950" style={{ opacity: heroOpacity }}>
 <motion.div 
 className="absolute inset-0 bg-cover bg-center"
 style={{ 
 backgroundImage: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop')",
 y: heroY,
 scale: heroScale
 }}
 />
 {/* Elegant dark gradient overlay instead of heavy teal */}
 <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/50 to-slate-950/90" />
 
 <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
 <motion.div 
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 1, ease: "easeOut" }}
 >
 <div className="inline-flex items-center gap-2 rounded-none border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md mb-6 shadow-2xl">
 <ShieldCheck className="h-4 w-4" />
 <span>Intelligent Specialist Matching</span>
 </div>
 <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05]">
 Right Child.<br/>
 Right Expert.<br/>
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Right Time.</span>
 </h1>
 <p className="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
 A clinical decision-support platform that ensures every child is routed to the most appropriate pediatric specialist instantly.
 </p>
 </motion.div>
 </div>
 <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#164E63]/40 animate-bounce text-sm font-semibold tracking-widest uppercase">
 Scroll to explore
 </div>
 </motion.div>

 {/* Act 2: Tension (Sticky Text Assembly) - 0.15 to 0.35 */}
 <div className="sticky top-0 h-screen w-full flex items-center justify-center bg-slate-950 px-6">
 <div className="max-w-4xl font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
 <motion.p style={{ opacity: tensionOpacity1 }} className="text-[#164E63]/60">
 Finding a pediatrician isn't the problem.
 </motion.p>
 <motion.p style={{ opacity: tensionOpacity2 }} className="text-white mt-4">
 Finding the right pediatric expert at the right time is.
 </motion.p>
 </div>
 </div>

 {/* Act 3: Turn (Reveal Wipe into Solutions) - 0.35 to 0.45 */}
 <motion.div className="sticky top-0 h-screen w-full bg-[#ECFEFF] text-[#164E63] flex items-center justify-center overflow-hidden" style={{ clipPath: wipeClip }}>
 <div className="max-w-4xl px-6 text-center">
 <AlertTriangle className="h-12 w-12 text-[#0891B2] mx-auto mb-6" />
 <h2 className="font-display text-4xl md:text-6xl font-extrabold text-[#164E63]">
 Human-in-the-loop AI
 </h2>
 <p className="mt-6 text-xl text-[#164E63]/70 font-medium leading-relaxed">
 Pediatric Care Network recommends, while the clinician decides. 
 Multi-factor matching with strict clinical governance.
 </p>
 </div>
 </motion.div>

 {/* Act 4: Range (Lateral Scroll of Pillars) - 0.55 to 0.8 */}
 <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-[#ECFEFF]">
 <motion.div className="flex w-[300vw] px-[10vw]" style={{ x: lateralX }}>
 
 <div className="w-[80vw] shrink-0 pr-[10vw]">
 <div className="bg-white rounded-none p-12 shadow-2xl shadow-slate-200/50 border border-cyan-50 h-[60vh] flex flex-col justify-center transition-transform hover:scale-[1.02] duration-500">
 <BrainCircuit className="h-12 w-12 text-[#0891B2] mb-6" />
 <h3 className="font-display text-4xl font-extrabold text-[#164E63] mb-4">Intelligent Routing</h3>
 <p className="text-[#164E63]/70 text-lg mb-8 leading-relaxed">Recommend the most suitable specialist based on condition, urgency, and outcome history.</p>
 <ul className="space-y-4 text-[#164E63] font-semibold">
 <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-emerald-500" /> Real-time capacity & SLA scoring</li>
 <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-emerald-500" /> Subspecialty expertise matching</li>
 </ul>
 </div>
 </div>

 <div className="w-[80vw] shrink-0 pr-[10vw]">
 <div className="bg-white rounded-none p-12 shadow-2xl shadow-slate-200/50 border border-cyan-50 h-[60vh] flex flex-col justify-center transition-transform hover:scale-[1.02] duration-500">
 <FileHeart className="h-12 w-12 text-[#0891B2] mb-6" />
 <h3 className="font-display text-4xl font-extrabold text-[#164E63] mb-4">Master Health Record</h3>
 <p className="text-[#164E63]/70 text-lg mb-8 leading-relaxed">A single longitudinal digital record per child covering notes, labs, imaging, and prescriptions.</p>
 <ul className="space-y-4 text-[#164E63] font-semibold">
 <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-emerald-500" /> Persistent age & allergy safety header</li>
 <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-emerald-500" /> Multi-stage clinical timeline</li>
 </ul>
 </div>
 </div>

 <div className="w-[80vw] shrink-0">
 <div className="bg-white rounded-none p-12 shadow-2xl shadow-slate-200/50 border border-cyan-50 h-[60vh] flex flex-col justify-center transition-transform hover:scale-[1.02] duration-500">
 <Activity className="h-12 w-12 text-[#0891B2] mb-6" />
 <h3 className="font-display text-4xl font-extrabold text-[#164E63] mb-4">Continuous Evaluation</h3>
 <p className="text-[#164E63]/70 text-lg mb-8 leading-relaxed">Every open case is continuously evaluated against clinical checkpoints.</p>
 <ul className="space-y-4 text-[#164E63] font-semibold">
 <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-emerald-500" /> Automated vitals threshold alerts</li>
 <li className="flex items-center gap-3"><CheckCircle2 className="h-6 w-6 text-emerald-500" /> Mandatory specialist sign-off audit</li>
 </ul>
 </div>
 </div>

 </motion.div>
 </div>

 {/* Act 5: Commitment (Live Interactive Matcher) - > 0.8 */}
 <div className="sticky top-0 h-screen w-full bg-white flex flex-col lg:flex-row items-center justify-center p-6 lg:p-24 border-t border-cyan-50">
 
 <div className="w-full lg:w-1/2 pr-0 lg:pr-12 mb-12 lg:mb-0">
 <div className="inline-flex items-center gap-2 rounded-none bg-slate-100 px-3 py-1 text-xs font-bold text-[#164E63] mb-6">
 <Stethoscope className="h-4 w-4 text-[#164E63]/60" />
 <span>Interactive Simulator</span>
 </div>
 <h2 className="font-display text-5xl lg:text-7xl font-extrabold text-[#164E63] leading-[1.05]">
 See the Engine <br/>in Action.
 </h2>
 <p className="mt-6 text-lg text-[#164E63]/70 leading-relaxed max-w-lg">
 Experience our real-time matching algorithm. Select a clinical scenario to see how we route patients.
 </p>
 <div className="mt-10 flex gap-4">
 <Link to="/intake" className="bg-[#059669] text-white px-8 py-4 rounded-none font-bold shadow-lg shadow-blue-600/20 hover:bg-[#059669] hover:shadow-blue-600/30 transition-all flex items-center gap-2">
 <UserPlus className="h-5 w-5" /> New Registration
 </Link>
 </div>
 </div>

 <div className="w-full lg:w-1/2">
 <div className="rounded-none border border-cyan-100 bg-[#ECFEFF]/50 p-8 shadow-2xl shadow-slate-200/40">
 <div className="flex items-center justify-between border-b border-cyan-100 pb-6 mb-6">
 <h3 className="font-bold text-[#164E63] uppercase tracking-wide text-sm">Live Match Parameters</h3>
 <span className="bg-cyan-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-none">Real-time</span>
 </div>
 
 <div className="space-y-6">
 <div>
 <label className="block text-sm font-bold text-[#164E63] mb-3">1. Select Pediatric Specialty</label>
 <div className="grid grid-cols-3 gap-2">
 {(["Cardiology", "Neurology", "Pediatric Surgery"] as const).map(spec => (
 <button
 key={spec}
 onClick={() => setSelectedCondition(spec)}
 className={`rounded-none px-2 py-3 text-sm font-semibold border transition-all cursor-pointer ${
 selectedCondition === spec
 ? "bg-slate-900 text-white border-slate-900 shadow-md"
 : "bg-white text-[#164E63]/70 border-cyan-100 hover:border-cyan-200 hover:bg-[#ECFEFF]"
 }`}
 >
 {spec === "Pediatric Surgery" ? "Surgery" : spec}
 </button>
 ))}
 </div>
 </div>

 <div>
 <label className="block text-sm font-bold text-[#164E63] mb-3">2. Clinical Urgency</label>
 <div className="grid grid-cols-3 gap-2">
 {(["Moderate", "Urgent", "Critical"] as const).map(urg => (
 <button
 key={urg}
 onClick={() => setSelectedUrgency(urg)}
 className={`rounded-none px-2 py-3 text-sm font-semibold border transition-all cursor-pointer ${
 selectedUrgency === urg
 ? urg === "Critical" ? "bg-red-600 text-white border-red-600"
 : urg === "Urgent" ? "bg-amber-500 text-white border-amber-500"
 : "bg-slate-900 text-white border-slate-900"
 : "bg-white text-[#164E63]/70 border-cyan-100 hover:border-cyan-200 hover:bg-[#ECFEFF]"
 }`}
 >
 {urg}
 </button>
 ))}
 </div>
 </div>
 </div>

 {matchingSpecialist && (
 <div className="mt-8 rounded-none bg-white border border-cyan-100 p-6 shadow-none border border-cyan-100">
 <div className="flex justify-between items-start">
 <div className="flex gap-4">
 <img src={matchingSpecialist.avatar} alt="Doctor" className="w-14 h-14 rounded-none object-cover ring-4 ring-slate-50" />
 <div>
 <h4 className="font-extrabold text-[#164E63] text-lg">{matchingSpecialist.name}</h4>
 <p className="text-[#164E63]/60 font-semibold text-sm">{matchingSpecialist.title}</p>
 </div>
 </div>
 <div className="text-right">
 <div className="font-display text-3xl font-black text-emerald-500">{calculateMatchScore()}%</div>
 <div className="text-[10px] font-bold uppercase text-[#164E63]/40 tracking-wider">Match Score</div>
 </div>
 </div>
 <div className="mt-4 pt-4 border-t border-cyan-50 text-sm text-[#164E63]/70 leading-relaxed">
 <span className="font-bold text-[#164E63]">Rationale: </span>
 {matchingSpecialist.rationale}
 </div>
 <div className="mt-4 pt-4 border-t border-cyan-50 flex justify-between items-center text-xs font-semibold">
 <span className="flex items-center gap-1 text-[#164E63]/60"><Clock className="w-4 h-4"/> SLA: {matchingSpecialist.responseSlaMinutes} min</span>
 <Link to="/recommendation" className="text-[#0891B2] flex items-center gap-1 hover:text-[#0891B2]">Test Engine <ChevronRight className="w-4 h-4"/></Link>
 </div>
 </div>
 )}
 </div>
 </div>

 </div>

  <LandingStaticSections />

  {/* Login Modal */}
  {isLoginModalOpen && createPortal(
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4">
  <div className="w-full max-w-md max-h-[95vh] overflow-y-auto rounded-none bg-white p-6 shadow-2xl border border-cyan-100 dashboard-page-transition">
  <div className="flex items-center justify-between border-b border-cyan-50 pb-4 mb-4">
  <div className="flex items-center gap-3">
  <div className="bg-slate-100 p-2 rounded-none text-[#164E63]"><Stethoscope className="w-6 h-6"/></div>
  <div>
  <h3 className="text-lg font-extrabold text-[#164E63]">Clinician Login</h3>
  <p className="text-xs text-[#164E63]/60">Pediatric Care Network</p>
  </div>
  </div>
  <button onClick={() => setIsLoginModalOpen(false)} className="text-[#164E63]/40 hover:bg-slate-100 p-2 rounded-none cursor-pointer"><X className="w-5 h-5"/></button>
  </div>

  <div className="space-y-3">
  <label className="block text-sm font-bold text-[#164E63]">Select Demo Role</label>
  {[
  { role: "Chief Pediatrician", desc: "Command Center & Intakes" },
  { role: "Hospital Executive", desc: "Network Dashboards" },
  { role: "Lead Cardiologist", desc: "Specialist Workspace" },
  { role: "PICU Triage Nurse", desc: "Intake & Vitals Triage" },
  { role: "Parent / Guardian", desc: "Family Portal View" },
  { role: "System Administrator", desc: "Master Data Config" },
  ].map(item => (
  <button
  key={item.role}
  onClick={() => setSelectedRole(item.role)}
  className={`w-full text-left p-3 rounded-none border-2 transition-all cursor-pointer ${
  selectedRole === item.role ? "border-blue-600 bg-cyan-50" : "border-cyan-50 bg-white hover:border-cyan-100"
  }`}
  >
  <div className="flex justify-between items-center">
  <span className="font-extrabold text-[#164E63] text-sm">{item.role}</span>
  {selectedRole === item.role && <CheckCircle2 className="w-4 h-4 text-[#0891B2]"/>}
  </div>
  <p className="text-[10px] text-[#164E63]/60 mt-0.5">{item.desc}</p>
  </button>
  ))}
  </div>

  <div className="mt-8 flex justify-end gap-3">
  <button onClick={() => setIsLoginModalOpen(false)} className="px-5 py-2.5 rounded-none text-sm font-bold text-[#164E63]/70 hover:bg-slate-100 cursor-pointer">Cancel</button>
  <button onClick={() => handleSimulatedLogin(selectedRole)} className="bg-[#059669] text-white px-6 py-2.5 rounded-none text-sm font-bold shadow-md hover:bg-[#059669] cursor-pointer">Enter Workspace</button>
  </div>
  </div>
  </div>,
  document.body
  )}
  </div>
  </>
  );
};
