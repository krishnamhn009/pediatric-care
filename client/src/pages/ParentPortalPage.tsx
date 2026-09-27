import React, { useState } from "react";
import { usePediatric } from "../context/PediatricContext";
import {
  User,
  Activity,
  Clock,
  FileText,
  RefreshCcw,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { GrowthChart } from "../components/GrowthChart";
import { VaccinationSchedule } from "../components/VaccinationSchedule";
import { PaymentHistory } from "../components/PaymentHistory";
import { PaymentModal } from "../components/PaymentModal";
import { CreditCard } from "lucide-react";

export function ParentPortalPage() {
  const { cases, specialists, getPatientById, payments } = usePediatric();

  // For demo, we just pick the first case that has an assigned specialist
  const activeCase = cases.find(c => c.assignedSpecialistId) || cases[0];
  const assignedSpecialist = specialists.find(
    s => s.id === activeCase?.assignedSpecialistId
  );
  const patient = activeCase ? getPatientById(activeCase.patientId) : undefined;
  const [secondOpinionRequested, setSecondOpinionRequested] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const handleSecondOpinion = () => {
    // In a real app, this would trigger a frictionless request to the backend.
    setSecondOpinionRequested(true);
    setTimeout(() => {
      alert(
        "Second opinion request logged successfully. A Care Coordinator will contact you shortly."
      );
    }, 500);
  };

  if (!activeCase) {
    return (
      <div className="p-4 sm:p-6 min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">
          No active cases found for this portal.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-10 font-sans animate-in fade-in zoom-in duration-500">
      {/* Mobile-Friendly Header */}
      <div className="bg-card/80 backdrop-blur border-b border-white/10 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Parent Portal</h1>
          </div>
          <div className="text-sm font-medium text-primary bg-muted px-3 py-1 rounded-none">
            {activeCase.patientName}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => setIsPaymentOpen(true)}
            className="bg-white/[0.06] border border-white/10 text-foreground px-4 py-2 flex items-center rounded-full text-sm font-medium hover:bg-white/10 hover:border-white/15 backdrop-blur"
          >
            <CreditCard className="w-4 h-4 mr-2" /> Make a Payment
          </button>
        </div>
        {/* Journey Tracker */}
        <div className="bg-card rounded-xl border border-white/10 p-5 solaris-card">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-primary" />
            Care Journey
          </h2>
          <div className="relative border-l-2 border-border ml-3 pl-4 pb-2 space-y-6">
            <div className="relative">
              <span className="absolute -left-6 top-1 w-4 h-4 rounded-none bg-white border-2 border-card shadow-none border border-border"></span>
              <p className="font-semibold text-foreground text-sm">
                Stage {activeCase.currentStage}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Current phase of the care plan
              </p>
              <div className="mt-2 bg-muted text-primary text-sm p-3 rounded-none border border-border">
                <strong>What happens next:</strong> Based on the current stage,
                the clinical team is actively monitoring progress and will
                communicate the next steps soon.
              </div>
            </div>
            {/* Mock Future Step */}
            <div className="relative opacity-50">
              <span className="absolute -left-6 top-1 w-4 h-4 rounded-none bg-secondary border-2 border-white shadow-none border border-border"></span>
              <p className="font-semibold text-muted-foreground text-sm">
                Resolution & Discharge
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Final specialist sign-off
              </p>
            </div>
          </div>
        </div>

        {/* Specialist Transparency */}
        {assignedSpecialist && (
          <div className="bg-card rounded-xl shadow-none border border-border border border-border overflow-hidden">
            <div className="bg-card border-b border-border p-5 flex items-center space-x-4">
              <img
                src={assignedSpecialist.avatar}
                alt={assignedSpecialist.name}
                className="w-16 h-16 rounded-none border-2 border-white shadow-md object-cover"
              />
              <div className="text-white">
                <h2 className="text-lg font-bold">{assignedSpecialist.name}</h2>
                <p className="text-muted text-sm font-medium">
                  {assignedSpecialist.title}
                </p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1 text-primary" /> Why were
                  they selected?
                </h3>
                <p className="text-sm text-muted-foreground mt-1 bg-background p-3 rounded-none">
                  {assignedSpecialist.rationale}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-3 rounded-none border border-border text-center">
                  <div className="text-2xl font-bold text-primary">
                    {assignedSpecialist.rating}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                    Outcome Score
                  </div>
                </div>
                <div className="bg-background p-3 rounded-none border border-border text-center">
                  <div className="text-2xl font-bold text-primary">
                    {assignedSpecialist.activeCasesCount * 15}+
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                    Similar Cases
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plain-Language Care Plan */}
        <div className="bg-card rounded-xl border border-white/10 p-5 solaris-card">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary" />
            Your Child's Care Plan
          </h2>
          <div className="space-y-3">
            <div className="p-4 bg-muted border border-border rounded-none">
              <h3 className="font-semibold text-primary text-sm">
                Diagnosis & Goal
              </h3>
              <p className="text-sm text-primary mt-1">
                Your child is being treated for{" "}
                <strong>{activeCase.primaryCondition}</strong>. The primary goal
                is to stabilize and monitor progress closely.
              </p>
            </div>
            <div className="p-4 border border-border rounded-none">
              <h3 className="font-semibold text-foreground text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1 text-muted-foreground" /> Recent
                Updates
              </h3>
              <ul className="mt-2 space-y-2">
                {activeCase.clinicalNotes.slice(0, 2).map(note => (
                  <li
                    key={note.id}
                    className="text-sm text-muted-foreground flex items-start"
                  >
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-none mt-1.5 mr-2 flex-shrink-0"></span>
                    <span>{note.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Growth & Vaccination */}
        {patient?.growthRecords && patient.growthRecords.length > 0 && (
          <GrowthChart records={patient.growthRecords} />
        )}

        {patient?.vaccinations && patient.vaccinations.length > 0 && (
          <VaccinationSchedule records={patient.vaccinations} />
        )}

        {/* Second Opinion Workflow */}
        <div className="bg-card rounded-xl shadow-none border border-border border border-border p-5 flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-muted rounded-none flex items-center justify-center text-primary">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Want another perspective?
            </h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              We completely support your right to a second opinion. It's fast,
              free, and won't disrupt current care.
            </p>
          </div>
          <button
            onClick={handleSecondOpinion}
            disabled={secondOpinionRequested}
            className={`mt-2 w-full sm:w-auto px-6 py-3 rounded-full font-medium flex items-center justify-center transition-all border ${
              secondOpinionRequested
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-white text-black hover:bg-white/90"
            }`}
          >
            {secondOpinionRequested ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" /> Request Received
              </>
            ) : (
              <>
                <RefreshCcw className="w-5 h-5 mr-2" /> Request Second Opinion
              </>
            )}
          </button>
        </div>
        {patient && payments && (
          <PaymentHistory payments={payments} patientId={patient.id} />
        )}
      </div>

      {patient && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          patientId={patient.id}
          amount={1500}
          description="Follow-up Consultation Fee"
        />
      )}
    </div>
  );
}
