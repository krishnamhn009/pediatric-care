import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FileHeart,
  CalendarDays,
  Droplets,
  FileText,
  FileImage,
  Activity,
  CheckCircle2,
  Download,
  Eye,
  MessageSquare,
} from "lucide-react";
import { usePediatric, CARE_STAGES } from "../context/PediatricContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type RecordTab = "overview" | "timeline" | "documents" | "reports";

export const MasterHealthRecordPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPatientById, getCaseByPatientId, addClinicalNote } =
    usePediatric();

  const patientId = id || "PT-1001";
  const patient = getPatientById(patientId);
  const activeCase = getCaseByPatientId(patientId);

  const [newNoteText, setNewNoteText] = useState("");
  const [previewDocument, setPreviewDocument] = useState<{
    title: string;
    type: string;
    date: string;
    content: string;
  } | null>(null);

  if (!patient || !activeCase) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Patient Record Not Found</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Patient ID: {patientId}
        </p>
        <Button render={<Link to="/dashboard"></Link>} className="mt-4">
          Return to Command Center
        </Button>
      </div>
    );
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addClinicalNote(activeCase.id, newNoteText.trim(), "Dr. Anitha Raman");
    setNewNoteText("");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-8">
      <div className="rounded-xl overflow-hidden shadow-sm border bg-card">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">
                <FileHeart className="h-4 w-4" /> Longitudinal Master Health
                Record
              </div>
              <h1 className="text-3xl font-bold mt-1">{patient.fullName}</h1>
              <p className="text-sm text-primary-foreground/90 mt-1">
                Patient ID:{" "}
                <span className="font-mono font-medium">{patient.id}</span> ·
                Case ID:{" "}
                <span className="font-mono font-medium">{activeCase.id}</span>
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.print()}
                className="print:hidden gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export Record
              </Button>
              <Badge
                variant="outline"
                className={`bg-background/20 border-transparent text-primary-foreground ${
                  patient.riskCategory === "Critical"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-primary text-primary"
                }`}
              >
                Risk Level: {patient.riskCategory}
              </Badge>
              <Badge
                variant="outline"
                className="bg-background/20 border-transparent text-primary-foreground"
              >
                Ward: {activeCase.ward}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x bg-muted/30 p-4 text-sm">
          <div className="p-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Age & DOB
            </div>
            <div className="font-semibold mt-1 flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-primary" />
              {patient.ageYears} yrs ({patient.dob})
            </div>
          </div>
          <div className="p-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sex & Blood
            </div>
            <div className="font-semibold mt-1 flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-destructive" />
              {patient.gender} · {patient.bloodGroup}
            </div>
          </div>
          <div className="p-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Allergies
            </div>
            <div className="font-semibold mt-1 text-destructive">
              {patient.allergies.join(", ") || "None Known"}
            </div>
          </div>
          <div className="p-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Guardian
            </div>
            <div className="font-semibold mt-1 truncate">
              {patient.guardianName} ({patient.guardianRelation}) ·{" "}
              {patient.guardianPhone}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="overview">Clinical Overview</TabsTrigger>
          <TabsTrigger value="timeline">10-Stage Timeline</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Clinical Condition & Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <strong className="block text-sm">Chief Complaint:</strong>
                    <span className="text-sm text-muted-foreground">
                      {activeCase.chiefComplaint}
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-xs font-semibold uppercase text-muted-foreground">
                        Assigned Specialist
                      </div>
                      <div className="text-sm font-semibold mt-1">
                        {activeCase.assignedSpecialistName ||
                          "Pending Decision"}
                      </div>
                    </div>
                    <div className="bg-primary/10 text-primary p-4 rounded-lg">
                      <div className="text-xs font-semibold uppercase">
                        Care Stage
                      </div>
                      <div className="text-sm font-semibold mt-1">
                        Stage {activeCase.currentStage} / 10
                      </div>
                    </div>
                    <div className="bg-muted text-primary p-4 rounded-lg">
                      <div className="text-xs font-semibold uppercase">
                        Digital Consent
                      </div>
                      <div className="text-sm font-semibold mt-1 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Verified
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" /> Telemetric
                    Vitals Summary
                  </CardTitle>
                  <CardDescription className="font-mono">
                    Recorded:{" "}
                    {new Date(activeCase.vitals.timestamp).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-xs font-semibold uppercase text-muted-foreground">
                        Heart Rate
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {activeCase.vitals.heartRate}{" "}
                        <span className="text-sm font-normal">bpm</span>
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-xs font-semibold uppercase text-muted-foreground">
                        Resp. Rate
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {activeCase.vitals.respiratoryRate}{" "}
                        <span className="text-sm font-normal">/min</span>
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-xs font-semibold uppercase text-muted-foreground">
                        SpO2
                      </div>
                      <div
                        className={`text-2xl font-bold mt-1 ${activeCase.vitals.spO2 < 95 ? "text-destructive" : "text-primary"}`}
                      >
                        {activeCase.vitals.spO2}%
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-xs font-semibold uppercase text-muted-foreground">
                        Temp
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {activeCase.vitals.temperature}°C
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" /> Add
                    Signed Clinical Note
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddNote} className="space-y-4">
                    <Textarea
                      value={newNoteText}
                      onChange={e => setNewNoteText(e.target.value)}
                      placeholder="Type new clinical evaluation note or progress entry..."
                      className="min-h-[80px]"
                    />
                    <Button type="submit" disabled={!newNoteText.trim()}>
                      Save Note to Record
                    </Button>
                  </form>

                  <div className="mt-6 space-y-4">
                    {activeCase.clinicalNotes.map(note => (
                      <div
                        key={note.id}
                        className="bg-muted/50 p-4 rounded-lg border text-sm"
                      >
                        <div className="flex items-center justify-between font-semibold mb-2">
                          <span>
                            {note.author} ({note.role})
                          </span>
                          <time className="text-xs text-muted-foreground font-mono">
                            {new Date(note.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </div>
                        <p className="text-muted-foreground">{note.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="bg-destructive/10 border-destructive/20 text-destructive p-6 rounded-xl border">
                <div className="flex items-center gap-2 font-semibold uppercase tracking-wider mb-2 text-sm">
                  <Activity className="h-5 w-5" /> Active Safeguard Alerts
                </div>
                <p className="text-sm">
                  Patient is receiving high-acuity telemetry monitoring in PICU.
                  Any modification to oxygen support or specialist assignment
                  requires immediate attending sign-off.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>10-Stage Pediatric Care Journey Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pt-4 pb-8">
                <div className="absolute top-8 left-4 right-4 h-1 bg-muted" />
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2 relative z-10">
                  {CARE_STAGES.map(stage => {
                    const isCompleted =
                      stage.stageNumber <= activeCase.currentStage;
                    const isCurrent =
                      stage.stageNumber === activeCase.currentStage;

                    return (
                      <div
                        key={stage.stageNumber}
                        className="flex flex-col items-center text-center group"
                      >
                        <div
                          className={`grid h-8 w-8 sm:h-10 sm:w-10 place-items-center rounded-full text-xs font-bold transition-all ${
                            isCurrent
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-lg"
                              : isCompleted
                                ? "bg-primary/80 text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {stage.stageNumber}
                        </div>
                        <span className="mt-2 text-[10px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                          {stage.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chronological Audit & Visit History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l ml-4 space-y-6">
                {activeCase.stageHistory.map((hist, i) => (
                  <div key={i} className="ml-6 relative">
                    <span className="absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold ring-4 ring-background">
                      {hist.stageNumber}
                    </span>
                    <div className="bg-muted/50 p-4 rounded-lg border text-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between font-semibold mb-1">
                        <span>
                          Stage {hist.stageNumber}:{" "}
                          {
                            CARE_STAGES.find(
                              s => s.stageNumber === hist.stageNumber
                            )?.name
                          }
                        </span>
                        <time className="text-xs text-muted-foreground font-mono mt-1 sm:mt-0">
                          {new Date(hist.updatedAt).toLocaleString([], {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </time>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Actor: {hist.updatedBy}
                      </div>
                      {hist.note && (
                        <p className="mt-2 text-foreground">{hist.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ...(activeCase.documents?.map(doc => ({
                title: doc.name,
                type: doc.type,
                date: new Date(doc.uploadedAt).toLocaleDateString(),
                icon: doc.type.includes("image") ? FileImage : FileText,
                content: `Simulated uploaded document: ${doc.name}`,
              })) || []),
              {
                title: "Digital Guardian Consent Form",
                type: "Legal Consent",
                date: "2026-09-08",
                icon: FileText,
                content:
                  "HIPAA / DPDP 2023 Digital Consent signed by Sunita Menon (Mother). Verified timestamp 08:30 UTC.",
              },
            ].map((doc, idx) => {
              const Icon = doc.icon;
              return (
                <Card key={idx} className="flex flex-col justify-between">
                  <CardHeader>
                    <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center text-primary mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{doc.title}</CardTitle>
                    <CardDescription>
                      {doc.type} · {doc.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="secondary"
                      className="w-full gap-2"
                      onClick={() => setPreviewDocument(doc)}
                    >
                      <Eye className="h-4 w-4" /> Preview
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Trajectory & Signed Reports</CardTitle>
              <CardDescription>
                Export longitudinal clinical summary for insurance claim or
                inter-hospital transfer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-12 text-center flex flex-col items-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold">
                  Signed Clinical Summary PDF Ready
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Generated: 2026-09-09 · Attending: Dr. Anitha Raman
                </p>
                <Button className="mt-6 gap-2">
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!previewDocument}
        onOpenChange={open => !open && setPreviewDocument(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{previewDocument?.title}</DialogTitle>
          </DialogHeader>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            {previewDocument?.content}
          </div>
          <DialogFooter>
            <Button onClick={() => setPreviewDocument(null)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
