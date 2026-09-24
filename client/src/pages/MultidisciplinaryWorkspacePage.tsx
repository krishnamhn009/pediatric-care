import React, { useState } from "react";
import { usePediatric } from "../context/PediatricContext";
import {
  Users,
  FileText,
  CheckCircle2,
  MessageSquare,
  Video,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const MultidisciplinaryWorkspacePage: React.FC = () => {
  const {
    cases,
    specialists,
    addAuditEntry,
    updateCaseStage,
    addClinicalNote,
  } = usePediatric();

  // Find cases that might need MDT (e.g. Stage 7 or 8)
  const mdtCases = cases.filter(
    c => c.currentStage >= 6 && c.currentStage <= 9
  );
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(
    mdtCases[0]?.id || null
  );
  const [decisionText, setDecisionText] = useState("");
  const [guardianInformed, setGuardianInformed] = useState(false);

  const selectedCase = mdtCases.find(c => c.id === selectedCaseId);

  const handlePublishDecision = () => {
    if (!selectedCaseId || !decisionText) return;

    addClinicalNote(
      selectedCaseId,
      `MDT Decision Published: ${decisionText}. ${guardianInformed ? "Guardian acknowledged." : "Guardian notification pending."}`,
      "Tumor/MDT Board"
    );

    // Log audit
    addAuditEntry({
      user: "Tumor Board / MDT",
      userRole: "Specialist",
      actionType: "NOTE_ADDED",
      caseId: selectedCaseId,
      summary: "Multidisciplinary team decision published.",
      details: decisionText,
    });

    setDecisionText("");
    alert("MDT Decision published successfully.");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Multidisciplinary Team Workspace
          </h1>
          <p className="text-muted-foreground mt-2">
            Shared collaborative space for complex cases spanning multiple
            sub-specialties.
          </p>
        </div>
        <Button className="gap-2">
          <Video className="h-4 w-4" /> Convene Secure Virtual MDT Call
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>MDT Queue (Complex Cases)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mdtCases.map(c => (
                <Button
                  key={c.id}
                  variant={selectedCaseId === c.id ? "default" : "outline"}
                  onClick={() => setSelectedCaseId(c.id)}
                  className={`w-full justify-start h-auto flex-col items-start p-4 ${selectedCaseId === c.id ? "" : "hover:border-primary/50"}`}
                >
                  <div className="font-semibold text-base">{c.patientName}</div>
                  <div
                    className={`text-xs mt-1 ${selectedCaseId === c.id ? "text-primary-foreground/80" : "text-primary"}`}
                  >
                    {c.primaryCondition}
                  </div>
                </Button>
              ))}
              {mdtCases.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No active cases flagged for MDT.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {selectedCase ? (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between pb-4">
                <div>
                  <CardTitle className="text-2xl">
                    {selectedCase.patientName}{" "}
                    <span className="text-base font-normal text-muted-foreground font-mono ml-2">
                      ({selectedCase.patientId})
                    </span>
                  </CardTitle>
                  <CardDescription className="font-medium mt-1">
                    Chief Complaint: {selectedCase.chiefComplaint}
                  </CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-muted text-primary uppercase pointer-events-none"
                >
                  MDT Review Required
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                      Assigned Specialist
                    </h3>
                    <div className="font-semibold">
                      {selectedCase.assignedSpecialistName || "None"}
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                      Requested MDT Participants
                    </h3>
                    <div className="font-semibold">
                      Cardiology, Neurology, Surgery
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" /> Document
                    MDT Decision & Rationale
                  </h3>

                  <div className="space-y-4">
                    <Textarea
                      value={decisionText}
                      onChange={e => setDecisionText(e.target.value)}
                      placeholder="Enter collaborative clinical decision, evidence considered, and updated treatment protocol..."
                      className="min-h-[120px]"
                    />

                    <div className="flex items-center space-x-2 bg-card p-2 rounded-lg">
                      <Checkbox
                        id="guardian"
                        checked={guardianInformed}
                        onCheckedChange={checked =>
                          setGuardianInformed(checked as boolean)
                        }
                      />
                      <Label
                        htmlFor="guardian"
                        className="text-sm font-semibold cursor-pointer"
                      >
                        Guardian informed of outcome and acknowledged
                      </Label>
                    </div>

                    <Button
                      onClick={handlePublishDecision}
                      disabled={!decisionText.trim()}
                      className="w-full"
                      size="lg"
                    >
                      Publish Decision to Health Record
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-dashed bg-muted/30">
              <CardContent className="p-12 text-center flex flex-col items-center justify-center">
                <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h2 className="text-xl font-bold mb-2">No Case Selected</h2>
                <p className="text-muted-foreground">
                  Select a case from the MDT queue to document board decisions.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
