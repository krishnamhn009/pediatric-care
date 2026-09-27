import { DatePicker } from "../components/ui/date-picker";
import React, { useState } from "react";
import { usePediatric, CARE_STAGES } from "../context/PediatricContext";
import {
  User,
  Activity,
  FileText,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Video,
  FileUp,
  Pill,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TeleconsultModal } from "../components/TeleconsultModal";
import { QuickChat } from "../components/QuickChat";
import { AIHelperBot } from "../components/AIHelperBot";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ParentPortal: React.FC = () => {
  const {
    getPatientById,
    getCaseByPatientId,
    specialists,
    requestSecondOpinion,
  } = usePediatric();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const activeChildId = "PT-1001";

  const patient = getPatientById(activeChildId);
  const activeCase = getCaseByPatientId(activeChildId);
  const assignedSpecialist = specialists.find(
    s => s.id === activeCase?.assignedSpecialistId
  );

  const [secondOpinionRequested, setSecondOpinionRequested] = useState(false);
  const [isTeleconsultOpen, setIsTeleconsultOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleSecondOpinion = () => {
    if (activeCase && !secondOpinionRequested) {
      requestSecondOpinion(activeCase.id);
      setSecondOpinionRequested(true);
    }
  };

  if (!patient || !activeCase) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center py-8">
          <p className="text-muted-foreground text-lg">
            No active records found for your child.
          </p>
        </Card>
      </div>
    );
  }

  const currentStageInfo = CARE_STAGES.find(
    s => s.stageNumber === activeCase.currentStage
  );

  const tabs = [
    {
      id: "overview",
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: "Overview",
    },
    { id: "profile", icon: <User className="w-4 h-4" />, label: "My Profile" },
    { id: "documents", icon: <FileUp className="w-4 h-4" />, label: "Reports" },
    {
      id: "careteam",
      icon: <ShieldCheck className="w-4 h-4" />,
      label: "Care Team & Chat",
    },
    {
      id: "prescriptions",
      icon: <Pill className="w-4 h-4" />,
      label: "Prescriptions",
    },
  ];

  return (
    <div className="min-h-screen bg-muted/10 font-sans flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-card border-r shadow-sm md:min-h-screen flex flex-col shrink-0">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Care Portal
          </h1>
          <p className="text-xs text-muted-foreground font-semibold mt-1 uppercase tracking-wider">
            Patient Dashboard
          </p>
        </div>

        <nav className="flex-1 p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible scrollbar-hide">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className="justify-start gap-3 w-auto md:w-full"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </Button>
          ))}
        </nav>

        <div className="p-4 border-t hidden md:block">
          <Button
            variant="ghost"
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full justify-start h-auto p-3 hover:bg-destructive/10 hover:text-destructive gap-3"
          >
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
              {patient.guardianName.charAt(0)}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-bold truncate">
                {patient.guardianName}
              </p>
              <p className="text-xs opacity-70 truncate">Logout</p>
            </div>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen relative">
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
          <Card>
            <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">{patient.fullName}</h2>
                <p className="text-muted-foreground font-medium text-sm mt-1">
                  Patient ID: {patient.id} • {patient.ageYears} yrs •{" "}
                  {patient.gender}
                </p>
              </div>
              <Badge
                variant="secondary"
                className="bg-muted text-primary pointer-events-none text-sm py-1.5 px-3 flex items-center gap-2"
              >
                <Activity className="w-4 h-4" /> Stage {activeCase.currentStage}{" "}
                Active
              </Badge>
            </CardContent>
          </Card>

          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" /> Care Journey
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 pb-2 border-l-2 border-primary/20 space-y-6 ml-2 mt-2">
                    <div className="relative">
                      <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background"></span>
                      <h4 className="font-semibold text-foreground">
                        {currentStageInfo?.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentStageInfo?.description}
                      </p>
                    </div>
                    {activeCase.currentStage < 10 && (
                      <div className="relative opacity-50">
                        <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-muted-foreground ring-4 ring-background"></span>
                        <h4 className="font-semibold text-muted-foreground text-sm">
                          Resolution & Discharge
                        </h4>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> Treatment Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-1">Diagnosis</h4>
                    <p className="text-sm text-muted-foreground">
                      {activeCase.primaryCondition}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />{" "}
                      Recent Updates
                    </h4>
                    <ul className="space-y-2">
                      {activeCase.clinicalNotes.slice(0, 2).map(note => (
                        <li
                          key={note.id}
                          className="text-sm text-muted-foreground flex items-start gap-3 bg-card p-3 border rounded-lg"
                        >
                          <span className="w-2 h-2 bg-primary/60 rounded-full mt-1.5 shrink-0"></span>
                          <span>{note.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" /> Patient Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input defaultValue={patient.fullName} />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      {patient.dob ? (
                        <DatePicker
                          date={new Date(patient.dob)}
                          className="w-full"
                        />
                      ) : (
                        <DatePicker className="w-full" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Blood Group</Label>
                      <Input defaultValue={patient.bloodGroup} />
                    </div>
                    <div className="space-y-2">
                      <Label>Known Allergies</Label>
                      <Input defaultValue={patient.allergies.join(", ")} />
                    </div>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h4 className="font-semibold mb-4">Guardian Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Guardian Name</Label>
                        <Input defaultValue={patient.guardianName} />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Number</Label>
                        <Input defaultValue={patient.guardianPhone} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button">Save Changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <Card className="border-dashed border-2 bg-muted/30">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <FileUp className="w-12 h-12 text-primary/50 mb-4" />
                  <h3 className="text-lg font-bold mb-1">
                    Upload Medical Report
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    Upload past prescriptions, lab results, or imaging reports
                    to share with the care team.
                  </p>
                  <Button render={<label className="cursor-pointer" />}>
                    Browse Files
                    <input type="file" className="hidden" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Previous Uploads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            Previous_Echo_Report.pdf
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uploaded on Sept 01, 2026
                          </p>
                        </div>
                      </div>
                      <Button variant="link" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "careteam" && (
            <div className="space-y-6">
              {assignedSpecialist && (
                <Card className="overflow-hidden border-0 shadow-md">
                  <div className="bg-primary p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-primary-foreground">
                    <img
                      src={assignedSpecialist.avatar}
                      alt={assignedSpecialist.name}
                      className="w-20 h-20 rounded-full ring-4 ring-primary-foreground/30 object-cover bg-primary/50 shrink-0"
                    />
                    <div className="text-center sm:text-left flex-1">
                      <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-wider mb-1">
                        Assigned Specialist
                      </p>
                      <h2 className="text-2xl font-bold">
                        {assignedSpecialist.name}
                      </h2>
                      <p className="text-primary-foreground/90 text-sm mt-1">
                        {assignedSpecialist.title}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setIsTeleconsultOpen(true)}
                      className="mt-4 sm:mt-0 gap-2 w-full sm:w-auto"
                    >
                      <Video className="w-4 h-4" /> Teleconsult
                    </Button>
                  </div>

                  <TeleconsultModal
                    isOpen={isTeleconsultOpen}
                    onClose={() => setIsTeleconsultOpen(false)}
                    patientName={patient.fullName}
                    specialistName={`Dr. ${assignedSpecialist.name}`}
                  />

                  <div className="p-6 bg-card">
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 mb-6">
                      <h3 className="text-sm font-bold flex items-center gap-2 mb-2 text-primary">
                        <ShieldCheck className="w-4 h-4" /> AI Selection
                        Rationale
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {assignedSpecialist.rationale}
                      </p>
                    </div>
                    <Button
                      variant={secondOpinionRequested ? "secondary" : "outline"}
                      onClick={handleSecondOpinion}
                      disabled={secondOpinionRequested}
                      className="w-full sm:w-auto"
                    >
                      {secondOpinionRequested
                        ? "Second Opinion Logged"
                        : "Request Second Opinion"}
                    </Button>
                  </div>
                </Card>
              )}

              <QuickChat
                patientId={patient.id}
                currentUserId="U1"
                currentUserName={patient.guardianName}
                currentUserRole="Parent"
              />
            </div>
          )}

          {activeTab === "prescriptions" && (
            <div className="space-y-6">
              <Card className="bg-primary text-primary-foreground border-none">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      Book Follow-up Appointment
                    </h3>
                    <p className="text-primary-foreground/80 text-sm">
                      Schedule your next consultation with the specialist.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    <Calendar className="w-4 h-4" /> Schedule Now
                  </Button>
                </CardContent>
              </Card>

              <Dialog
                open={isBookingModalOpen}
                onOpenChange={setIsBookingModalOpen}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Book Follow-up Appointment</DialogTitle>
                    <DialogDescription>
                      Schedule your next consultation with Dr. Emily Chen
                      (Pediatric Cardiology).
                    </DialogDescription>
                  </DialogHeader>

                  {!isBooked ? (
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Select Date</Label>
                        <DatePicker
                          date={bookingDate ? new Date(bookingDate) : undefined}
                          setDate={(d: any) =>
                            setBookingDate(
                              d ? d.toISOString().split("T")[0] : ""
                            )
                          }
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Select Time Slot</Label>
                        <Select
                          value={bookingTime}
                          onValueChange={val => setBookingTime(val || "")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Available slots" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                            <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                            <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                            <SelectItem value="04:15 PM">04:15 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsBookingModalOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={!bookingDate || !bookingTime}
                          onClick={() => setIsBooked(true)}
                        >
                          Confirm Booking
                        </Button>
                      </DialogFooter>
                    </div>
                  ) : (
                    <div className="py-6 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 bg-muted text-primary rounded-full flex items-center justify-center mb-2">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground">
                          Appointment Confirmed
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          You are booked for{" "}
                          {new Date(bookingDate).toLocaleDateString()} at{" "}
                          {bookingTime}.
                        </p>
                      </div>
                      <Button
                        className="mt-4"
                        onClick={() => {
                          setIsBookingModalOpen(false);
                          setIsBooked(false);
                        }}
                      >
                        Done
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-primary" /> Active
                    Prescriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        meds: "Amoxicillin 250mg",
                        dose: "1 tablet every 8 hours",
                        duration: "7 days",
                        doc: "Dr. Anitha Raman",
                      },
                      {
                        meds: "Ibuprofen Syrup",
                        dose: "5ml as needed for fever",
                        duration: "3 days",
                        doc: "Dr. Anitha Raman",
                      },
                    ].map((rx, i) => (
                      <div
                        key={i}
                        className="p-4 border rounded-lg bg-muted/30 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                      >
                        <div>
                          <h4 className="font-bold">{rx.meds}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {rx.dose} • {rx.duration}
                          </p>
                          <p className="text-xs text-muted-foreground/80 mt-2">
                            Prescribed by {rx.doc}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Request Refill
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <AIHelperBot />
      </main>
    </div>
  );
};
