import { DatePicker } from "../components/ui/date-picker";
import React, { useState } from "react";
import { usePediatric } from "../context/PediatricContext";
import {
  CheckCircle,
  XCircle,
  Activity,
  Save,
  CheckSquare,
  Stethoscope,
  BriefcaseMedical,
  Video,
  Pill,
  MessageSquare,
  FileHeart,
  ClipboardList,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TeleconsultModal } from "../components/TeleconsultModal";
import { useAuth } from "../context/AuthContext";
import { QuickChat } from "../components/QuickChat";
import { GrowthChart } from "../components/GrowthChart";
import { VaccinationSchedule } from "../components/VaccinationSchedule";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function SpecialistWorkspacePage() {
  const { user } = useAuth();
  const { cases, updateCaseStage, addClinicalNote, closeCase, getPatientById } =
    usePediatric();

  // Find cases assigned to a mock specialist, or pending recommendation
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // States for different sections
  const [declineReason, setDeclineReason] = useState("");
  const [icdCode, setIcdCode] = useState("");
  const [consultOutcome, setConsultOutcome] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [isTeleconsultOpen, setIsTeleconsultOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("consultation");

  const pendingCases = cases.filter(
    c => c.currentStage === 5 || c.currentStage === 4
  );
  const activeCases = cases.filter(
    c => c.currentStage >= 6 && c.currentStage < 10
  );

  const selectedCase = cases.find(c => c.id === selectedCaseId);
  const patient = selectedCase
    ? getPatientById(selectedCase.patientId)
    : undefined;

  const handleAccept = (caseId: string) => {
    updateCaseStage(
      caseId,
      6,
      "Specialist accepted referral. Consultation initiated."
    );
    setSelectedCaseId(caseId);
  };

  const handleDecline = (caseId: string) => {
    if (!declineReason) {
      alert("You must select a reason to decline.");
      return;
    }
    updateCaseStage(caseId, 4, `Referral declined: ${declineReason}`);
    setDeclineReason("");
  };

  const handleDiagnosisSubmit = () => {
    if (!selectedCaseId || !icdCode || !consultOutcome) return;
    addClinicalNote(
      selectedCaseId,
      `Consultation Outcome: ${consultOutcome} | Diagnosis: ${icdCode}`
    );
    updateCaseStage(selectedCaseId, 8, `Diagnosis confirmed: ${icdCode}`);
    setIcdCode("");
    setConsultOutcome("");
  };

  const handleTreatmentPlanSubmit = () => {
    if (!selectedCaseId || !treatmentPlan) return;
    addClinicalNote(
      selectedCaseId,
      `Treatment Plan Initiated: ${treatmentPlan}`
    );
    updateCaseStage(
      selectedCaseId,
      9,
      "Treatment plan initiated and monitoring active"
    );
    setTreatmentPlan("");
  };

  const handleCaseClosure = () => {
    if (!selectedCaseId) return;
    const res = closeCase(selectedCaseId, true);
    if (!res.success) {
      alert(res.error);
    } else {
      setSelectedCaseId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8">
      <div className="flex items-center space-x-3 mb-6 border-b pb-6">
        <Stethoscope className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">
          Specialist Workspace
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Case Queue */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-primary/20">
            <div className="bg-primary p-4 text-primary-foreground">
              <h2 className="text-lg font-semibold">Referral Inbox</h2>
            </div>
            <CardContent className="p-4 space-y-4 max-h-[300px] overflow-y-auto bg-muted/10">
              {pendingCases.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No pending referrals.
                </p>
              )}
              {pendingCases.map(c => (
                <div
                  key={c.id}
                  className="border rounded-lg p-4 bg-card hover:border-primary/50 transition-colors shadow-sm"
                >
                  <div className="font-bold">{c.patientName}</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {c.primaryCondition}
                  </div>
                  <div className="flex space-x-2 mb-4">
                    <Button
                      onClick={() => handleAccept(c.id)}
                      className="w-full bg-primary hover:bg-primary gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" /> Accept
                    </Button>
                  </div>
                  <div className="space-y-3 pt-3 border-t">
                    <Select
                      value={declineReason}
                      onValueChange={val => setDeclineReason(val || "")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select decline reason..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Over capacity">
                          Over capacity
                        </SelectItem>
                        <SelectItem value="Outside sub-specialty">
                          Outside sub-specialty
                        </SelectItem>
                        <SelectItem value="Conflict of interest">
                          Conflict of interest
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => handleDecline(c.id)}
                      className="w-full text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Decline
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="text-lg">My Active Cases</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
              {activeCases.map(c => (
                <Button
                  key={c.id}
                  variant={selectedCaseId === c.id ? "default" : "outline"}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`w-full justify-start flex-col items-start h-auto p-3 ${selectedCaseId === c.id ? "" : "hover:border-primary/50"}`}
                >
                  <div className="font-semibold text-base">{c.patientName}</div>
                  <div
                    className={`text-xs mt-1 ${selectedCaseId === c.id ? "text-primary-foreground/80" : "text-primary"}`}
                  >
                    Stage: {c.currentStage}
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Workspace Area */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCase ? (
            <div className="space-y-6">
              {/* Patient Details Header */}
              <Card>
                <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedCase.patientName}
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">
                      ID: {selectedCase.patientId} • Age: {selectedCase.ageText}{" "}
                      • Ward: {selectedCase.ward}
                    </p>
                    <p className="mt-3 text-sm">
                      <strong>Chief Complaint:</strong>{" "}
                      {selectedCase.chiefComplaint}
                    </p>
                  </div>
                  <div className="text-left md:text-right bg-muted/50 p-4 rounded-lg border h-fit">
                    <div className="text-xs uppercase text-muted-foreground font-bold tracking-wider mb-2">
                      Latest Vitals
                    </div>
                    <div className="text-sm font-medium whitespace-nowrap">
                      HR:{" "}
                      <span className="text-destructive font-bold">
                        {selectedCase.vitals?.heartRate}
                      </span>{" "}
                      | SpO2: {selectedCase.vitals?.spO2}% | Temp:{" "}
                      {selectedCase.vitals?.temperature}°C
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Patient Historical Data: Growth & Vaccinations */}
              {patient?.growthRecords && patient.growthRecords.length > 0 && (
                <GrowthChart records={patient.growthRecords} />
              )}
              {patient?.vaccinations && patient.vaccinations.length > 0 && (
                <VaccinationSchedule records={patient.vaccinations} />
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start gap-1 bg-white/[0.04] border border-white/10 rounded-xl p-1 h-auto flex-wrap">
                  <TabsTrigger value="consultation" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg"><Activity className="w-4 h-4" /> Consultation</TabsTrigger>
                  <TabsTrigger value="prescriptions" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg"><Pill className="w-4 h-4" /> Prescriptions</TabsTrigger>
                  <TabsTrigger value="plan" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg"><BriefcaseMedical className="w-4 h-4" /> Treatment Plan</TabsTrigger>
                  <TabsTrigger value="chat" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg"><MessageSquare className="w-4 h-4" /> Team Chat</TabsTrigger>
                  <TabsTrigger value="closure" className="gap-1.5 data-[state=active]:bg-white data-[state=active]:text-black rounded-lg"><CheckCircle className="w-4 h-4" /> Closure</TabsTrigger>
                </TabsList>

                <TabsContent value="consultation" className="mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Consultation & Diagnosis
                  </CardTitle>
                  <Button
                    onClick={() => setIsTeleconsultOpen(true)}
                    className="gap-2 rounded-full bg-white text-black hover:bg-white/90"
                  >
                    <Video className="w-4 h-4" /> Virtual Consult
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mt-4">
                    <div className="space-y-2">
                      <Label>Consult Duration (mins)</Label>
                      <Input type="number" placeholder="e.g. 15" />
                    </div>
                    <div className="space-y-2">
                      <Label>ICD-10/ICD-11 Code</Label>
                      <Select
                        value={icdCode}
                        onValueChange={val => setIcdCode(val || "")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select diagnosis..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Q21.0 - Ventricular Septal Defect">
                            Q21.0 - Ventricular Septal Defect
                          </SelectItem>
                          <SelectItem value="G40.3 - Generalized Idiopathic Epilepsy">
                            G40.3 - Generalized Idiopathic Epilepsy
                          </SelectItem>
                          <SelectItem value="J21.9 - Acute Bronchiolitis, Unspecified">
                            J21.9 - Acute Bronchiolitis, Unspecified
                          </SelectItem>
                          <SelectItem value="Q21.3 - Tetralogy of Fallot">
                            Q21.3 - Tetralogy of Fallot
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Consultation Outcome</Label>
                      <Input
                        type="text"
                        placeholder="e.g., Patient stable, continue meds"
                        value={consultOutcome}
                        onChange={e => setConsultOutcome(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleDiagnosisSubmit}
                    disabled={!icdCode || !consultOutcome}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Diagnosis
                  </Button>
                </CardContent>
              </Card>

                </TabsContent>
                <TabsContent value="prescriptions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-primary" />
                    Prescribe & Schedule Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <Label>Add Prescription</Label>
                      <Textarea
                        placeholder="e.g. Amoxicillin 250mg, 1 tablet q8h for 7 days"
                        className="min-h-[120px]"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Schedule Follow-up</Label>
                        <DatePicker className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <Label>Visit Type</Label>
                        <Select defaultValue="in-person">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in-person">
                              In-person Visit
                            </SelectItem>
                            <SelectItem value="teleconsult">
                              Teleconsultation
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-primary hover:bg-primary gap-2">
                    <Save className="w-4 h-4" /> Issue Prescription & Schedule
                  </Button>
                </CardContent>
              </Card>

                </TabsContent>
                <TabsContent value="plan" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BriefcaseMedical className="w-5 h-5 text-primary" />
                    Treatment Plan Builder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <Label>Protocol / Interventions / Milestones</Label>
                    <Textarea
                      placeholder="Enter personalized treatment plan linked to evidence-based protocol..."
                      className="min-h-[120px]"
                      value={treatmentPlan}
                      onChange={e => setTreatmentPlan(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleTreatmentPlanSubmit}
                    disabled={!treatmentPlan}
                    className="bg-primary hover:bg-primary gap-2"
                  >
                    <CheckSquare className="w-4 h-4" /> Initiate Plan
                  </Button>
                </CardContent>
              </Card>

                </TabsContent>
                <TabsContent value="closure" className="mt-4">
              <Card className="bg-card border-white/10 solaris-card">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-primary">
                      Clinical Resolution
                    </h3>
                    <p className="text-sm text-primary mt-1">
                      Sign off on this case to confirm all milestones have been
                      met.
                    </p>
                  </div>
                  <Button
                    onClick={handleCaseClosure}
                    className="bg-primary hover:bg-primary gap-2 shrink-0"
                    size="lg"
                  >
                    <CheckCircle className="w-5 h-5" /> Sign-off & Close Case
                  </Button>
                </CardContent>
              </Card>
                </TabsContent>
                <TabsContent value="chat" className="mt-4">
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4" /> Team collaboration — select doctors and chat below
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card className="border-dashed bg-card border-white/10 solaris-card">
              <CardContent className="h-[400px] flex flex-col items-center justify-center text-center">
                <Stethoscope className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Case Selected</h3>
                <p className="text-muted-foreground">
                  Select a case from your queue to begin.
                </p>
              </CardContent>
            </Card>
          )}

          {selectedCase && (
            <div className="mt-8">
              <QuickChat
                patientId={selectedCase.patientId}
                currentUserId={user?.id || "U-SPEC"}
                currentUserName={user?.name || "Specialist"}
                currentUserRole="Specialist"
              />
            </div>
          )}
        </div>
      </div>

      {selectedCase && (
        <TeleconsultModal
          isOpen={isTeleconsultOpen}
          onClose={() => setIsTeleconsultOpen(false)}
          patientName={selectedCase.patientName}
          specialistName={selectedCase.assignedSpecialistName || "Specialist"}
        />
      )}
    </div>
  );
}
