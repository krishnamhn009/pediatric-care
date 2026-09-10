"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link, NavLink } from "react-router-dom";
import { ClinicalGovernancePanel, type GovernanceItem } from "../components/ClinicalGovernance";
import {
 Activity,
 ClipboardList,
 AlertCircle,
 AlertTriangle,
 ArrowDownRight,
 ArrowRight,
 ArrowUpRight,
 Bell,
 BedDouble,
 Building2,
 Check,
 CheckCircle2,
 ChevronDown,
 ChevronRight,
 CircleDot,
 Clock3,
 Download,
 FileText,
 FileHeart,
 Heart,
 HeartPulse,
 Info,
 LayoutDashboard,
 MapPinned,
 Menu,
 MessageSquareText,
 Moon,
 MoreHorizontal,
 RefreshCw,
 Search,
 ShieldCheck,
 Siren,
 Sparkles,
 Stethoscope,
 Sun,
 UsersRound,
 UserCheck,
 X,
 type LucideIcon,
} from "lucide-react";

type RoleKey = "general" | "specialist" | "leadership";
type WardStatus = "Low" | "Moderate" | "High" | "Critical";
type Ward = {
 id: string;
 name: string;
 short: string;
 occupancy: number;
 status: WardStatus;
 patients: number;
 capacity: number;
 note: string;
 icon: LucideIcon;
 color: string;
 patientList: Array<{
 name: string;
 id: string;
 acuity: string;
 wait: string;
 }>;
};

type AlertItem = {
 id: number;
 tone: "critical" | "amber" | "blue" | "green";
 title: string;
 detail: string;
 time: string;
 action: string;
 kind: "recommendation" | "alert";
};

const roles: Record<
 RoleKey,
 { label: string; person: string; accent: string; soft: string; dark: string }
> = {
 general: {
 label: "General Pediatrician",
 person: "Dr. Anitha",
 accent: "#2463EB",
 soft: "#EAF1FF",
 dark: "#1646B6",
 },
 specialist: {
 label: "Pediatric Sub-Specialist",
 person: "Cardiology / Neurology",
 accent: "#0E9F6E",
 soft: "#E8F8F1",
 dark: "#087653",
 },
 leadership: {
 label: "Hospital Leadership",
 person: "Dr. Prabhu · Chief Pediatrician",
 accent: "#B7791F",
 soft: "#FFF7E4",
 dark: "#7D5111",
 },
};

const initialWards: Ward[] = [
 {
 id: "opd",
 name: "OPD",
 short: "OPD",
 occupancy: 61,
 status: "Moderate",
 patients: 38,
 capacity: 62,
 note: "Steady flow · 4 consult rooms active",
 icon: UsersRound,
 color: "#2463EB",
 patientList: [
 {
 name: "Aarav R.",
 id: "MC-H-2609-042",
 acuity: "Routine review",
 wait: "12m",
 },
 {
 name: "Tara S.",
 id: "MC-H-2609-046",
 acuity: "New intake",
 wait: "18m",
 },
 {
 name: "Kabir J.",
 id: "MC-H-2609-051",
 acuity: "Follow-up",
 wait: "24m",
 },
 ],
 },
 {
 id: "emergency",
 name: "Emergency / Triage",
 short: "ER",
 occupancy: 78,
 status: "High",
 patients: 21,
 capacity: 27,
 note: "2 red-tag patients · 1 bed pending",
 icon: AlertTriangle,
 color: "#F59E0B",
 patientList: [
 {
 name: "Niya P.",
 id: "MC-H-2609-118",
 acuity: "Red tag · respiratory",
 wait: "06m",
 },
 {
 name: "Arjun V.",
 id: "MC-H-2609-121",
 acuity: "Amber tag · fever",
 wait: "14m",
 },
 {
 name: "Mira K.",
 id: "MC-H-2609-126",
 acuity: "Amber tag · trauma",
 wait: "21m",
 },
 ],
 },
 {
 id: "picu",
 name: "PICU",
 short: "PICU",
 occupancy: 92,
 status: "Critical",
 patients: 23,
 capacity: 25,
 note: "2 beds available · transfer review needed",
 icon: HeartPulse,
 color: "#EF4444",
 patientList: [
 {
 name: "Ishaan Menon",
 id: "MC-H-240318-074",
 acuity: "Critical · cardiac",
 wait: "36h stage",
 },
 {
 name: "Anaya Rao",
 id: "MC-H-250221-119",
 acuity: "High · post-op",
 wait: "18h stage",
 },
 {
 name: "Rehan S.",
 id: "MC-H-2609-073",
 acuity: "Critical · neuro",
 wait: "04h stage",
 },
 ],
 },
 {
 id: "nicu",
 name: "NICU",
 short: "NICU",
 occupancy: 74,
 status: "High",
 patients: 14,
 capacity: 19,
 note: "3 step-down candidates identified",
 icon: Heart,
 color: "#D97706",
 patientList: [
 {
 name: "Aarohi M.",
 id: "MC-H-2609-004",
 acuity: "High · preterm",
 wait: "11h stage",
 },
 {
 name: "Dev N.",
 id: "MC-H-2609-009",
 acuity: "Moderate · feeding",
 wait: "07h stage",
 },
 {
 name: "Sia R.",
 id: "MC-H-2609-014",
 acuity: "High · respiratory",
 wait: "05h stage",
 },
 ],
 },
 {
 id: "wards",
 name: "Pediatric Wards",
 short: "Wards",
 occupancy: 48,
 status: "Low",
 patients: 56,
 capacity: 118,
 note: "Capacity available · 8 discharges today",
 icon: BedDouble,
 color: "#10B981",
 patientList: [
 {
 name: "Myra Joseph",
 id: "MC-H-250914-088",
 acuity: "Moderate · pulmonary",
 wait: "06h stage",
 },
 {
 name: "Vihaan S.",
 id: "MC-H-2609-031",
 acuity: "Routine · recovery",
 wait: "03h stage",
 },
 {
 name: "Zoya A.",
 id: "MC-H-2609-034",
 acuity: "Low · observation",
 wait: "01h stage",
 },
 ],
 },
 {
 id: "imaging",
 name: "Imaging / PACS",
 short: "PACS",
 occupancy: 67,
 status: "Moderate",
 patients: 9,
 capacity: 14,
 note: "MRI queue at 3 · X-Ray running on time",
 icon: FileText,
 color: "#6366F1",
 patientList: [
 {
 name: "Rudra K.",
 id: "MC-H-2609-201",
 acuity: "MRI · cardiac",
 wait: "26m",
 },
 {
 name: "Nia A.",
 id: "MC-H-2609-205",
 acuity: "X-Ray · chest",
 wait: "31m",
 },
 {
 name: "Ayan D.",
 id: "MC-H-2609-211",
 acuity: "Ultrasound · abdomen",
 wait: "42m",
 },
 ],
 },
];

const baseAlerts: AlertItem[] = [
 {
 id: 1,
 tone: "critical",
 title: "PICU bed occupancy at 92%",
 detail: "Recommend re-routing non-critical transfers to Pediatric Wards.",
 time: "2 min ago",
 action: "Review capacity",
 kind: "recommendation",
 },
 {
 id: 2,
 tone: "amber",
 title: "NICU step-down capacity detected",
 detail: "3 patients meet criteria for transfer pending attending sign-off.",
 time: "11 min ago",
 action: "View candidates",
 kind: "recommendation",
 },
 {
 id: 3,
 tone: "blue",
 title: "Referral turnaround improving",
 detail:
 "Average specialist response is 26m, down 18% over the last 7 days.",
 time: "24 min ago",
 action: "Open trend",
 kind: "alert",
 },
 {
 id: 4,
 tone: "green",
 title: "8 pediatric discharges projected",
 detail: "Pediatric Wards can absorb the current Emergency transfer queue.",
 time: "38 min ago",
 action: "View discharge plan",
 kind: "alert",
 },
];

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
function statusClasses(status: WardStatus) {
 return status === "Low"
 ? {
 dot: "bg-emerald-500",
 text: "text-emerald-700 ",
 bg: "bg-emerald-50 ",
 bar: "bg-emerald-500",
 }
 : status === "Moderate"
 ? {
 dot: "bg-blue-500",
 text: "text-[#0891B2] ",
 bg: "bg-cyan-50 ",
 bar: "bg-blue-500",
 }
 : status === "High"
 ? {
 dot: "bg-amber-500",
 text: "text-amber-700 ",
 bg: "bg-amber-50 ",
 bar: "bg-amber-500",
 }
 : {
 dot: "bg-rose-500",
 text: "text-rose-700 ",
 bg: "bg-rose-50 ",
 bar: "bg-rose-500",
 };
}
function Kpi({
 label,
 value,
 variance,
 positive,
 detail,
 icon: Icon,
 tone,
}: {
 label: string;
 value: string;
 variance: string;
 positive?: boolean;
 detail: string;
 icon: LucideIcon;
 tone: string;
}) {
 return (
 <div className="rounded-none border border-cyan-100/80 bg-white p-4 shadow-[0_8px_24px_rgba(30,48,75,0.04)] /[0.045] sm:p-5">
 <div className="flex items-start justify-between gap-2">
 <div
 className={cn(
 "flex h-9 w-9 items-center justify-center rounded-none",
 tone
 )}
 >
 <Icon className="h-[17px] w-[17px]" />
 </div>
 <span
 className={cn(
 "flex items-center gap-0.5 rounded-md px-1.5 py-1 text-[9px] font-bold",
 positive
 ? "bg-emerald-50 text-emerald-700 "
 : "bg-rose-50 text-rose-700 "
 )}
 >
 {positive ? (
 <ArrowUpRight className="h-3 w-3" />
 ) : (
 <ArrowDownRight className="h-3 w-3" />
 )}
 {variance}
 </span>
 </div>
 <div className="mt-4 font-display text-[26px] font-extrabold tracking-[-0.07em] text-[#164E63] ">
 {value}
 </div>
 <div className="mt-0.5 text-[11px] font-bold text-[#164E63] ">
 {label}
 </div>
 <div className="mt-1.5 text-[10px] font-medium text-[#164E63]/40">
 {detail}
 </div>
 </div>
 );
}

export default function Home() {
 const [roleKey, setRoleKey] = useState<RoleKey>("leadership");
 const [wards, setWards] = useState(initialWards);
 const [selectedWardId, setSelectedWardId] = useState("picu");
 const [alerts, setAlerts] = useState(baseAlerts);
 const [darkMode, setDarkMode] = useState(false);
 const [sidebarOpen, setSidebarOpen] = useState(false);
 const [demoActive, setDemoActive] = useState(false);
 const [showAlerts, setShowAlerts] = useState(true);
 const [governanceItem, setGovernanceItem] = useState<GovernanceItem | null>(null);
 const role = roles[roleKey];
 const selectedWard =
 wards.find(ward => ward.id === selectedWardId) ?? wards[0];
 const wardStatus = selectedWard
 ? statusClasses(selectedWard.status)
 : statusClasses("Low");
 const intelligenceScore = Math.max(
 82,
 Math.min(
 95,
 89 +
 (wards.filter(
 ward => ward.status === "Low" || ward.status === "Moderate"
 ).length -
 3)
 )
 );

 useEffect(() => {
 document.documentElement.classList.toggle("dark", darkMode);
 }, [darkMode]);
 useEffect(() => {
 const timer = window.setInterval(
 () =>
 setWards(current =>
 current.map(ward => ({
 ...ward,
 occupancy: Math.max(
 32,
 Math.min(97, ward.occupancy + (ward.id === "picu" ? 0.05 : 0))
 ),
 }))
 ),
 1000
 );
 return () => window.clearInterval(timer);
 }, []);
 const themeStyle = useMemo(
 () =>
 ({
 "--role-accent": role.accent,
 "--role-accent-soft": role.soft,
 "--role-accent-dark": role.dark,
 }) as CSSProperties,
 [role]
 );
 const toggleDemo = () => {
 setDemoActive(active => !active);
 setWards(current =>
 current.map(ward =>
 ward.id === "picu"
 ? {
 ...ward,
 occupancy: demoActive ? 92 : 97,
 status: demoActive ? "Critical" : "Critical",
 note: demoActive
 ? "2 beds available · transfer review needed"
 : "0 beds available · diversion protocol active",
 }
 : ward.id === "emergency"
 ? {
 ...ward,
 occupancy: demoActive ? 78 : 86,
 status: demoActive ? "High" : "Critical",
 }
 : ward
 )
 );
 setAlerts(current =>
 demoActive
 ? baseAlerts
 : [
 {
 id: 9,
 tone: "critical",
 title: "PICU diversion protocol activated",
 detail:
 "Demo mode: all non-critical transfers require leadership review.",
 time: "just now",
 action: "Review protocol",
 kind: "alert",
 },
 ...current,
 ]
 );
 };
 const refreshDashboard = () => {
 setWards(initialWards);
 setAlerts(baseAlerts);
 setDemoActive(false);
 };
 const dismissAlert = (id: number) =>
 setAlerts(current => current.filter(alert => alert.id !== id));
 const exportPdf = () => {
 const generatedAt = new Date().toLocaleString("en-IN", {
 dateStyle: "medium",
 timeStyle: "short",
 });
 const lines = [
 "PEDIATRIC CARE NETWORK",
 "Executive Command Center — Leadership Report",
 `Generated: ${generatedAt} | Facility: Main City Hospital`,
 "Advisory only — Human sign-off required for all operational action.",
 "",
 "KEY PERFORMANCE INDICATORS",
 "Total children registered: 12,486 (+8.6% vs. previous 30 days)",
 "Average referral time: 26m (-18% | target < 30 minutes)",
 "Active critical cases: 07 (+2 vs. yesterday)",
 `Open escalations: ${String(alerts.length).padStart(2, "0")} (-12% vs. previous week)`,
 "30-day readmission rate: 4.8% (-0.7% | benchmark 5.2%)",
 `Clinical intelligence score: ${intelligenceScore}% (+4.2%)`,
 "",
 "LIVE WARD SNAPSHOT",
 ...wards.map(
 ward =>
 `${ward.name}: ${Math.round(ward.occupancy)}% occupied | ${ward.patients}/${ward.capacity} patients | ${ward.status}`
 ),
 "",
 "EXECUTIVE ALERTS & RECOMMENDATIONS",
 ...(alerts.length
 ? alerts.flatMap(alert => [
 `[${alert.tone.toUpperCase()}] ${alert.title} (${alert.time})`,
 `Recommendation: ${alert.detail}`,
 ])
 : ["No active executive alerts."]),
 "",
 "This report is a current operational snapshot. Validate all recommendations against the clinical record before action.",
 ];
 const escapePdf = (value: string) =>
 value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
 const content = [
 "BT",
 "/F1 10 Tf",
 "50 750 Td",
 ...lines.flatMap((line, index) => [
 index === 0 ? "/F1 16 Tf" : index === 1 ? "/F1 13 Tf" : "/F1 10 Tf",
 `(${escapePdf(line)}) Tj`,
 "0 -16 Td",
 ]),
 "ET",
 ].join("\n");
 const objects = [
 "<< /Type /Catalog /Pages 2 0 R >>",
 "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
 "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
 "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
 `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
 ];
 let pdf = "%PDF-1.4\n";
 const offsets: number[] = [0];
 objects.forEach((object, index) => {
 offsets[index + 1] = pdf.length;
 pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
 });
 const xref = pdf.length;
 pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets
 .slice(1)
 .map(offset => `${String(offset).padStart(10, "0")} 00000 n `)
 .join(
 "\n"
 )}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
 const url = URL.createObjectURL(
 new Blob([pdf], { type: "application/pdf" })
 );
 const link = document.createElement("a");
 link.href = url;
 link.download = `pediatric-care-executive-report-${new Date().toISOString().slice(0, 10)}.pdf`;
 link.click();
 window.setTimeout(() => URL.revokeObjectURL(url), 1000);
 };

 return (
 <div
 className="min-h-screen bg-[#F6F8FB] text-[#164E63] -[#0A101A] "
 style={themeStyle}
 >
 <div className="flex min-h-screen">
 <aside
 className={cn(
 "fixed inset-y-0 left-0 z-40 flex w-[258px] -translate-x-full flex-col bg-[linear-gradient(160deg,#0A2B5E_0%,#0C3975_42%,#08264F_100%)] px-4 py-5 text-white shadow-[12px_0_32px_rgba(15,63,125,0.14)] transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none",
 sidebarOpen && "translate-x-0"
 )}
 >
 <div className="flex items-center justify-between px-2">
 <Link to="/" className="flex items-center gap-3">
 <Logo accent={role.accent} />
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
 Executive workspace
 </div>
 <nav className="mt-3 space-y-1.5">
 {[
 {
 label: "Command center",
 to: "/",
 icon: LayoutDashboard,
 end: true,
 },
 { label: "Active cases", to: "/patients", icon: ClipboardList },
 { label: "Alert management", to: "/alerts", icon: Siren },
 ].map(item => {
 const Icon = item.icon;
 return (
 <NavLink
 key={item.to}
 to={item.to}
 end={item.end}
 onClick={() => setSidebarOpen(false)}
 className={({ isActive }) =>
 cn(
 "flex min-h-11 w-full items-center gap-3 rounded-none px-3 text-left text-[12px] font-semibold transition",
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
 isActive ? "text-sky-300" : "text-cyan-100/55"
 )}
 />
 <span className="flex-1">{item.label}</span>
 {item.to === "/alerts" && (
 <span className="rounded-md bg-white/95 px-1.5 py-0.5 text-[9px] font-bold text-[#0891B2]">
 {alerts.length}
 </span>
 )}
 </>
 )}
 </NavLink>
 );
 })}
 </nav>
 <div className="mt-8 px-2 text-[10px] font-bold uppercase tracking-[0.19em] text-cyan-100/55">
 Facility pulse
 </div>
 <div className="mt-3 rounded-none border border-cyan-200/15 bg-blue-950/25 p-3.5">
 <div className="flex items-center justify-between">
 <span className="flex items-center gap-2 text-[11px] font-semibold text-blue-50/85">
 <CircleDot className="h-3.5 w-3.5 text-sky-300" /> All
 facilities online
 </span>
 <span className="h-1.5 w-1.5 rounded-none bg-sky-300" />
 </div>
 <div className="mt-4 flex items-end justify-between">
 <div>
 <div className="font-display text-2xl font-extrabold tracking-[-0.06em] text-white">
 {intelligenceScore}%
 </div>
 <div className="mt-1 text-[10px] text-cyan-100/55">
 clinical intelligence score
 </div>
 </div>
 <div className="flex h-8 items-end gap-1">
 {[4, 7, 5, 8, 6, 10, 8, 9].map((height, index) => (
 <span
 key={index}
 className="w-1 rounded-none bg-amber-300/80"
 style={{ height: `${height * 3}px` }}
 />
 ))}
 </div>
 </div>
 </div>
 <div className="mt-auto flex items-center gap-3 rounded-none border border-cyan-200/15 bg-blue-950/25 p-3">
 <div className="flex h-8 w-8 items-center justify-center rounded-none bg-sky-400/75 text-[11px] font-bold">
 DP
 </div>
 <div className="min-w-0 flex-1">
 <div className="truncate text-[12px] font-bold text-slate-200">
 Dr. Prabhu
 </div>
 <div className="mt-0.5 truncate text-[10px] text-cyan-100/55">
 Chief Pediatrician
 </div>
 </div>
 <ChevronDown className="h-4 w-4 text-cyan-100/55" />
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
 Executive command center
 </span>
 </div>
 <div className="ml-auto flex items-center gap-2.5">
 <div className="hidden items-center gap-2 rounded-none border border-cyan-100 bg-white px-3 py-2 text-[11px] font-semibold text-[#164E63]/40 shadow-none border border-cyan-100 lg:flex">
 <Search className="h-3.5 w-3.5" /> Search ward or patient{" "}
 <span className="ml-3 rounded bg-slate-100 px-1.5 py-0.5 text-[10px]">
 ⌘ K
 </span>
 </div>
 <button
 aria-label="Notifications"
 className="relative rounded-none border border-cyan-100 bg-white p-2.5 text-[#164E63]/60 shadow-none border border-cyan-100 "
 >
 <Bell className="h-[17px] w-[17px]" />
 <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-none bg-rose-500" />
 </button>
 <button
 aria-label="Toggle dark mode"
 onClick={() => setDarkMode(value => !value)}
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
 <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
 <div className="flex items-center gap-2.5 overflow-x-auto">
 {(Object.keys(roles) as RoleKey[]).map(key => {
 const item = roles[key];
 const selected = key === roleKey;
 return (
 <button
 key={key}
 aria-pressed={selected}
 onClick={() => setRoleKey(key)}
 className={cn(
 "flex min-h-9 shrink-0 items-center gap-2 rounded-none px-3 text-left transition",
 selected
 ? "bg-[var(--role-accent-soft)] text-[var(--role-accent-dark)]"
 : "text-[#164E63]/60 hover:bg-slate-100 -[#164E63]/40 :bg-white/10"
 )}
 >
 <span
 className={cn(
 "flex h-6 w-6 items-center justify-center rounded-none",
 selected
 ? "bg-white/80"
 : "bg-slate-100 "
 )}
 >
 <Stethoscope className="h-3.5 w-3.5" />
 </span>
 <span>
 <span className="block text-[11px] font-bold">
 {key === "general"
 ? "Pediatrics"
 : key === "specialist"
 ? "Specialist"
 : "Leadership"}
 </span>
 <span className="hidden text-[10px] opacity-70 sm:block">
 {item.person.split(" · ")[0]}
 </span>
 </span>
 {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
 </button>
 );
 })}
 </div>
 <div className="flex items-center gap-2 text-[10px] font-semibold text-[#164E63]/60 -[#164E63]/40">
 <span className="h-2 w-2 rounded-none bg-emerald-500" />{" "}
 System Mode: Phase 1 MVP{" "}
 <span className="text-slate-300">|</span> HIPAA / DPDP 2023
 Compliant{" "}
 <span className="hidden text-slate-300 sm:inline">|</span>{" "}
 <span className="hidden sm:inline">
 Active Facility: Main City Hospital
 </span>
 </div>
 </div>
 </div>
 </header>

 <div className="dashboard-page-transition mx-auto max-w-[1500px] px-5 py-7 lg:px-8 lg:py-8">
 <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
 <div>
 <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.17em] text-[var(--role-accent)]">
 <span className="h-1.5 w-1.5 rounded-none bg-[var(--role-accent)]" />{" "}
 Command center ·{" "}
 {demoActive ? "Demo stress mode" : "Live operational view"}
 </div>
 <h1 className="font-display text-[30px] font-extrabold tracking-[-0.055em] sm:text-[38px]">
 Executive command center
 </h1>
 <p className="mt-2 max-w-2xl text-[12px] leading-5 text-[#164E63]/60 -[#164E63]/40">
 A real-time view of pediatric capacity, care continuity, and
 the signals that need leadership attention.
 </p>
 </div>
 <div className="flex flex-wrap items-center gap-2">
 <button
 onClick={toggleDemo}
 className={cn(
 "flex min-h-10 items-center gap-2 rounded-none border px-3.5 text-[10px] font-bold transition hover:-translate-y-0.5",
 demoActive
 ? "border-rose-300 bg-rose-50 text-rose-700 "
 : "border-cyan-100 bg-white text-[#164E63]/70 shadow-none border border-cyan-100 "
 )}
 >
 <AlertTriangle className="h-3.5 w-3.5" />{" "}
 {demoActive ? "Exit stress mode" : "Simulate capacity stress"}
 </button>
 <button
 onClick={exportPdf}
 className="flex min-h-10 items-center gap-2 rounded-none bg-[var(--role-accent)] px-3.5 text-[10px] font-bold text-white shadow-none border border-cyan-100 transition hover:-translate-y-0.5"
 >
 <Download className="h-3.5 w-3.5" /> Export PDF report
 </button>
 <button
 onClick={refreshDashboard}
 className="flex min-h-10 items-center gap-2 rounded-none border border-cyan-100 bg-white px-3.5 text-[10px] font-bold text-[#164E63]/70 shadow-none border border-cyan-100 transition hover:bg-[#ECFEFF] "
 >
 <RefreshCw className="h-3.5 w-3.5" /> Refresh
 </button>
 </div>
 </div>

 <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
 {
 <Kpi
 label="Total children registered"
 value="12,486"
 variance="+8.6%"
 positive
 detail="vs. previous 30 days"
 icon={UsersRound}
 tone="bg-cyan-50 text-[#0891B2] "
 />
 }
 <Kpi
 label="Average referral time"
 value="26m"
 variance="-18%"
 positive
 detail="Target < 30 minutes"
 icon={Clock3}
 tone="bg-emerald-50 text-emerald-600 "
 />
 <Kpi
 label="Active critical cases"
 value="07"
 variance="+2"
 detail="vs. yesterday"
 icon={HeartPulse}
 tone="bg-rose-50 text-rose-600 "
 />
 <Kpi
 label="Open escalations"
 value={String(alerts.length).padStart(2, "0")}
 variance="-12%"
 positive
 detail="vs. previous week"
 icon={AlertCircle}
 tone="bg-amber-50 text-amber-600 "
 />
 <Kpi
 label="30-day readmission rate"
 value="4.8%"
 variance="-0.7%"
 positive
 detail="Network benchmark 5.2%"
 icon={RefreshCw}
 tone="bg-violet-50 text-violet-600 "
 />
 <Kpi
 label="Clinical intelligence score"
 value={`${intelligenceScore}%`}
 variance="+4.2%"
 positive
 detail="Checkpoint satisfaction"
 icon={ShieldCheck}
 tone="bg-slate-100 text-[#164E63] "
 />
 </section>

 <section className="mt-7 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
 <div className="rounded-none border border-cyan-100/80 bg-white p-5 shadow-[0_8px_24px_rgba(30,48,75,0.04)] /[0.045] sm:p-6">
 <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
 <div>
 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#164E63]/40">
 <MapPinned className="h-3.5 w-3.5 text-[var(--role-accent)]" />{" "}
 Facility capacity · live
 </div>
 <h2 className="mt-2 font-display text-[19px] font-bold tracking-[-0.035em]">
 Hospital ward heatmap
 </h2>
 <p className="mt-1 text-[11px] text-[#164E63]/40">
 Select a care area to drill into active patients and
 current pressure.
 </p>
 </div>
 <div className="flex items-center gap-2 text-[9px] font-bold text-[#164E63]/40">
 <span className="h-2 w-2 rounded-none bg-emerald-500" /> Low{" "}
 <span className="h-2 w-2 rounded-none bg-blue-500" />{" "}
 Moderate{" "}
 <span className="h-2 w-2 rounded-none bg-amber-500" /> High{" "}
 <span className="h-2 w-2 rounded-none bg-rose-500" />{" "}
 Critical
 </div>
 </div>
 <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
 {wards.map(ward => {
 const Icon = ward.icon;
 const status = statusClasses(ward.status);
 const selected = ward.id === selectedWardId;
 return (
 <button
 key={ward.id}
 aria-pressed={selected}
 onClick={() => setSelectedWardId(ward.id)}
 className={cn(
 "group rounded-none border p-3.5 text-left transition duration-200 hover:-translate-y-0.5",
 selected
 ? "border-[var(--role-accent)] bg-[var(--role-accent-soft)] shadow-[0_8px_20px_rgba(30,48,75,0.07)]"
 : "border-cyan-100 hover:border-cyan-200 :bg-white/[0.05]"
 )}
 >
 <div className="flex items-start justify-between">
 <div
 className="flex h-8 w-8 items-center justify-center rounded-none"
 style={{
 backgroundColor: `${ward.color}14`,
 color: ward.color,
 }}
 >
 <Icon className="h-4 w-4" />
 </div>
 <span
 className={cn(
 "flex items-center gap-1 rounded-md px-1.5 py-1 text-[9px] font-bold",
 status.bg,
 status.text
 )}
 >
 <span
 className={cn(
 "h-1.5 w-1.5 rounded-none",
 status.dot
 )}
 />
 {ward.status}
 </span>
 </div>
 <div className="mt-4 flex items-end justify-between">
 <div>
 <div className="font-display text-[23px] font-extrabold tracking-[-0.06em]">
 {Math.round(ward.occupancy)}%
 </div>
 <div className="mt-0.5 text-[10px] font-bold text-[#164E63]/70 ">
 {ward.name}
 </div>
 </div>
 <div className="text-right text-[9px] font-semibold text-[#164E63]/40">
 {ward.patients}/{ward.capacity}
 <br />
 patients
 </div>
 </div>
 <div className="mt-3 h-1.5 overflow-hidden rounded-none bg-slate-100 ">
 <div
 className={cn(
 "h-full rounded-none transition-all",
 status.bar
 )}
 style={{ width: `${ward.occupancy}%` }}
 />
 </div>
 </button>
 );
 })}
 </div>
 <div
 className={cn(
 "mt-5 rounded-none border p-4 transition",
 wardStatus.bg,
 `border-${selectedWard.status === "Critical" ? "rose" : selectedWard.status === "High" ? "amber" : selectedWard.status === "Moderate" ? "blue" : "emerald"}-200/50`
 )}
 >
 <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
 <div>
 <div className="flex items-center gap-2">
 <span
 className={cn("h-2 w-2 rounded-none", wardStatus.dot)}
 />
 <span
 className={cn(
 "text-[10px] font-bold uppercase tracking-[0.13em]",
 wardStatus.text
 )}
 >
 {selectedWard.name} drill-down
 </span>
 </div>
 <p className="mt-2 text-[11px] font-semibold text-[#164E63]/70 ">
 {selectedWard.note}
 </p>
 </div>
 <button
 onClick={() => setSelectedWardId(selectedWard.id)}
 className="flex items-center gap-1 text-[10px] font-bold text-[var(--role-accent)]"
 >
 Open care list <ChevronRight className="h-3.5 w-3.5" />
 </button>
 </div>
 <div className="mt-4 grid gap-2 sm:grid-cols-3">
 {selectedWard.patientList.map(patient => (
 <div
 key={patient.id}
 className="rounded-none bg-white/70 p-3 "
 >
 <div className="flex items-center justify-between gap-2">
 <span className="truncate text-[11px] font-bold text-[#164E63]/90 ">
 {patient.name}
 </span>
 <span className="text-[9px] font-bold text-[#164E63]/40">
 {patient.wait}
 </span>
 </div>
 <div className="mt-1 truncate text-[9px] text-[#164E63]/60 -[#164E63]/40">
 {patient.id}
 </div>
 <div className="mt-2 text-[9px] font-semibold text-[#164E63]/70 ">
 {patient.acuity}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 <div className="rounded-none border border-cyan-100/80 bg-white p-5 shadow-[0_8px_24px_rgba(30,48,75,0.04)] /[0.045] sm:p-6">
 <div className="flex items-start justify-between gap-3">
 <div>
 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#164E63]/40">
 <Sparkles className="h-3.5 w-3.5 text-[var(--role-accent)]" />{" "}
 Executive intelligence feed
 </div>
 <h2 className="mt-2 font-display text-[19px] font-bold tracking-[-0.035em]">
 Live alerts & recommendations
 </h2>
 </div>
 <button
 aria-label="Toggle executive alerts"
 onClick={() => setShowAlerts(current => !current)}
 className="rounded-none p-2 text-[#164E63]/40 hover:bg-slate-100 :bg-white/10"
 >
 <MoreHorizontal className="h-4 w-4" />
 </button>
 </div>
 <div className="mt-4 flex items-start gap-2 rounded-none border border-amber-200 bg-amber-50 p-3 text-[10px] font-bold leading-4 text-amber-800 ">
 <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />{" "}
 Advisory only — Human sign-off required for all operational
 action.
 </div>
 {showAlerts && (
 <div className="mt-5 space-y-3">
 {alerts.map(alert => (
 <article
 key={alert.id}
 className="group rounded-none border border-cyan-100 p-3.5 transition hover:border-cyan-200 :bg-white/[0.04]"
 >
 <div className="flex items-start gap-3">
 <div
 className={cn(
 "flex h-8 w-8 shrink-0 items-center justify-center rounded-none",
 alert.tone === "critical"
 ? "bg-rose-50 text-rose-600 "
 : alert.tone === "amber"
 ? "bg-amber-50 text-amber-600 "
 : alert.tone === "blue"
 ? "bg-cyan-50 text-[#0891B2] "
 : "bg-emerald-50 text-emerald-600 "
 )}
 >
 {alert.tone === "critical" ? (
 <AlertCircle className="h-4 w-4" />
 ) : alert.tone === "amber" ? (
 <AlertTriangle className="h-4 w-4" />
 ) : alert.tone === "blue" ? (
 <Activity className="h-4 w-4" />
 ) : (
 <CheckCircle2 className="h-4 w-4" />
 )}
 </div>
 <div className="min-w-0 flex-1">
 <div className="flex items-start justify-between gap-2">
 <div className="text-[11px] font-bold leading-4 text-[#164E63]/90 ">
 {alert.title}
 </div>
 <span className="shrink-0 text-[9px] font-semibold text-[#164E63]/40">
 {alert.time}
 </span>
 </div>
 <p className="mt-1.5 text-[10px] leading-4 text-[#164E63]/60 -[#164E63]/40">
 {alert.detail}
 </p>
 <div className="mt-3 flex items-center justify-between">
 <button onClick={() => setGovernanceItem(alert)} className="flex items-center gap-1 text-[10px] font-bold text-[var(--role-accent)]">
 {alert.action}{" "}
 <ArrowRight className="h-3 w-3" />
 </button>
 <button
 aria-label={`Dismiss ${alert.title}`}
 onClick={() => dismissAlert(alert.id)}
 className="rounded-md p-1 text-slate-300 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-[#164E63]/70 :bg-white/10"
 >
 <X className="h-3.5 w-3.5" />
 </button>
 </div>
 </div>
 </div>
 </article>
 ))}
 </div>
 )}
 <div className="mt-5 flex items-center justify-between border-t border-cyan-50 pt-4 text-[10px] font-semibold text-[#164E63]/40 ">
 <span className="flex items-center gap-1.5">
 <CircleDot className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />{" "}
 Feed updated just now
 </span>
 <button className="font-bold text-[var(--role-accent)]">
 View alert history
 </button>
 </div>
 </div>
 </section>

 <footer className="flex flex-col gap-2 px-1 pb-3 pt-8 text-[10px] font-medium text-[#164E63]/40 sm:flex-row sm:items-center sm:justify-between">
 <span>
 © 2026 Pediatric Care Network · Internal clinical workspace
 </span>
 <span className="flex items-center gap-1.5">
 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />{" "}
 Protected health information handled securely
 </span>
 </footer>
 </div>
 </main>
 </div>
 <ClinicalGovernancePanel item={governanceItem} onClose={() => setGovernanceItem(null)} onComplete={() => governanceItem && dismissAlert(governanceItem.id)} />
 </div>
 );
}
