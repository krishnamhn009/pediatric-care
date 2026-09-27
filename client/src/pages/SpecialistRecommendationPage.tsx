import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  BrainCircuit,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  FileHeart,
} from "lucide-react";
import { usePediatric, Specialist } from "../context/PediatricContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const SpecialistRecommendationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const caseIdFromUrl = searchParams.get("caseId");

  const { cases, specialists, acceptSpecialist, overrideSpecialist } =
    usePediatric();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    caseIdFromUrl || cases[0]?.id || "CASE-2026-001"
  );

  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideTargetSpec, setOverrideTargetSpec] =
    useState<Specialist | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideCategory, setOverrideCategory] = useState(
    "Patient/Family Preference"
  );

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const rankedSpecialists = useMemo(() => {
    if (!activeCase) return specialists;

    return [...specialists].sort((a, b) => {
      let scoreA = a.matchScoreDefault;
      let scoreB = b.matchScoreDefault;

      if (
        activeCase.primaryCondition.toLowerCase().includes("cardiac") ||
        activeCase.primaryCondition.toLowerCase().includes("vsd")
      ) {
        if (a.specialty === "Cardiology") scoreA += 5;
        if (b.specialty === "Cardiology") scoreB += 5;
      } else if (
        activeCase.primaryCondition.toLowerCase().includes("seizure") ||
        activeCase.primaryCondition.toLowerCase().includes("epilep")
      ) {
        if (a.specialty === "Neurology") scoreA += 5;
        if (b.specialty === "Neurology") scoreB += 5;
      }

      return scoreB - scoreA;
    });
  }, [activeCase, specialists]);

  const handleAccept = (spec: Specialist) => {
    if (!activeCase) return;
    acceptSpecialist(activeCase.id, spec.id, "Dr. Anitha Raman");
  };

  const openOverrideModal = (spec: Specialist) => {
    setOverrideTargetSpec(spec);
    setOverrideReason("");
    setOverrideModalOpen(true);
  };

  const handleConfirmOverride = () => {
    if (!activeCase || !overrideTargetSpec || !overrideReason.trim()) return;

    const fullReason = `[${overrideCategory}] ${overrideReason.trim()}`;
    overrideSpecialist(
      activeCase.id,
      overrideTargetSpec.id,
      fullReason,
      "Dr. Prabhu"
    );
    setOverrideModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <BrainCircuit className="h-4 w-4" /> Stage 5 & 6 Care Journey
          </div>
          <h1 className="text-3xl font-bold mt-1">
            Intelligent Specialist Recommendation Engine
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            AI clinical match scoring across Cardiology, Neurology, and Surgery.
            Human decision is mandatory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Label>Selected Case:</Label>
          <Select
            value={selectedCaseId}
            onValueChange={val => setSelectedCaseId(val || "")}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cases.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.patientName} ({c.id}) - Urgency: {c.urgency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-primary/10 text-primary-foreground border border-primary/20 p-4 rounded-lg flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm leading-relaxed text-foreground">
          <strong className="block font-bold mb-1">
            Strict Clinical Governance Policy:
          </strong>
          This recommendation engine generates ranked candidate specialists
          using clinical acuity, subspecialty alignment, and response SLA data.{" "}
          <span className="underline font-bold">
            The system never auto-assigns a specialist
          </span>
          . A clinician must explicitly click <strong>Accept</strong> or
          document a structured text reason when choosing an{" "}
          <strong>Override</strong>.
        </div>
      </div>

      {activeCase && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardDescription className="text-[10px] font-bold uppercase tracking-wider">
                  Current Case Context
                </CardDescription>
                <CardTitle className="text-xl mt-1">
                  {activeCase.patientName} ({activeCase.patientId})
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Age: {activeCase.ageText} · Ward: {activeCase.ward} · Urgency:{" "}
                  <span className="font-bold text-destructive">
                    {activeCase.urgency}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  Care Stage: {activeCase.currentStage} / 10
                </Badge>
                <Button
                  variant="link"
                  size="sm"
                  render={
                    <Link
                      to={`/patients/${activeCase.patientId}`}
                      className="flex items-center gap-1"
                    />
                  }
                  className="h-auto p-0"
                >
                  <FileHeart className="h-4 w-4" /> Open Full Health Record
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <strong className="text-muted-foreground block text-xs">
                  Primary Condition:
                </strong>
                <span className="font-semibold">
                  {activeCase.primaryCondition}
                </span>
              </div>
              <div>
                <strong className="text-muted-foreground block text-xs">
                  Chief Complaint:
                </strong>
                <span className="font-semibold">
                  {activeCase.chiefComplaint}
                </span>
              </div>
            </div>

            {activeCase.assignedSpecialistName && (
              <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="flex items-center gap-2 font-bold text-sm text-primary">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Assigned Specialist: {activeCase.assignedSpecialistName}
                  </span>
                  {activeCase.overrideReason && (
                    <span className="text-xs font-semibold text-primary/80 mt-1 block">
                      (Assigned via Clinician Override)
                    </span>
                  )}
                </div>
                <Button
                  render={<Link to="/specialist-workspace" className="gap-2" />}
                  className="bg-primary hover:bg-primary"
                >
                  Proceed to Consultation <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Ranked Specialist Recommendations</h3>
        {rankedSpecialists.map((spec, index) => {
          const isTopMatch = index === 0;
          const isCurrentlyAssigned =
            activeCase?.assignedSpecialistId === spec.id;

          return (
            <Card
              key={spec.id}
              className={`transition-all ${isCurrentlyAssigned ? "border-border ring-1 ring-border" : isTopMatch ? "border-primary/50 bg-primary/5" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={spec.avatar}
                      alt={spec.name}
                      className="h-16 w-16 rounded-lg object-cover ring-1 ring-border shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          className="text-[10px] uppercase"
                        >
                          #{index + 1} Recommendation
                        </Badge>
                        <span className="text-xs font-bold text-primary">
                          {spec.specialty}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold">{spec.name}</h4>
                      <p className="text-sm font-medium text-muted-foreground">
                        {spec.title} · {spec.subSpecialty}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {spec.hospitalAffiliation} · {spec.experienceYears}{" "}
                        Years Experience
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row gap-6 md:px-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {spec.matchScoreDefault}%
                      </div>
                      <div className="text-[10px] uppercase font-semibold text-muted-foreground">
                        Match Score
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">
                        {spec.responseSlaMinutes}m
                      </div>
                      <div className="text-[10px] uppercase font-semibold text-muted-foreground">
                        Response SLA
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">
                        {spec.activeCasesCount} / {spec.maxCapacity}
                      </div>
                      <div className="text-[10px] uppercase font-semibold text-muted-foreground">
                        Active Load
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    {isCurrentlyAssigned ? (
                      <Button
                        variant="default"
                        className="bg-primary hover:bg-primary pointer-events-none gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Currently Assigned
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="text-primary hover:text-primary hover:bg-muted border-border"
                          onClick={() => openOverrideModal(spec)}
                        >
                          Override & Select
                        </Button>
                        <Button
                          className="gap-2"
                          onClick={() => handleAccept(spec)}
                        >
                          <CheckCircle2 className="h-4 w-4" /> Accept Match
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-4 bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground border">
                  <strong className="text-foreground">
                    Clinical Rationale:{" "}
                  </strong>
                  {spec.rationale}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-dashed border-border bg-muted/30">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary">Phase 3 Analytics</Badge>
              <h3 className="font-bold text-primary">
                External Partner Network Routing
              </h3>
            </div>
            <p className="text-sm text-primary/80 max-w-xl">
              If local network specialists cannot meet the required acuity, SLA,
              or subspecialty, you can query the extended regional partner
              network for an immediate placement.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-border text-primary hover:bg-muted shrink-0 gap-2"
          >
            Query External Network <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Dialog open={overrideModalOpen} onOpenChange={setOverrideModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" /> Confirm
              Specialist Override
            </DialogTitle>
            <DialogDescription>
              You are overriding the system's top recommendation for{" "}
              <strong className="text-foreground">
                {activeCase?.patientName}
              </strong>{" "}
              and manually selecting{" "}
              <strong className="text-foreground">
                {overrideTargetSpec?.name}
              </strong>{" "}
              ({overrideTargetSpec?.specialty}).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Override Category Reason *</Label>
              <Select
                value={overrideCategory}
                onValueChange={val => setOverrideCategory(val || "")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Patient/Family Preference">
                    Patient / Family Request
                  </SelectItem>
                  <SelectItem value="Prior Surgical History">
                    Prior Surgical Relationship
                  </SelectItem>
                  <SelectItem value="On-Call Coverage Shift">
                    On-Call Coverage Shift Conflict
                  </SelectItem>
                  <SelectItem value="Specialized Equipment">
                    Specialized Equipment Requirement
                  </SelectItem>
                  <SelectItem value="Custom Clinical Reason">
                    Custom Clinical Judgement
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Structured Text Reason (Mandatory) *</Label>
              <Textarea
                required
                value={overrideReason}
                onChange={e => setOverrideReason(e.target.value)}
                placeholder="Document the exact clinical or operational reason for this override..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOverrideModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!overrideReason.trim()}
              onClick={handleConfirmOverride}
              className="bg-primary hover:bg-primary text-primary-foreground"
            >
              Confirm Override & Log to Audit Trail
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
