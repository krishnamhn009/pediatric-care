import React from "react";
import { Activity, ShieldCheck, HeartPulse, Stethoscope, Microscope, BrainCircuit, Baby, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const LandingStaticSections: React.FC = () => {
  return (
    <div className="bg-white text-slate-900 font-sans relative z-10">
      
      {/* Metrics / Impact Section */}
      <section className="bg-slate-950 text-white py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-12">
            {[
              { label: "Pediatric Specialists", value: "140+" },
              { label: "Average Match Time", value: "< 2 min" },
              { label: "Successful Outcomes", value: "98.4%" },
              { label: "Partner Facilities", value: "24" }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                className="flex flex-col"
              >
                <span className="text-5xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-500 mb-2">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold tracking-widest uppercase text-slate-400">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-32 px-6 bg-[#ECFEFF] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#164E63] leading-none max-w-2xl">
              An ecosystem designed around the child.
            </h2>
            <p className="text-lg text-[#164E63]/70 font-medium max-w-md">
              We replace fragmented healthcare with a continuous, intelligent, and highly specialized safety net.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity className="w-8 h-8 text-cyan-600" />,
                title: "Predictive Analytics",
                desc: "Our ML engines constantly monitor patient vitals to detect clinical deterioration long before human alerts."
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-cyan-600" />,
                title: "Strict Governance",
                desc: "Every clinical decision and case closure is permanently logged in a tamper-evident audit trail."
              },
              {
                icon: <Stethoscope className="w-8 h-8 text-cyan-600" />,
                title: "Teleconsultation",
                desc: "Instant encrypted video routing brings the expert directly to the child, no matter their physical location."
              }
            ].map((offer, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                className="bg-white p-10 border border-cyan-100 hover:shadow-xl transition-shadow group"
              >
                <div className="bg-cyan-50 w-16 h-16 flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform">
                  {offer.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#164E63] mb-4">{offer.title}</h3>
                <p className="text-[#164E63]/70 leading-relaxed">{offer.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-sm font-bold tracking-widest uppercase text-blue-600 mb-4">Clinical Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-12">Core Specialties</h3>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {[
              { name: "Pediatric Cardiology", icon: <HeartPulse /> },
              { name: "Neurology", icon: <BrainCircuit /> },
              { name: "Neonatology (NICU)", icon: <Baby /> },
              { name: "Pediatric Surgery", icon: <Microscope /> },
              { name: "Pulmonology", icon: <Activity /> },
              { name: "Endocrinology", icon: <Stethoscope /> },
              { name: "Oncology", icon: <ShieldCheck /> },
              { name: "PICU Critical Care", icon: <Activity /> }
            ].map((spec, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                className="group border-b border-slate-200 pb-4 flex justify-between items-center cursor-pointer hover:border-slate-900 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
                    {spec.icon}
                  </div>
                  <span className="font-bold text-slate-700 group-hover:text-slate-900 text-lg transition-colors">
                    {spec.name}
                  </span>
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-slate-950 text-white pt-32 pb-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 mb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8">
                Ready to transform pediatric care?
              </h2>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="bg-white text-slate-950 px-8 py-4 font-bold rounded-none hover:bg-slate-200 transition-colors flex items-center gap-3">
                Return to Top <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="grid grid-cols-2 gap-8"
            >
              <div>
                <h4 className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-6">Platform</h4>
                <ul className="space-y-4 font-semibold text-slate-300">
                  <li><Link to="/dashboard" className="hover:text-white transition-colors">Command Center</Link></li>
                  <li><Link to="/intake" className="hover:text-white transition-colors">Clinical Intake</Link></li>
                  <li><Link to="/specialist-workspace" className="hover:text-white transition-colors">Specialist Workspace</Link></li>
                  <li><Link to="/knowledge" className="hover:text-white transition-colors">Knowledge Repository</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-500 uppercase tracking-widest text-xs mb-6">Legal</h4>
                <ul className="space-y-4 font-semibold text-slate-300">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5" />
              <span>© 2026 Pediatric Care Network. All rights reserved.</span>
            </div>
            <div>
              Powered by Advanced Agentic Solutions
            </div>
          </motion.div>
        </div>
      </footer>

    </div>
  );
};
