"use client";

import { useMemo, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import FollowUpClosure from "../components/FollowUpClosure";
import {
 Activity,
 AlertTriangle,
 ArrowRight,
 Bell,
 CheckCircle2,
 ClipboardList,
 Clock3,
 CalendarDays,
 Droplets,
 FileHeart,
 FileImage,
 FileText,
 FlaskConical,
 Heart,
 HeartPulse,
 LayoutDashboard,
 Menu,
 Moon,
 ShieldCheck,
 Siren,
 Stethoscope,
 Sun,
 UserCheck,
 UsersRound,
 X,
} from "lucide-react";

type SectionKey = "patients" | "record" | "alerts";
const sections = [
 { href: "/", label: "Command center", icon: LayoutDashboard },
 { href: "/patients", label: "Active cases", icon: ClipboardList },
 { href: "/alerts", label: "Alert management", icon: Siren },
];
const content: Record<
 SectionKey,
 {
 eyebrow: string;
 title: string;
 description: string;
 accent: string;
 metric: string;
 metricLabel: string;
 items: Array<{
 icon: typeof Activity;
 title: string;
 detail: string;
 value: string;
 tone: string;
 href?: string;
 }>;
 }
> = {
 patients: {
 eyebrow: "Clinical workflow · Active cases",
 title: "Active cases",
 description:
 "Review all children currently receiving care and open their longitudinal health record.",
 accent: "#2463EB",
 metric: "18",
 metricLabel: "active cases",
 items: [
 {
 icon: HeartPulse,
 title: "Ishaan Menon",
 detail: "PICU · Critical cardiac care",
 value: "MC-H-240318-074",
 tone: "rose",
 href: "/patients/MC-H-240318-074",
 },
 {
 icon: HeartPulse,
 title: "Anaya Rao",
 detail: "PICU · High post-operative care",
 value: "MC-H-250221-119",
 tone: "amber",
 href: "/patients/MC-H-250221-119",
 },
 {
 icon: ShieldCheck,
 title: "Rehan S.",
 detail: "PICU · Critical neurological care",
 value: "MC-H-2609-073",
 tone: "green",
 href: "/patients/MC-H-2609-073",
 },
 ],
 },
 record: {
 eyebrow: "Longitudinal record · Patient context",
 title: "Master health record",
 description:
 "Review the patient banner, timeline, documents, PACS studies, and consent history in one place.",
 accent: "#0E9F6E",
 metric: "42",
 metricLabel: "records updated today",
 items: [
 {
 icon: Activity,
 title: "Overview",
 detail:
 "Alerts, allergies, age, active care team, and current risk signals.",
 value: "Open overview",
 tone: "green",
 },
 {
 icon: Clock3,
 title: "Timeline",
 detail: "Chronological visits, vitals history, notes, and referrals.",
 value: "18 events",
 tone: "blue",
 },
 {
 icon: FileText,
 title: "Documents / PACS",
 detail: "Laboratory reports and mock DICOM imaging viewer.",
 value: "6 documents",
 tone: "violet",
 },
 ],
 },
 alerts: {
 eyebrow: "Clinical intelligence · Live queue",
 title: "Alert management",
 description:
 "Monitor and triage clinical alerts before a checkpoint breach becomes harm.",
 accent: "#B7791F",
 metric: "04",
 metricLabel: "open alerts",
 items: [
 {
 icon: Siren,
 title: "Critical attention",
 detail: "SLA breached cases requiring immediate leadership review.",
 value: "01 case",
 tone: "rose",
 },
 {
 icon: AlertTriangle,
 title: "At-risk checkpoints",
 detail: "Treatment, follow-up, and monitoring stages trending late.",
 value: "03 cases",
 tone: "amber",
 },
 {
 icon: CheckCircle2,
 title: "System compliance",
 detail: "Overall checkpoint satisfaction across the hospital network.",
 value: "89% satisfied",
 tone: "green",
 },
 ],
 },
};

function cn(...classes: Array<string | false | null | undefined>) {
 return classes.filter(Boolean).join(" ");
}
function Logo({ accent }: { accent: string }) {
 return (
 <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.18)]">
 <div className="absolute inset-[5px] rounded-[10px] border border-white/15" />
 <Heart
 className="relative h-[18px] w-[18px] fill-white text-white"
 strokeWidth={1.9}
 />
 <span
 className="absolute right-[5px] top-[5px] h-1.5 w-1.5 rounded-none"
 style={{ backgroundColor: accent }}
 />
 </div>
 );
}

type RecordTab = "overview" | "timeline" | "documents" | "reports";

function MasterHealthRecord({ id }: { id: string }) {
 const [tab, setTab] = useState<RecordTab>("overview");
 const tabs: Array<{ key: RecordTab; label: string }> = [
 { key: "overview", label: "Overview" },
 { key: "timeline", label: "Timeline" },
 { key: "documents", label: "Documents" },
 { key: "reports", label: "Reports" },
 ];
 const timeline = [
 {
 type: "Clinical note",
 time: "Today · 09:40",
 title: "PICU morning review",
 detail:
 "Respiratory effort improved overnight. Continue cardiac monitoring and reassess fluid balance at noon.",
 icon: FileText,
 tone: "blue",
 },
 {
 type: "Laboratory result",
 time: "Today · 07:15",
 title: "Complete blood count",
 detail:
 "Haemoglobin 10.8 g/dL · WBC 11.2 ×10⁹/L · Platelets 244 ×10⁹/L. Reviewed by Dr. Anitha.",
 icon: FlaskConical,
 tone: "amber",
 },
 {
 type: "Imaging",
 time: "Yesterday · 16:30",
 title: "Chest X-ray · AP portable",
 detail:
 "Imaging placeholder · Mild bilateral perihilar opacities; no pleural effusion reported.",
 icon: FileImage,
 tone: "violet",
 },
 {
 type: "Clinical note",
 time: "Yesterday · 11:05",
 title: "Cardiology consultation",
 detail:
 "Echo findings discussed with guardian. Continue current plan; repeat imaging if oxygen requirement rises.",
 icon: Activity,
 tone: "green",
 },
 ];
 const tone = {
 blue: "bg-cyan-50 text-[#0891B2] ",
 amber:
 "bg-amber-50 text-amber-700 ",
 violet:
 "bg-violet-50 text-violet-700 ",
 green:
 "bg-emerald-50 text-emerald-700 ",
 };

 return (
 <section className="space-y-5">
 <div className="overflow-hidden rounded-none border border-cyan-200/80 bg-white shadow-[0_10px_28px_rgba(30,48,75,0.06)] /[0.045]">
 <div className="border-b border-blue-100 bg-[linear-gradient(120deg,#0B3772,#1559A7)] px-5 py-5 text-white sm:px-6">
 <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
 <div>
 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-50">
 <FileHeart className="h-3.5 w-3.5" /> Longitudinal patient
 record
 </div>
 <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-0.05em]">
 Ishaan Menon
 </h2>
 <p className="mt-1 text-[11px] font-semibold text-cyan-50">
 Patient ID: {id} · Main City Hospital
 </p>
 </div>
 <span className="w-fit rounded-none bg-rose-400/20 px-3 py-1.5 text-[10px] font-bold text-rose-100 ring-1 ring-rose-200/30">
 Active alert · Cardiac monitoring
 </span>
 </div>
 </div>
 <dl className="grid divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0 ">
 <div className="p-4">
 <dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#164E63]/40">
 Patient ID
 </dt>
 <dd className="mt-1 text-[11px] font-bold text-[#164E63]/90 ">
 {id}
 </dd>
 </div>
 <div className="p-4">
 <dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#164E63]/40">
 Age
 </dt>
 <dd className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-[#164E63]/90 ">
 <CalendarDays className="h-3.5 w-3.5 text-[#0891B2]" /> 7 years
 </dd>
 </div>
 <div className="p-4">
 <dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#164E63]/40">
 Blood group
 </dt>
 <dd className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-[#164E63]/90 ">
 <Droplets className="h-3.5 w-3.5 text-rose-500" /> O positive
 </dd>
 </div>
 <div className="p-4">
 <dt className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#164E63]/40">
 Allergies
 </dt>
 <dd className="mt-1 text-[11px] font-bold text-rose-600 ">
 Penicillin
 </dd>
 </div>
 </dl>
 </div>

 <div className="rounded-none border border-cyan-100/80 bg-white p-2 shadow-[0_8px_24px_rgba(30,48,75,0.04)] /[0.045]">
 <div
 role="tablist"
 aria-label="Master health record views"
 className="grid grid-cols-2 gap-1 sm:grid-cols-4"
 >
 {tabs.map(item => (
 <button
 key={item.key}
 role="tab"
 aria-selected={tab === item.key}
 onClick={() => setTab(item.key)}
 className={cn(
 "min-h-11 rounded-none px-3 text-[11px] font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
 tab === item.key
 ? "bg-[#059669] text-white shadow-none border border-cyan-100"
 : "text-[#164E63]/60 hover:bg-[#ECFEFF] hover:text-[#164E63]/90 :bg-white/10 :text-white"
 )}
 >
 {item.label}
 </button>
 ))}
 </div>
 </div>

 <FollowUpClosure patientId={id} />

 {tab === "overview" && (
 <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
 <article className="rounded-none border border-cyan-100/80 bg-white p-5 shadow-[0_8px_24px_rgba(30,48,75,0.04)] /[0.045]">
 <h3 className="font-display text-lg font-bold">
 Current care summary
 </h3>
 <p className="mt-2 text-[12px] leading-5 text-[#164E63]/60 -[#164E63]/40">
 PICU admission for cardiac monitoring following respiratory
 distress. Care plan is stable and remains under cardiology review.
 </p>
 <div className="mt-5 grid gap-3 sm:grid-cols-3">
 <div className="rounded-none bg-cyan-50 p-3 ">
 <div className="text-[9px] font-bold uppercase tracking-wide text-[#0891B2]">
 Care team
 </div>
 <div className="mt-1 text-[11px] font-bold">
 Dr. Anitha · Cardiology
 </div>
 </div>
 <div className="rounded-none bg-amber-50 p-3 ">
 <div className="text-[9px] font-bold uppercase tracking-wide text-amber-600">
 Next review
 </div>
 <div className="mt-1 text-[11px] font-bold">Today · 12:00</div>
 </div>
 <div className="rounded-none bg-emerald-50 p-3 ">
 <div className="text-[9px] font-bold uppercase tracking-wide text-emerald-600">
 Status
 </div>
 <div className="mt-1 text-[11px] font-bold">Stable</div>
 </div>
 </div>
 </article>
 <aside className="rounded-none border border-rose-200 bg-rose-50 p-5 ">
 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-rose-700 ">
 <AlertTriangle className="h-4 w-4" /> Active clinical alerts
 </div>
 <p className="mt-3 text-[12px] font-bold">
 Monitor oxygen requirement and fluid balance.
 </p>
 <p className="mt-1 text-[11px] leading-5 text-rose-700/80 ">
 Escalate to attending cardiologist if oxygen need exceeds 2 L/min.
 </p>
 </aside>
 </div>
 )}
 {tab === "timeline" && (
 <div className="rounded-none border border-cyan-100/80 bg-white p-5 shadow-[0_8px_24px_rgba(30,48,75,0.04)] /[0.045]">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="font-display text-lg font-bold">
 Clinical timeline
 </h3>
 <p className="mt-1 text-[11px] text-[#164E63]/60">
 Notes, results and imaging in chronological order.
 </p>
 </div>
 <Clock3 className="h-5 w-5 text-[#0891B2]" />
 </div>
 <ol className="mt-6 space-y-4 border-l border-cyan-100 pl-5 ">
 {timeline.map(event => {
 const Icon = event.icon;
 return (
 <li key={event.title} className="relative">
 <span
 className={cn(
 "absolute -left-[31px] top-0 flex h-5 w-5 items-center justify-center rounded-none ring-4 ring-white -[#0A101A]",
 tone[event.tone as keyof typeof tone]
 )}
 >
 <Icon className="h-3 w-3" />
 </span>
 <div className="flex flex-col justify-between gap-1 sm:flex-row">
 <div>
 <div className="text-[10px] font-bold uppercase tracking-wide text-[#164E63]/40">
 {event.type}
 </div>
 <h4 className="mt-1 text-[12px] font-bold">
 {event.title}
 </h4>
 </div>
 <time className="text-[10px] font-semibold text-[#164E63]/40">
 {event.time}
 </time>
 </div>
 <p className="mt-2 text-[11px] leading-5 text-[#164E63]/60 -[#164E63]/40">
 {event.detail}
 </p>
 </li>
 );
 })}
 </ol>
 </div>
 )}
 {tab === "documents" && (
 <div className="grid gap-3 sm:grid-cols-3">
 {[
 [FileText, "Clinical notes", "12 notes"],
 [FileImage, "Imaging", "3 studies"],
 [FlaskConical, "Laboratory", "8 results"],
 ].map(([Icon, label, count]) => {
 const DocumentIcon = Icon as typeof FileText;
 return (
 <article
 key={label as string}
 className="rounded-none border border-cyan-100/80 bg-white p-5 shadow-none border border-cyan-100 /[0.045]"
 >
 <DocumentIcon className="h-5 w-5 text-[#0891B2]" />
 <h3 className="mt-4 text-[12px] font-bold">
 {label as string}
 </h3>
 <p className="mt-1 text-[11px] text-[#164E63]/60">
 {count as string} available
 </p>
 </article>
 );
 })}
 </div>
 )}
 {tab === "reports" && (
 <div className="rounded-none border border-cyan-100/80 bg-white p-5 shadow-[0_8px_24px_rgba(30,48,75,0.04)] /[0.045]">
 <h3 className="font-display text-lg font-bold">Clinical reports</h3>
 <p className="mt-2 text-[12px] text-[#164E63]/60">
 Latest signed report: Cardiology review · Today, 10:15.
 </p>
 <div className="mt-5 rounded-none border border-dashed border-cyan-200 p-4 text-[11px] text-[#164E63]/60 ">
 Mock report repository. Signed reports and exports will be listed
 here.
 </div>
 </div>
 )}
 </section>
 );
}

export default function SectionView({ section }: { section: SectionKey }) {
 const { id } = useParams();
 const [darkMode, setDarkMode] = useState(false);
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const current = content[section];
 const statusTone = useMemo(
 () => ({
 blue: "bg-cyan-50 text-[#0891B2] ",
 green: "bg-emerald-50 text-emerald-600 ",
 amber: "bg-amber-50 text-amber-600 ",
 violet: "bg-violet-50 text-violet-600 ",
 rose: "bg-rose-50 text-rose-600 ",
 }),
 []
 );
 const title =
 section === "record" && id ? `Master health record · ${id}` : current.title;
 return (
 <div className="min-h-screen bg-[#F6F8FB] text-[#164E63] -[#0A101A] ">
 <div className="flex min-h-screen">
 <aside
 className={cn(
 "fixed inset-y-0 left-0 z-40 flex w-[258px] -translate-x-full flex-col bg-[linear-gradient(160deg,#0A2B5E_0%,#0C3975_42%,#08264F_100%)] px-4 py-5 text-white shadow-[12px_0_32px_rgba(15,63,125,0.14)] transition-transform duration-300 lg:static lg:translate-x-0",
 sidebarOpen && "translate-x-0"
 )}
 >
 <div className="flex items-center justify-between px-2">
 <Link to="/" className="flex items-center gap-3">
 <Logo accent={current.accent} />
 <div>
 <div className="font-display text-[15px] font-bold">
 Pediatric Care
 </div>
 <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-50/65">
 Network
 </div>
 </div>
 </Link>
 <button
 aria-label="Close sidebar"
 className="rounded-none p-2 text-cyan-100/55 hover:bg-blue-200/15 lg:hidden"
 onClick={() => setSidebarOpen(false)}
 >
 <X className="h-4 w-4" />
 </button>
 </div>
 <div className="mt-9 px-2 text-[10px] font-bold uppercase tracking-[0.19em] text-cyan-100/55">
 Clinical workspace
 </div>
 <nav className="mt-3 space-y-1.5">
 {sections.map(item => {
 const Icon = item.icon;
 return (
 <NavLink
 key={item.href}
 to={item.href}
 end={item.href === "/"}
 onClick={() => setSidebarOpen(false)}
 className={({ isActive }) =>
 cn(
 "flex min-h-11 items-center gap-3 rounded-none px-3 text-[12px] font-semibold transition",
 isActive
 ? "bg-cyan-50 text-blue-950 shadow-[0_8px_20px_rgba(2,132,199,0.18)]"
 : "text-cyan-50/65 hover:bg-blue-300/15 hover:text-white"
 )
 }
 >
 {({ isActive }) => (
 <>
 <Icon
 className={cn(
 "h-[17px] w-[17px]",
 isActive ? "text-sky-500" : "text-cyan-100/55"
 )}
 />
 <span className="flex-1">{item.label}</span>
 {item.href === "/alerts" && (
 <span className="rounded-md bg-white/95 px-1.5 py-0.5 text-[9px] font-bold text-[#0891B2]">
 4
 </span>
 )}
 </>
 )}
 </NavLink>
 );
 })}
 </nav>
 <div className="mt-auto rounded-none border border-cyan-200/15 bg-blue-950/25 p-3.5">
 <div className="flex items-center gap-2 text-[11px] font-semibold text-blue-50/85">
 <span className="h-2 w-2 rounded-none bg-sky-300" /> Main City
 Hospital
 </div>
 <div className="mt-2 text-[10px] text-cyan-100/55">
 Protected clinical workspace
 </div>
 </div>
 </aside>
 {sidebarOpen && (
 <button
 aria-label="Close navigation overlay"
 className="fixed inset-0 z-30 bg-slate-950/45 lg:hidden"
 onClick={() => setSidebarOpen(false)}
 />
 )}
 <main className="min-w-0 flex-1">
 <header className="sticky top-0 z-20 border-b border-cyan-100/80 bg-[#F6F8FB]/90 backdrop-blur-xl -[#0A101A]/90">
 <div className="flex min-h-[70px] items-center gap-4 px-5 lg:px-8">
 <button
 aria-label="Open sidebar"
 className="rounded-none p-2 text-[#164E63]/60 hover:bg-slate-100 lg:hidden"
 onClick={() => setSidebarOpen(true)}
 >
 <Menu className="h-5 w-5" />
 </button>
 <div className="hidden items-center gap-2 text-xs font-semibold text-[#164E63]/40 md:flex">
 <span>Main City Hospital</span>
 <span className="text-slate-300">/</span>
 <span className="text-[#164E63] ">
 {title}
 </span>
 </div>
 <div className="ml-auto flex items-center gap-2.5">
 <button
 aria-label="Notifications"
 className="relative rounded-none border border-cyan-100 bg-white p-2.5 text-[#164E63]/60 shadow-none border border-cyan-100 "
 >
 <Bell className="h-[17px] w-[17px]" />
 <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-none bg-rose-500" />
 </button>
 <button
 aria-label="Toggle dark mode"
 onClick={() => {
 setDarkMode(value => !value);
 document.documentElement.classList.toggle(
 "dark",
 !darkMode
 );
 }}
 className="rounded-none border border-cyan-100 bg-white p-2.5 text-[#164E63]/60 shadow-none border border-cyan-100 "
 >
 {darkMode ? (
 <Sun className="h-[17px] w-[17px]" />
 ) : (
 <Moon className="h-[17px] w-[17px]" />
 )}
 </button>
 </div>
 </div>
 <div className="border-t border-cyan-100/80 px-5 py-3 lg:px-8 ">
 <div className="flex items-center gap-2 text-[10px] font-semibold text-[#164E63]/60 -[#164E63]/40">
 <span className="h-2 w-2 rounded-none bg-emerald-500" /> System
 Mode: Phase 1 MVP <span className="text-slate-300">|</span>{" "}
 HIPAA / DPDP 2023 Compliant{" "}
 <span className="text-slate-300">|</span> Active Facility: Main
 City Hospital
 </div>
 </div>
 </header>
 <div className="dashboard-page-transition mx-auto max-w-[1200px] px-5 py-8 lg:px-8 lg:py-10">
 <div className="mb-8 flex items-end justify-between gap-4">
 <div>
 <div
 className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.17em]"
 style={{ color: current.accent }}
 >
 <span
 className="h-1.5 w-1.5 rounded-none"
 style={{ backgroundColor: current.accent }}
 />{" "}
 {current.eyebrow}
 </div>
 <h1 className="font-display text-[32px] font-extrabold tracking-[-0.055em] sm:text-[42px]">
 {title}
 </h1>
 <p className="mt-2 max-w-2xl text-[12px] leading-5 text-[#164E63]/60 -[#164E63]/40">
 {current.description}
 </p>
 </div>
 <div className="hidden h-16 w-16 items-center justify-center rounded-none border border-cyan-100 bg-white shadow-none border border-cyan-100 sm:flex ">
 <Stethoscope
 className="h-7 w-7"
 style={{ color: current.accent }}
 />
 </div>
 </div>
 {section === "record" ? (
 <MasterHealthRecord id={id ?? "MC-H-240318-074"} />
 ) : (
 <>
 <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
 <div className="rounded-none border border-cyan-100/80 bg-white p-5 shadow-[0_8px_24px_rgba(30,48,75,0.04)] /[0.045]">
 <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#164E63]/40">
 Live queue signal
 </div>
 <div
 className="mt-5 font-display text-[44px] font-extrabold tracking-[-0.08em]"
 style={{ color: current.accent }}
 >
 {current.metric}
 </div>
 <div className="mt-1 text-[12px] font-bold text-[#164E63] ">
 {current.metricLabel}
 </div>
 <div className="mt-6 flex items-center gap-2 rounded-none bg-[#ECFEFF] p-3 text-[10px] font-semibold text-[#164E63]/60 /[0.05] ">
 <Activity
 className="h-4 w-4"
 style={{ color: current.accent }}
 />{" "}
 Updated from the current demo workspace state.
 </div>
 </div>
 <div className="grid gap-3 sm:grid-cols-3">
 {current.items.map(item => {
 const Icon = item.icon;
 return (
 <div
 key={item.title}
 className="rounded-none border border-cyan-100/80 bg-white p-4 shadow-[0_8px_24px_rgba(30,48,75,0.04)] /[0.045]"
 >
 <div
 className={cn(
 "flex h-9 w-9 items-center justify-center rounded-none",
 statusTone[item.tone as keyof typeof statusTone]
 )}
 >
 <Icon className="h-4 w-4" />
 </div>
 <div className="mt-5 text-[12px] font-bold">
 {item.href ? (
 <Link
 to={item.href}
 className="text-[var(--role-accent)] hover:underline"
 >
 {item.title}
 </Link>
 ) : (
 item.title
 )}
 </div>
 <p className="mt-2 min-h-12 text-[10px] leading-4 text-[#164E63]/60 -[#164E63]/40">
 {item.detail}
 </p>
 <div className="mt-4 flex items-center justify-between gap-2 border-t border-cyan-50 pt-3 text-[10px] font-bold ">
 <span className="text-[#164E63] ">
 {item.value}
 </span>
 <ArrowRight
 className="h-3.5 w-3.5"
 style={{ color: current.accent }}
 />
 </div>
 </div>
 );
 })}
 </div>
 </div>
 <div className="mt-6 rounded-none border border-dashed border-cyan-200 bg-white/60 p-5 text-[11px] leading-5 text-[#164E63]/60 /[0.03] -[#164E63]/40">
 <div className="flex items-center gap-2 font-bold text-[#164E63] ">
 <ShieldCheck className="h-4 w-4 text-emerald-500" />{" "}
 Dedicated view ready for workflow integration
 </div>
 <p className="mt-2">
 This route is now a functional destination in the clinical
 workspace. Connect the existing module logic and API data
 here next without changing the navigation contract.
 </p>
 </div>
 <footer className="flex items-center justify-between pt-8 text-[10px] font-medium text-[#164E63]/40">
 <span>© 2026 Pediatric Care Network</span>
 <span className="flex items-center gap-1.5">
 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />{" "}
 Secure workspace
 </span>
 </footer>
 </>
 )}
 </div>
 </main>
 </div>
 </div>
 );
}
