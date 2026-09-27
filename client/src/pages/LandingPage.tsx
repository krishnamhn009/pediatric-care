import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartPulse,
  BrainCircuit,
  Stethoscope,
  ArrowRight,
  X,
  Clock,
  ChevronRight,
  UserPlus,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePediatric } from "../context/PediatricContext";
import { useAuth, Role } from "../context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { LandingStaticSections } from "../components/LandingStaticSections";

// ——— small helpers ———
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20, filter: "blur(6px)" as any },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" as any },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as any },
});

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const pediatricContext = usePediatric();
  const { login } = useAuth();
  const specialists = pediatricContext?.specialists || [];

  const [selectedCondition, setSelectedCondition] = useState<
    "Cardiology" | "Neurology" | "Pediatric Surgery"
  >("Cardiology");
  const [selectedUrgency, setSelectedUrgency] = useState<
    "Moderate" | "Urgent" | "Critical"
  >("Urgent");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState("Chief Pediatrician");

  useEffect(() => {
    document.body.style.overflow = isLoginModalOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoginModalOpen]);

  const handleSimulatedLogin = (role: string) => {
    let systemRole: Role = "Pediatrician";
    let targetRoute = "/patients";
    let name = "Dr. Smith";
    if (role === "Parent / Guardian") {
      systemRole = "Parent";
      targetRoute = "/parent/dashboard";
      name = "Priya Sharma";
    } else if (role === "System Administrator") {
      systemRole = "Admin";
      targetRoute = "/admin";
      name = "Admin User";
    } else if (role === "Hospital Executive") {
      systemRole = "Executive";
      targetRoute = "/dashboard";
      name = "Sarah Jenkins";
    } else if (role === "Lead Cardiologist") {
      systemRole = "Specialist";
      targetRoute = "/specialist-workspace";
      name = "Dr. Roberts";
    } else if (role === "PICU Triage Nurse") {
      systemRole = "Nurse";
      targetRoute = "/intake";
      name = "Nurse Davis";
    }
    login({ id: "u123", name, role: systemRole });
    setIsLoginModalOpen(false);
    navigate(targetRoute);
  };

  const matchingSpecialist =
    specialists.find(s => s.specialty === selectedCondition) || specialists[0];
  const calculateMatchScore = () =>
    selectedUrgency === "Critical"
      ? 98
      : selectedUrgency === "Urgent"
        ? 92
        : 85;

  return (
    <div className="bg-background text-foreground font-sans min-h-screen overflow-hidden selection:bg-white selection:text-black">
      {/* ——— Solaris-style floating nav ——— */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      >
        <div className="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <HeartPulse className="w-4 h-4" />
            </span>
            <span className="font-semibold tracking-tight text-[15px]">
              Pediatric Care Network
            </span>
            <span className="hidden sm:inline text-[10px] tracking-[0.14em] uppercase text-muted-foreground border border-border rounded-full px-2 py-0.5 ml-1">
              Solaris
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#capabilities"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="hidden sm:inline-flex h-9 items-center rounded-full border border-white/15 px-5 text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer"
            >
              Sign in
            </button>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-semibold text-black hover:bg-white/90 transition-colors cursor-pointer"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ——— Hero: Solaris centered ——— */}
      <section className="relative pt-[120px] pb-10 px-6 overflow-hidden">
        {/* subtle grid + radial glow */}
        <div
          className="absolute inset-0 solaris-grid opacity-[0.4] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          aria-hidden
        />
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-white/[0.06] blur-[90px] pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute top-24 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-white/[0.03] blur-[60px] pointer-events-none"
          aria-hidden
        />

        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur px-3 py-1.5 text-xs font-medium"
          >
            <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="text-muted-foreground">New</span>
            <span className="h-3 w-px bg-white/10" />
            <span className="text-foreground">
              Live specialist matching engine
            </span>
            <Sparkles className="w-3 h-3 text-muted-foreground ml-1" />
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-8 max-w-[900px] text-5xl sm:text-6xl lg:text-[72px] font-bold tracking-[-0.04em] leading-[0.9] text-balance"
          >
            <span className="block text-white">Your pediatric network,</span>
            <span className="block text-white/90">ready for production.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="mt-6 max-w-[640px] text-[15px] sm:text-[17px] leading-relaxed text-muted-foreground text-balance"
          >
            Stop transferring, start delivering. From triage to subspecialist in
            under 2 minutes — coordination that scales with your growth, not
            your headcount.
          </motion.p>

          <motion.div
            {...fadeUp(0.22)}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3"
          >
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="h-11 rounded-full bg-white px-7 text-[15px] font-semibold text-black hover:bg-white/90 transition-colors inline-flex items-center gap-2 cursor-pointer shadow-[0_8px_24px_rgba(255,255,255,0.15)]"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="h-11 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur px-7 text-[15px] font-medium hover:bg-white/10 hover:border-white/20 transition-colors cursor-pointer"
            >
              Book Demo
            </button>
          </motion.div>

          <motion.div
            {...fadeUp(0.28)}
            className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> HIPAA & DPDP 2023 compliant
            · SOC 2 ready · 10-Stage Care Pipeline
          </motion.div>

          {/* ——— Dashboard preview frame — Solaris style ——— */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative mt-14 w-full max-w-[1100px]"
          >
            <div className="solaris-frame relative overflow-hidden rounded-2xl">
              {/* window chrome */}
              <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-white/15" />
                <span className="h-3 w-3 rounded-full bg-white/10" />
                <span className="h-3 w-3 rounded-full bg-white/10" />
                <span className="ml-4 text-xs tracking-wide text-muted-foreground">
                  Executive Command Center · Live
                </span>
                <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />{" "}
                  6 KPIs · 5 wards · 98.4% continuity
                </span>
              </div>

              {/* preview content — simplified mirror of ExecutiveDashboard */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-4 sm:p-6 bg-muted/20">
                {[
                  {
                    label: "Active Cases",
                    value: "42",
                    sub: "+8.6% · 7d spark",
                  },
                  { label: "Avg Match Time", value: "16.4m", sub: "SLA <30m" },
                  { label: "Continuity Rate", value: "94.2%", sub: "10-Stage" },
                  { label: "Open Alerts", value: "3", sub: "Action required" },
                  {
                    label: "PICU Occupancy",
                    value: "92%",
                    sub: "Critical · 23/25",
                  },
                  {
                    label: "Today's Revenue",
                    value: "₹83k",
                    sub: "+12% online",
                  },
                ].map(k => (
                  <div
                    key={k.label}
                    className="rounded-xl border border-white/[0.06] bg-card p-4 text-left"
                  >
                    <div className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
                      {k.label}
                    </div>
                    <div className="mt-1 text-xl font-bold tracking-tight">
                      {k.value}
                    </div>
                    <div className="mt-2 h-[28px] rounded bg-white/[0.04] border border-white/[0.04]" />
                    <div className="mt-2 text-xs text-muted-foreground">
                      {k.sub}
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden lg:grid grid-cols-[1.1fr_0.9fr] gap-3 px-6 pb-6 bg-muted/20">
                <div className="rounded-xl border border-white/[0.06] bg-card p-4">
                  <div className="text-xs font-semibold">
                    Live Ward Capacity
                  </div>
                  <div className="mt-3 space-y-2">
                    {["PICU 92%", "NICU 74%", "ER 78%"].map(w => (
                      <div key={w} className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-white"
                            style={{ width: w.split(" ")[1] }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-20 text-right">
                          {w}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-card p-4 flex flex-col justify-between">
                  <div className="text-xs font-semibold">Decision Support</div>
                  <div className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 text-xs leading-relaxed text-muted-foreground">
                    Cardiac monitoring · SLA 18m · Specialist matcher recommends{" "}
                    <span className="text-white font-medium">
                      Lead Cardiologist
                    </span>{" "}
                    — 98% match.
                  </div>
                  <div className="mt-3 inline-flex rounded-full bg-white/[0.08] border border-white/10 text-foreground px-3 py-1 text-xs font-semibold self-start">
                    Acknowledge →
                  </div>
                </div>
              </div>
            </div>
            {/* bottom fade */}
            <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 h-24 w-[80%] bg-gradient-to-t from-background to-transparent blur-xl" />
          </motion.div>
        </div>
      </section>

      {/* ——— logos marquee — Solaris companies ——— */}
      <section className="border-y border-white/[0.06] bg-white/[0.02] py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3">
          <span className="text-xs tracking-[0.14em] uppercase text-muted-foreground shrink-0">
            Trusted by pediatric networks
          </span>
          <div className="h-4 w-px bg-white/10 shrink-0" />
          <div className="flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="marquee-track gap-10 pr-10">
              {[...Array(2)]
                .flatMap(() => [
                  "Main City Hospital",
                  "North Clinic",
                  "South Campus",
                  "Metro Children’s",
                  "Valley Pediatric",
                  "Harbor Health",
                  "Lakeside Medical",
                  "Sunrise Hospital",
                ])
                .map((name, i) => (
                  <span
                    key={name + i}
                    className="shrink-0 text-sm font-semibold tracking-tight text-white/60 whitespace-nowrap"
                  >
                    {name}
                    <span className="ml-10 text-white/10">•</span>
                  </span>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ——— Live matcher bento — replaces old split ——— */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />{" "}
              Live matcher
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight text-balance">
              Route every child to the right specialist — live.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Tune specialty & urgency and watch the Solaris engine score,
              explain, and route with audit-grade rationale.
            </p>
          </div>
          <Link
            to="/recommendation"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-5 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Open Specialist Matcher <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="mt-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-4">
          {/* controls + result — solaris card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="solaris-card solaris-glow rounded-2xl p-6 lg:p-7"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                Live Match Parameters
              </h3>
              <span className="rounded-full bg-white/[0.08] text-foreground border border-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wide">
                Real-time
              </span>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3">
                  1. Pediatric Specialty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    ["Cardiology", "Neurology", "Pediatric Surgery"] as const
                  ).map(spec => (
                    <button
                      key={spec}
                      onClick={() => setSelectedCondition(spec)}
                      className={`h-11 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${selectedCondition === spec ? "bg-white text-black border-white shadow-[0_8px_24px_rgba(255,255,255,0.15)]" : "bg-white/[0.04] border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"}`}
                    >
                      {spec === "Pediatric Surgery" ? "Surgery" : spec}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">
                  2. Clinical Urgency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Moderate", "Urgent", "Critical"] as const).map(urg => (
                    <button
                      key={urg}
                      onClick={() => setSelectedUrgency(urg)}
                      className={`h-11 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${selectedUrgency === urg ? "bg-white text-black border-white shadow-[0_8px_24px_rgba(255,255,255,0.15)]" : "bg-white/[0.04] border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"}`}
                    >
                      {urg}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {matchingSpecialist && (
                <motion.div
                  key={matchingSpecialist.name + selectedUrgency}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="mt-7 rounded-xl border border-white/[0.08] bg-white/[0.04] p-5"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 min-w-0">
                      <img
                        src={matchingSpecialist.avatar}
                        alt=""
                        className="h-12 w-12 rounded-xl object-cover border border-white/10"
                      />
                      <div className="min-w-0">
                        <h4 className="font-semibold leading-tight truncate">
                          {matchingSpecialist.name}
                        </h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {matchingSpecialist.title}
                        </p>
                        <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium">
                          <Clock className="w-3 h-3" /> SLA{" "}
                          {matchingSpecialist.responseSlaMinutes} min
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-black tracking-tight">
                        {calculateMatchScore()}%
                      </div>
                      <div className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground">
                        Match Score
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground border-t border-white/10 pt-4">
                    <span className="text-foreground font-semibold">
                      Rationale:{" "}
                    </span>
                    {matchingSpecialist.rationale}
                  </p>
                  <div className="mt-4 flex justify-between items-center text-xs">
                    <span className="text-muted-foreground inline-flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5" /> Explainable
                      scoring
                    </span>
                    <Link
                      to="/recommendation"
                      className="inline-flex items-center gap-1 font-semibold hover:underline"
                    >
                      Test Engine <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* stats rail — solaris style */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { k: "140+", l: "Pediatric Specialists" },
              { k: "< 2 min", l: "Average Match" },
              { k: "98.4%", l: "Successful Outcomes" },
              { k: "24", l: "Partner Facilities" },
            ].map(s => (
              <div
                key={s.l}
                className="solaris-card rounded-2xl p-5 flex flex-col justify-between min-h-[140px]"
              >
                <div className="text-3xl font-black tracking-tight">{s.k}</div>
                <div className="text-xs tracking-[0.12em] uppercase text-muted-foreground">
                  {s.l}
                </div>
              </div>
            ))}
            <div className="col-span-2 solaris-card rounded-2xl p-5 flex items-center gap-3">
              <span className="h-8 w-8 rounded-xl bg-white text-black grid place-items-center">
                <Stethoscope className="w-4 h-4" />
              </span>
              <div className="text-sm">
                <div className="font-semibold">Command center live</div>
                <div className="text-muted-foreground text-xs">
                  Continuity engine · 10-Stage pipeline · Audit trace
                </div>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
            </div>
          </motion.div>
        </div>
      </section>

      <LandingStaticSections />

      {/* Solaris login — fixed z-index, polished dark */}
      {isLoginModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
            <motion.div
              initial={{
                opacity: 0,
                y: 16,
                scale: 0.97,
                filter: "blur(8px)" as any,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)" as any,
              }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
              className="w-full max-w-[760px] max-h-[90vh] overflow-hidden rounded-[20px] border border-white/10 bg-card shadow-[0_32px_80px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.06)_inset] grid md:grid-cols-[360px_1fr]"
            >
              {/* left — brand panel */}
              <div className="relative hidden md:flex flex-col p-7 overflow-hidden bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent">
                <div
                  className="absolute inset-0 solaris-grid opacity-20 [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]"
                  aria-hidden
                />
                <div
                  className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/[0.06] blur-3xl"
                  aria-hidden
                />
                <div className="relative flex items-center gap-2.5">
                  <span className="h-9 w-9 rounded-xl bg-white text-black grid place-items-center shadow-lg">
                    <HeartPulse className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold tracking-tight">
                      Pediatric Care Network
                    </div>
                    <div className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
                      Solaris · 10-Stage Pipeline
                    </div>
                  </div>
                </div>
                <div className="relative mt-8">
                  <h3 className="text-2xl font-bold tracking-tight leading-tight">
                    Command center for pediatric continuity.
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    One workspace for triage, matching, consult, and closure —
                    with audit-grade trace.
                  </p>
                </div>
                <div className="relative mt-6 space-y-3">
                  {[
                    {
                      t: "Avg match < 2 min",
                      d: "Explainable specialist scoring",
                    },
                    { t: "HIPAA / DPDP 2023", d: "RBAC + tamper-evident logs" },
                    {
                      t: "98.4% continuity",
                      d: "10-Stage pipeline compliance",
                    },
                  ].map(r => (
                    <div
                      key={r.t}
                      className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3"
                    >
                      <span className="h-7 w-7 rounded-lg bg-white text-black grid place-items-center shrink-0 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <div className="text-sm font-semibold leading-none">
                          {r.t}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {r.d}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative mt-auto pt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />{" "}
                  System live · Phase 1 Node
                </div>
              </div>

              {/* right — form panel */}
              <div className="flex flex-col min-h-0 bg-card md:bg-card">
                <div className="flex items-center justify-between px-6 pt-6">
                  <div className="flex items-center gap-2">
                    <span className="h-8 w-8 rounded-lg bg-white text-black grid place-items-center md:hidden">
                      <HeartPulse className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-bold tracking-tight">
                        Welcome back
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Pediatric Care Network · Solaris edition
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsLoginModalOpen(false)}
                    className="h-9 w-9 grid place-items-center rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 hover:border-white/15 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* pill tabs */}
                <div className="px-6 pt-5">
                  <div className="grid grid-cols-2 gap-1 rounded-full bg-white/[0.06] p-1 border border-white/10">
                    <button
                      onClick={() => setActiveTab("login")}
                      className={`h-9 rounded-full text-sm font-semibold transition-all cursor-pointer ${activeTab === "login" ? "bg-white text-black shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("register");
                        setSelectedRole("Parent / Guardian");
                      }}
                      className={`h-9 rounded-full text-sm font-semibold transition-all cursor-pointer ${activeTab === "register" ? "bg-white text-black shadow-md" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      Register
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto space-y-5">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                      Select Mock Role
                    </label>
                    <Select
                      value={selectedRole}
                      onValueChange={v => v && setSelectedRole(v)}
                    >
                      <SelectTrigger className="w-full h-11 rounded-xl border-white/10 bg-white/[0.04] hover:bg-white/[0.06] hover:border-white/15 focus:border-white/20 text-sm">
                        <SelectValue placeholder="Select Mock Role" />
                      </SelectTrigger>
                      <SelectContent className="z-[250]">
                        <SelectItem value="Chief Pediatrician">
                          Chief Pediatrician — Command Center
                        </SelectItem>
                        <SelectItem value="Hospital Executive">
                          Hospital Executive — Dashboards
                        </SelectItem>
                        <SelectItem value="Lead Cardiologist">
                          Lead Cardiologist — Specialist Workspace
                        </SelectItem>
                        <SelectItem value="PICU Triage Nurse">
                          PICU Triage Nurse — Intake
                        </SelectItem>
                        <SelectItem value="Parent / Guardian">
                          Parent / Guardian — Family Portal
                        </SelectItem>
                        <SelectItem value="System Administrator">
                          System Administrator — Admin
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Demo login — no password required. Role determines landing
                      workspace.
                    </p>
                  </div>

                  {selectedRole === "Parent / Guardian" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-3"
                    >
                      <h4 className="font-semibold flex items-center gap-2 text-sm">
                        <span className="h-7 w-7 rounded-lg bg-white text-black grid place-items-center">
                          <UserPlus className="w-3.5 h-3.5" />
                        </span>{" "}
                        Pre-filled Patient Data
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium tracking-wide uppercase text-muted-foreground mb-1">
                            Patient Name
                          </label>
                          <input
                            readOnly
                            value="Ishaan Menon"
                            className="w-full h-9 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium tracking-wide uppercase text-muted-foreground mb-1">
                            DOB
                          </label>
                          <div className="w-full h-9 rounded-lg border border-white/10 bg-white/[0.02] px-3 text-sm grid items-center text-muted-foreground">
                            Apr 12, 2019
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium tracking-wide uppercase text-muted-foreground mb-1">
                            Guardian Name
                          </label>
                          <input
                            readOnly
                            value="Sunita Menon"
                            className="w-full h-9 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium tracking-wide uppercase text-muted-foreground mb-1">
                            Gender
                          </label>
                          <input
                            readOnly
                            value="Male"
                            className="w-full h-9 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <button
                    onClick={() => handleSimulatedLogin(selectedRole)}
                    className="w-full h-11 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-[0_8px_24px_rgba(255,255,255,0.12)]"
                  >
                    {activeTab === "login"
                      ? "Login to Workspace"
                      : "Register & Enter"}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="w-3.5 h-3.5" /> HIPAA & DPDP 2023 ·
                    Audit trace enabled
                  </div>
                </div>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
    </div>
  );
};
