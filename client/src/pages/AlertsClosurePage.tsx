import React, { useState } from "react";
import {
  Siren,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { usePediatric, PatientCase } from "../context/PediatricContext";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export const AlertsClosurePage: React.FC = () => {
  const { cases, alerts, closeCase } = usePediatric();

  const [closingCase, setClosingCase] = useState<PatientCase | null>(null);
  const [specialistSignOff, setSpecialistSignOff] = useState(false);
  const [clinicalResolution, setClinicalResolution] = useState(false);
  const [useException, setUseException] = useState(false);
  const [exceptionReason, setExceptionReason] = useState("");
  const [closureError, setClosureError] = useState("");

  const openCases = cases.filter(c => c.currentStage < 10);

  const handleOpenClosureModal = (c: PatientCase) => {
    setClosingCase(c);
    setSpecialistSignOff(c.specialistSignOff || false);
    setClinicalResolution(false);
    setUseException(false);
    setExceptionReason("");
    setClosureError("");
  };

  const handleConfirmClosure = () => {
    if (!closingCase) return;

    if (!specialistSignOff && (!useException || !exceptionReason.trim())) {
      setClosureError(
        "Strict Governance: You must record explicit Specialist Sign-off OR document a clinical exception reason."
      );
      return;
    }

    const result = closeCase(
      closingCase.id,
      specialistSignOff,
      useException ? exceptionReason.trim() : undefined,
      "Dr. Anitha Raman"
    );

    if (!result.success) {
      setClosureError(result.error || "Failed to close case.");
      return;
    }

    setClosingCase(null);
  };

  const pendingAlerts = closingCase
    ? alerts.filter(a => a.caseId === closingCase.id && !a.acknowledged)
    : [];
  const hasPendingAlerts = pendingAlerts.length > 0;
  const isOverrideReady = useException && exceptionReason.trim().length > 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-destructive">
            <Siren className="h-4 w-4" /> Stage 9 & 10 Care Continuity
          </div>
          <h1 className="text-3xl font-bold mt-1">
            Clinical Escalation & Case Closure Queue
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Continuous evaluation of 5 clinical checkpoints. Strict case closure
            safeguards enforced.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Active 5 Clinical
            Checkpoint Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 text-sm">
            <div className="bg-muted p-4 rounded-lg">
              <strong className="block font-bold mb-1">
                1. Overdue Consult
              </strong>
              <span className="text-muted-foreground text-xs">
                &gt;48h without specialist progress note
              </span>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <strong className="block font-bold mb-1">
                2. Delayed Treatment
              </strong>
              <span className="text-muted-foreground text-xs">
                &gt;24h post assignment without orders
              </span>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <strong className="block font-bold mb-1">
                3. Abnormal Vitals
              </strong>
              <span className="text-muted-foreground text-xs">
                Out-of-range vitals without review
              </span>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <strong className="block font-bold mb-1">
                4. Discharge Checkpoint
              </strong>
              <span className="text-muted-foreground text-xs">
                Missing final discharge sign-off
              </span>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <strong className="block font-bold mb-1">
                5. 7-Day Continuity
              </strong>
              <span className="text-muted-foreground text-xs">
                Post-consultation monitoring check
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Open Cases & Closure Safeguards</CardTitle>
            <CardDescription>
              {openCases.length} Active Open Cases
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-foreground">
                  Patient / Case ID
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Condition & Ward
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Assigned Specialist
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Current Stage
                </TableHead>
                <TableHead className="font-semibold text-foreground">
                  Sign-off Status
                </TableHead>
                <TableHead className="font-semibold text-foreground text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map(c => {
                const isClosed = c.currentStage === 10;
                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-semibold">{c.patientName}</div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {c.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">{c.primaryCondition}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.ward}
                      </div>
                    </TableCell>
                    <TableCell>
                      {c.assignedSpecialistName ? (
                        <span className="font-semibold">
                          {c.assignedSpecialistName}
                        </span>
                      ) : (
                        <span className="text-destructive font-bold text-sm">
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        Stage {c.currentStage} / 10
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isClosed ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-primary">
                          <CheckCircle2 className="h-4 w-4" /> Closed
                        </span>
                      ) : c.specialistSignOff ? (
                        <span className="text-primary font-semibold text-sm">
                          Signed Off
                        </span>
                      ) : (
                        <span className="text-primary font-semibold text-sm">
                          Pending Sign-off
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isClosed ? (
                        <span className="text-xs font-semibold text-muted-foreground">
                          Closed
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 border-border text-primary hover:bg-muted hover:text-primary"
                          onClick={() => handleOpenClosureModal(c)}
                        >
                          <Lock className="h-4 w-4" /> Close Case
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={!!closingCase}
        onOpenChange={open => !open && setClosingCase(null)}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Mandatory
              Clinical Case Closure Check
            </DialogTitle>
            <DialogDescription>
              Closing case{" "}
              <strong className="text-foreground">#{closingCase?.id}</strong>{" "}
              for{" "}
              <strong className="text-foreground">
                {closingCase?.patientName}
              </strong>{" "}
              removes it from active monitoring queue. The platform requires
              explicit specialist sign-off or a documented exception.
            </DialogDescription>
          </DialogHeader>

          {hasPendingAlerts && (
            <div className="bg-muted border border-border text-primary p-4 rounded-lg text-sm">
              <div className="font-bold flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4" /> Warning: Mandatory
                Checkpoints Incomplete
              </div>
              <div>
                There are {pendingAlerts.length} unacknowledged alerts for this
                case. Case closure is blocked.
              </div>
            </div>
          )}

          {closureError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg text-sm">
              <strong className="font-bold">Safeguard Error:</strong>{" "}
              {closureError}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:border-border transition-colors cursor-pointer bg-card">
              <Checkbox
                id="signoff"
                checked={specialistSignOff}
                onCheckedChange={checked =>
                  setSpecialistSignOff(checked as boolean)
                }
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="signoff"
                  className="text-sm font-semibold cursor-pointer"
                >
                  Specialist Explicit Sign-off Recorded
                </label>
                <p className="text-xs text-muted-foreground">
                  I confirm that the assigned specialist (
                  {closingCase?.assignedSpecialistName || "Attending"}) has
                  performed final evaluation and signed off.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:border-border transition-colors cursor-pointer bg-card">
              <Checkbox
                id="resolution"
                checked={clinicalResolution}
                onCheckedChange={checked =>
                  setClinicalResolution(checked as boolean)
                }
                className="mt-1"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="resolution"
                  className="text-sm font-semibold cursor-pointer"
                >
                  Clinical Issue Resolved
                </label>
                <p className="text-xs text-muted-foreground">
                  Patient condition is stabilized and continuity checkpoints are
                  met.
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-3 p-4 border rounded-lg hover:border-border transition-colors bg-card">
              <div className="flex items-start space-x-3 cursor-pointer">
                <Checkbox
                  id="exception"
                  checked={useException}
                  onCheckedChange={checked =>
                    setUseException(checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="exception"
                    className="text-sm font-semibold cursor-pointer"
                  >
                    Close under authorised clinical exception
                  </label>
                  <p className="text-xs text-muted-foreground">
                    If closing with incomplete mandatory checkpoints, provide a
                    clinical rationale.
                  </p>
                </div>
              </div>

              {useException && (
                <div className="pl-7 mt-3">
                  <Textarea
                    required
                    value={exceptionReason}
                    onChange={e => setExceptionReason(e.target.value)}
                    placeholder="Document the exact clinical exception reason..."
                    className="min-h-[80px]"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setClosingCase(null)}>
              Cancel
            </Button>
            {hasPendingAlerts ? (
              <Button
                disabled={!isOverrideReady}
                onClick={handleConfirmClosure}
                className="bg-primary hover:bg-primary text-white"
              >
                Override & Close
              </Button>
            ) : (
              <Button
                onClick={handleConfirmClosure}
                className="bg-primary hover:bg-primary text-white"
              >
                Confirm Case Closure & Log Audit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
