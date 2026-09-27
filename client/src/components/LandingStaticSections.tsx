import React from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  Microscope,
  BrainCircuit,
  Baby,
  ArrowRight,
  ArrowUpRight,
  Target,
  Workflow,
  Database,
  Brain,
  Timer,
  Shield,
  BarChart3,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" as any },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)" as any,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
  },
};

export const LandingStaticSections: React.FC = () => {
  return (
    <div className="bg-background text-foreground font-sans relative">
      {/* ——— What We Offer — bento like Solaris features ——— */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8"
        >
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Everything needed to deliver expert pediatric care
            </h2>
            <p className="mt-3 text-muted-foreground">
              From triage automation to multi-specialist orchestration, the
              network handles the entire care lifecycle in one Solaris-grade
              platform.
            </p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-5 text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            Book Demo <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid md:grid-cols-2 gap-4"
        >
          {[
            {
              title: "Predictive Triage & Routing",
              desc: "ML monitors vitals and routes to the right subspecialist before human alerts fire.",
              points: [
                "Real-time vitals monitoring",
                "Explainable match scoring",
                "SLA-aware dispatch",
              ],
            },
            {
              title: "Strict Governance",
              desc: "Every decision and closure is permanently logged in a tamper-evident audit trail.",
            },
            {
              title: "Teleconsultation, instantly",
              desc: "Encrypted video brings the expert to the child — no transfer, no delay.",
              points: [
                "One-click consult",
                "PACS + notes in call",
                "Guardian consent built-in",
              ],
            },
            {
              title: "Continuity Engine",
              desc: "10-Stage pipeline from intake to closure with automated follow-ups and checkpoint compliance.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              variants={item}
              className="group solaris-card solaris-glow relative overflow-hidden rounded-2xl p-6 lg:p-8 flex flex-col min-h-[280px]"
            >
              <div className="max-w-sm">
                <h3 className="text-xl md:text-2xl font-semibold leading-tight">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {card.desc}
                </p>
                {card.points && (
                  <ul className="mt-6 space-y-2.5">
                    {card.points.map(p => (
                      <li key={p} className="flex items-center gap-2 text-sm">
                        <span className="h-6 w-6 rounded-full bg-white/[0.08] text-foreground border border-white/10 grid place-items-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* decorative orb */}
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/[0.04] blur-2xl group-hover:bg-white/[0.07] transition-colors" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ——— Enterprise-Grade — 6 cards ——— */}
      <section id="capabilities" className="py-10 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Enterprise-grade pediatric coordination
          </h2>
          <p className="mt-3 max-w-prose text-muted-foreground text-balance">
            Stop building workflows and start delivering outcomes. Multi-team
            coordination that scales with your network, not your headcount.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 grid md:grid-cols-3 gap-4"
        >
          {[
            {
              icon: Target,
              title: "Goal-Oriented Routing",
              desc: "Understands acuity and autonomously determines the best specialist path.",
            },
            {
              icon: Workflow,
              title: "Multi-Team Orchestration",
              desc: "Coordinate nurses, pediatricians, and specialists with built-in handoff protocols.",
            },
            {
              icon: Brain,
              title: "Longitudinal Memory",
              desc: "Master Health Record with long & short-term context for every child.",
            },
            {
              icon: Timer,
              title: "Real-Time Processing",
              desc: "Ultra-low latency matching and streaming vitals with edge-ready deploy.",
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              desc: "HIPAA / DPDP compliant, RBAC, encryption, and full audit logs.",
            },
            {
              icon: BarChart3,
              title: "Analytics & Insights",
              desc: "Dashboards to monitor match time, continuity, capacity, and revenue.",
            },
          ].map(c => (
            <motion.div
              key={c.title}
              variants={item}
              className="solaris-card solaris-glow rounded-2xl p-6 lg:p-7"
            >
              <span className="h-12 w-12 rounded-xl bg-muted grid place-items-center border border-white/10">
                <c.icon className="w-6 h-6 group-hover:text-white" />
              </span>
              <h4 className="mt-6 text-[17px] font-semibold leading-tight">
                {c.title}
              </h4>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {c.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ——— Transform Your Business — 4 use-case cards ——— */}
      <section className="py-10 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Care delivery across your organization
          </h2>
          <p className="mt-3 text-muted-foreground">
            Pediatric expertise, everywhere you operate
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 grid md:grid-cols-2 gap-4"
        >
          {[
            {
              badge: "Triage & Intake",
              title: "24/7 Intelligent Intake",
              desc: "Nurses capture vitals, vitals engine flags risk, matcher recommends — in one flow.",
              metric: "80% less triage time",
            },
            {
              badge: "Specialist Network",
              title: "On-Demand Subspecialists",
              desc: "Cardiology, neurology, surgery, NICU — available without transfer.",
              metric: "3× faster to right specialist",
            },
            {
              badge: "Continuity",
              title: "10-Stage Pipeline",
              desc: "From registration to closure with automated follow-ups and no child left behind.",
              metric: "94.2% continuity compliance",
            },
            {
              badge: "Operations",
              title: "Capacity Command Center",
              desc: "Live ward occupancy, alerts, and revenue — executive visibility at a glance.",
              metric: "70% faster decisions",
            },
          ].map(c => (
            <motion.div
              key={c.title}
              variants={item}
              className="solaris-card solaris-glow rounded-2xl p-6 lg:p-7 flex flex-col"
            >
              <span className="inline-flex w-fit rounded-full bg-white/[0.08] text-foreground border border-white/10 px-3 py-1 text-xs font-semibold">
                {c.badge}
              </span>
              <h4 className="mt-4 text-xl font-semibold">{c.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground flex-1 leading-relaxed">
                {c.desc}
              </p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Activity className="w-4 h-4" /> {c.metric}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ——— Specialties — minimal list ——— */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-white/[0.06] mt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h3 className="text-sm tracking-[0.14em] uppercase text-muted-foreground">
            Clinical Capabilities
          </h3>
          <h4 className="text-2xl font-bold tracking-tight">
            Core Specialties
          </h4>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {[
            { name: "Pediatric Cardiology", icon: HeartPulse },
            { name: "Neurology", icon: BrainCircuit },
            { name: "Neonatology (NICU)", icon: Baby },
            { name: "Pediatric Surgery", icon: Microscope },
            { name: "Pulmonology", icon: Activity },
            { name: "Endocrinology", icon: Stethoscope },
            { name: "Oncology", icon: ShieldCheck },
            { name: "PICU Critical Care", icon: Activity },
          ].map(s => (
            <motion.div
              key={s.name}
              variants={item}
              className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 hover:border-white/15 hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-lg bg-muted grid place-items-center border border-white/10">
                  <s.icon className="w-4 h-4" />
                </span>
                <span className="text-sm font-medium">{s.name}</span>
              </span>
              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ——— Pricing teaser — Solaris-like 3 cards ——— */}
      <section id="pricing" className="py-16 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Simple pricing, scaled to your network
          </h2>
          <p className="mt-3 text-muted-foreground">
            Start free, scale to enterprise. No credit card required.
          </p>
        </motion.div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10 grid md:grid-cols-3 gap-4"
        >
          {[
            {
              name: "Starter",
              price: "$0",
              note: "Free trial",
              features: [
                "1 facility",
                "Up to 1k matches/mo",
                "Community support",
              ],
            },
            {
              name: "Professional",
              price: "$499",
              note: "/month · best for networks",
              features: [
                "3 facilities",
                "50k matches/mo",
                "Advanced analytics",
                "Priority SLA",
              ],
              featured: true,
            },
            {
              name: "Enterprise",
              price: "Let’s Talk",
              note: "Unlimited scale",
              features: [
                "Unlimited facilities",
                "Unlimited matches",
                "On-premise + custom integrations",
                "Dedicated onboarding",
              ],
            },
          ].map(p => (
            <motion.div
              key={p.name}
              variants={item}
              className={`rounded-2xl p-7 flex flex-col border ${p.featured ? "solaris-card border-white/15 bg-white/[0.04] shadow-[0_16px_48px_rgba(255,255,255,0.08)]" : "solaris-card border-white/10"}`}
            >
              <div className="text-sm font-semibold tracking-wide">
                {p.name}
              </div>
              <div className="mt-2 text-3xl font-black tracking-tight">
                {p.price}
              </div>
              <div
                className={`text-xs ${p.featured ? "text-black/60" : "text-muted-foreground"}`}
              >
                {p.note}
              </div>
              <ul className="mt-6 space-y-2.5 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <span
                      className={`h-5 w-5 rounded-full grid place-items-center shrink-0 ${p.featured ? "bg-white text-black" : "bg-white/[0.08] text-foreground border border-white/10"}`}
                    >
                      <Check className="w-3 h-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 h-10 rounded-full text-sm font-semibold transition-colors cursor-pointer ${p.featured ? "bg-white/[0.08] text-foreground border border-white/10 hover:bg-white/90" : "bg-white/[0.06] text-foreground border border-white/10 hover:bg-white/10"}`}
              >
                {p.featured
                  ? "Start 14-Day Trial"
                  : p.name === "Starter"
                    ? "Get Started"
                    : "Contact Sales"}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ——— Footer — Solaris ——— */}
      <footer className="border-t border-white/[0.06] mt-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-12">
            <div>
              <h3 className="text-2xl font-bold tracking-tight max-w-md">
                Ready to transform pediatric care?
              </h3>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
              >
                Return to Top <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                  Platform
                </div>
                <ul className="mt-4 space-y-2.5 text-sm">
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-white transition-colors"
                    >
                      Command Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/intake"
                      className="hover:text-white transition-colors"
                    >
                      Clinical Intake
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/specialist-workspace"
                      className="hover:text-white transition-colors"
                    >
                      Specialist Workspace
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/repository"
                      className="hover:text-white transition-colors"
                    >
                      Knowledge Repository
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <div className="text-xs tracking-[0.14em] uppercase text-muted-foreground">
                  Compliance
                </div>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  <li>HIPAA / DPDP 2023</li>
                  <li>SOC 2 Ready</li>
                  <li>Audit Log Trace</li>
                  <li>10-Stage Pipeline</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06] pt-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <HeartPulse className="w-4 h-4" /> © 2026 Pediatric Care Network
            </span>
            <span>Powered by Solaris-grade coordination</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
