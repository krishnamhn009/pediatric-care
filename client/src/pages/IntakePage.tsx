import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Activity,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Trash2,
  File,
  Image as ImageIcon,
  ShieldCheck,
  Baby,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Stethoscope,
  ClipboardList,
  Check,
  Sparkles,
} from "lucide-react";
import { usePediatric, VitalsData } from "../context/PediatricContext";
import {
  evaluateVitals,
  getPediatricVitalsRange,
} from "../utils/vitalsThresholds";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "../components/ui/date-picker";

const steps = [
  { id: 1, title: "Child Identity", desc: "Demographics & birth", icon: Baby },
  {
    id: 2,
    title: "Guardian & Contact",
    desc: "Family & insurance",
    icon: Phone,
  },
  {
    id: 3,
    title: "Clinical & Vitals",
    desc: "Presentation & vitals",
    icon: HeartPulse,
  },
  {
    id: 4,
    title: "Documents & Consent",
    desc: "Records & authorization",
    icon: ShieldCheck,
  },
];

export const IntakePage: React.FC = () => {
  const { registerIntake } = usePediatric();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 — Child Identity (prefilled demo)
  const [fullName, setFullName] = useState("Aarav Patel");
  const [dob, setDob] = useState("2024-05-10");
  const [ageYears, setAgeYears] = useState(2);
  const [ageMonths, setAgeMonths] = useState(4);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [bloodGroup, setBloodGroup] = useState("A positive");
  const [birthWeight, setBirthWeight] = useState("3.2");
  const [gestationalAge, setGestationalAge] = useState("38 weeks");
  const [allergiesText, setAllergiesText] = useState("Penicillin, Latex");

  // Step 2 — Guardian
  const [guardianName, setGuardianName] = useState("Rajesh Patel");
  const [guardianRelation, setGuardianRelation] = useState("Father");
  const [guardianPhone, setGuardianPhone] = useState("+91 98220 77112");
  const [guardianEmail, setGuardianEmail] = useState(
    "rajesh.patel@example.com"
  );
  const [address, setAddress] = useState(
    "12, Green View Apartments, Pune, MH 411001"
  );
  const [emergencyContact, setEmergencyContact] = useState(
    "+91 98220 77113 (Mother — Priya Patel)"
  );
  const [preferredLanguage, setPreferredLanguage] = useState("English / Hindi");
  const [insuranceId, setInsuranceId] = useState("HDFC-ERGO-KID-8832");
  const [consentConfirmed, setConsentConfirmed] = useState(true);

  // Step 3 — Clinical
  const [ward, setWard] = useState<
    "OPD" | "Emergency" | "PICU" | "NICU" | "Pediatric Wards" | "Imaging"
  >("Emergency");
  const [urgency, setUrgency] = useState<
    "Routine" | "Moderate" | "Urgent" | "Critical"
  >("Critical");
  const [chiefComplaint, setChiefComplaint] = useState(
    "Sudden onset lethargy, cyanosis during feeding, respiratory grunting."
  );
  const [primaryCondition, setPrimaryCondition] = useState(
    "Suspected Congenital Cardiac Anomaly / Acute Heart Failure"
  );
  const [chronicConditions, setChronicConditions] = useState(
    "None — first cardiac evaluation"
  );
  const [currentMeds, setCurrentMeds] = useState("Vitamin D, Iron drops");
  const [heartRate, setHeartRate] = useState(165);
  const [respiratoryRate, setRespiratoryRate] = useState(48);
  const [systolicBp, setSystolicBp] = useState(82);
  const [diastolicBp, setDiastolicBp] = useState(54);
  const [spO2, setSpO2] = useState(91);
  const [temperature, setTemperature] = useState(38.2);
  const [weightKg, setWeightKg] = useState(12.5);
  const [painScale, setPainScale] = useState(5);
  const [uploadedFiles, setUploadedFiles] = useState<
    {
      id: string;
      name: string;
      type: string;
      url: string;
      uploadedAt: string;
    }[]
  >([]);

  const vitalsRange = useMemo(
    () => getPediatricVitalsRange(ageYears),
    [ageYears]
  );
  const vitalsFlags = useMemo(
    () =>
      evaluateVitals(ageYears, {
        heartRate,
        respiratoryRate,
        systolicBp,
        spO2,
        temperature,
      }),
    [ageYears, heartRate, respiratoryRate, systolicBp, spO2, temperature]
  );
  const criticalFlagsCount = vitalsFlags.filter(
    f => f.status === "Critical"
  ).length;
  const warningFlagsCount = vitalsFlags.filter(
    f => f.status === "Warning"
  ).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentConfirmed) {
      alert("Digital Guardian Consent is mandatory.");
      return;
    }
    const vitalsObj: VitalsData = {
      heartRate,
      respiratoryRate,
      systolicBp,
      diastolicBp,
      spO2,
      temperature,
      weightKg,
      painScale,
      timestamp: new Date().toISOString(),
    };
    const allergiesArray = allergiesText
      .split(",")
      .map(a => a.trim())
      .filter(Boolean);
    const { caseId } = registerIntake(
      {
        fullName,
        dob,
        ageYears,
        ageMonths,
        gender,
        bloodGroup,
        allergies: allergiesArray,
        guardianName,
        guardianRelation,
        guardianPhone,
        insuranceId,
        consentSigned: true,
        medicalHistory: [primaryCondition, chronicConditions].filter(Boolean),
        riskCategory:
          criticalFlagsCount > 0
            ? "Critical"
            : warningFlagsCount > 0
              ? "High"
              : "Moderate",
        assignedWard: ward,
      },
      {
        chiefComplaint,
        primaryCondition,
        urgency,
        vitals: vitalsObj,
        ward,
        documents: uploadedFiles,
      }
    );
    navigate(`/recommendation?caseId=${caseId}`);
  };

  const handleSimulatedUpload = () => {
    const mockFiles = [
      {
        id: `DOC-${Date.now()}-1`,
        name: "Previous_Discharge_Summary.pdf",
        type: "application/pdf",
        url: "#",
        uploadedAt: new Date().toISOString(),
      },
      {
        id: `DOC-${Date.now()}-2`,
        name: "Chest_XRay_AP.jpg",
        type: "image/jpeg",
        url: "#",
        uploadedAt: new Date().toISOString(),
      },
      {
        id: `DOC-${Date.now()}-3`,
        name: "Recent_Blood_Panel.csv",
        type: "text/csv",
        url: "#",
        uploadedAt: new Date().toISOString(),
      },
    ];
    setUploadedFiles(prev => [...prev, ...mockFiles]);
  };
  const handleRemoveFile = (id: string) =>
    setUploadedFiles(prev => prev.filter(f => f.id !== id));

  const next = () => setStep(s => Math.min(4, s + 1));
  const back = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground">
          <span className="h-7 w-7 rounded-lg bg-white text-black grid place-items-center">
            <UserPlus className="w-4 h-4" />
          </span>
          Stage 1 & 2 · Intake Pipeline{" "}
          <span className="hidden sm:inline opacity-40">·</span>{" "}
          <span className="inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Demo prefilled
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Patient Onboarding
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Multi-step registration for pediatric admission, guardian consent,
              and age-adjusted vitals triage. All fields prefilled for demo —
              edit as needed.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFullName("Aarav Patel");
              setDob("2024-05-10");
              setAgeYears(2);
              setAgeMonths(4);
              setGender("Male");
              setBloodGroup("A positive");
              setAllergiesText("Penicillin, Latex");
              setGuardianName("Rajesh Patel");
              setGuardianPhone("+91 98220 77112");
            }}
            className="rounded-full border-white/10 bg-white/[0.04] hover:bg-white/10 w-fit"
          >
            Reset Demo Data
          </Button>
        </div>
      </div>

      {/* Stepper */}
      <div className="solaris-card rounded-2xl p-4">
        <div className="flex items-center gap-2">
          {steps.map(s => {
            const active = step === s.id;
            const done = step > s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => setStep(s.id)}
                  className={`h-9 w-9 rounded-xl grid place-items-center border text-xs font-bold shrink-0 transition-all cursor-pointer ${active ? "bg-white text-black border-white shadow-md scale-105" : done ? "bg-white/10 border-white/20 text-foreground" : "bg-white/[0.04] border-white/10 text-muted-foreground hover:bg-white/10"}`}
                >
                  {done ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </button>
                <div className="hidden sm:block min-w-0 flex-1">
                  <div
                    className={`text-xs font-bold leading-none truncate ${active ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {s.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {s.desc}
                  </div>
                </div>
                {s.id < 4 && (
                  <div
                    className={`hidden sm:block h-px flex-1 mx-2 ${done || active ? "bg-white/30" : "bg-white/10"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={false}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full bg-white"
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>Step {step} of 4</span>
          <span>{Math.round((step / 4) * 100)}% complete</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="solaris-card rounded-2xl border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Baby className="w-5 h-5" /> Child Identity
                  </CardTitle>
                  <CardDescription>
                    Demographics, birth details and allergy profile. Demo
                    prefilled — tap to edit.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Child Full Name *</Label>
                      <Input
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="rounded-xl border-white/10 bg-white/[0.04]"
                        placeholder="Aarav Patel"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth *</Label>
                      <DatePicker
                        date={dob ? new Date(dob) : undefined}
                        setDate={(d: any) =>
                          setDob(d ? d.toISOString().split("T")[0] : "")
                        }
                        className="w-full rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender *</Label>
                      <Select
                        value={gender}
                        onValueChange={v => v && setGender(v as any)}
                      >
                        <SelectTrigger className="rounded-xl border-white/10 bg-white/[0.04]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Age Years *</Label>
                      <Input
                        type="number"
                        min="0"
                        max="18"
                        value={ageYears}
                        onChange={e =>
                          setAgeYears(parseInt(e.target.value) || 0)
                        }
                        className="rounded-xl border-white/10 bg-white/[0.04]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Age Months</Label>
                      <Input
                        type="number"
                        min="0"
                        max="11"
                        value={ageMonths}
                        onChange={e =>
                          setAgeMonths(parseInt(e.target.value) || 0)
                        }
                        className="rounded-xl border-white/10 bg-white/[0.04]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Blood Group</Label>
                      <Select
                        value={bloodGroup}
                        onValueChange={v => v && setBloodGroup(v)}
                      >
                        <SelectTrigger className="rounded-xl border-white/10 bg-white/[0.04]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "A positive",
                            "A negative",
                            "B positive",
                            "B negative",
                            "AB positive",
                            "AB negative",
                            "O positive",
                            "O negative",
                          ].map(bg => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Birth Weight (kg)</Label>
                      <Input
                        value={birthWeight}
                        onChange={e => setBirthWeight(e.target.value)}
                        placeholder="3.2"
                        className="rounded-xl border-white/10 bg-white/[0.04]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gestational Age</Label>
                      <Input
                        value={gestationalAge}
                        onChange={e => setGestationalAge(e.target.value)}
                        placeholder="38 weeks"
                        className="rounded-xl border-white/10 bg-white/[0.04]"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-1">
                      <Label>Known Allergies</Label>
                      <Input
                        value={allergiesText}
                        onChange={e => setAllergiesText(e.target.value)}
                        placeholder="Penicillin, Peanuts"
                        className="rounded-xl border-white/10 bg-white/[0.04]"
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex items-start gap-2 text-xs text-muted-foreground">
                    <ClipboardList className="w-4 h-4 mt-0.5 shrink-0" /> Demo
                    note: Birth details help auto-calc growth percentiles and
                    risk. Change any field to see live validation in later
                    steps.
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="solaris-card rounded-2xl border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5" /> Guardian & Contact
                  </CardTitle>
                  <CardDescription>
                    Family, insurance and emergency contact. HIPAA authorization
                    included.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Guardian Full Name *</Label>
                      <Input
                        required
                        value={guardianName}
                        onChange={e => setGuardianName(e.target.value)}
                        className="rounded-xl border-white/10 bg-white/[0.04]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Relation *</Label>
                      <Select
                        value={guardianRelation}
                        onValueChange={v => v && setGuardianRelation(v)}
                      >
                        <SelectTrigger className="rounded-xl border-white/10 bg-white/[0.04]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Father">Father</SelectItem>
                          <SelectItem value="Mother">Mother</SelectItem>
                          <SelectItem value="Guardian">Guardian</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Guardian Phone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          required
                          value={guardianPhone}
                          onChange={e => setGuardianPhone(e.target.value)}
                          className="pl-9 rounded-xl border-white/10 bg-white/[0.04]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={guardianEmail}
                          onChange={e => setGuardianEmail(e.target.value)}
                          className="pl-9 rounded-xl border-white/10 bg-white/[0.04]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Textarea
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          className="pl-9 rounded-xl border-white/10 bg-white/[0.04] min-h-[44px]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Emergency Contact</Label>
                      <Input
                        value={emergencyContact}
                        onChange={e => setEmergencyContact(e.target.value)}
                        className="rounded-xl border-white/10 bg-white/[0.04]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Language</Label>
                      <Select
                        value={preferredLanguage}
                        onValueChange={v => v && setPreferredLanguage(v)}
                      >
                        <SelectTrigger className="rounded-xl border-white/10 bg-white/[0.04]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English / Hindi">
                            English / Hindi
                          </SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Marathi">Marathi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Insurance ID</Label>
                      <Input
                        value={insuranceId}
                        onChange={e => setInsuranceId(e.target.value)}
                        className="rounded-xl border-white/10 bg-white/[0.04]"
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      checked={consentConfirmed}
                      onCheckedChange={v => setConsentConfirmed(v as boolean)}
                      className="mt-1 border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor="consent" className="text-sm font-medium">
                        Digital Guardian Consent & HIPAA Authorization Verified
                      </label>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        I confirm legal guardian authorization for triage,
                        specialist matching, and telemetry monitoring under
                        HIPAA / DPDP 2023. Demo pre-checked.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="solaris-card rounded-2xl border-white/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5" /> Clinical Presentation
                    </CardTitle>
                    <CardDescription>
                      Chief complaint, condition and urgency. Vitals
                      auto-flagged by age.
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-full border-white/10 bg-white/[0.04]"
                  >
                    Evaluated:{" "}
                    <span className="ml-1 font-bold text-foreground">
                      {vitalsRange.ageGroup}
                    </span>
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Assigned Ward *</Label>
                      <Select
                        value={ward}
                        onValueChange={v => v && setWard(v as any)}
                      >
                        <SelectTrigger className="rounded-xl border-white/10 bg-white/[0.04]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Emergency">
                            Emergency / Triage
                          </SelectItem>
                          <SelectItem value="PICU">PICU</SelectItem>
                          <SelectItem value="NICU">NICU</SelectItem>
                          <SelectItem value="OPD">OPD Consult</SelectItem>
                          <SelectItem value="Pediatric Wards">
                            General Wards
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Clinical Urgency *</Label>
                      <Select
                        value={urgency}
                        onValueChange={v => v && setUrgency(v as any)}
                      >
                        <SelectTrigger className="rounded-xl border-white/10 bg-white/[0.04]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Routine">Routine</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Chief Complaint *</Label>
                    <Textarea
                      required
                      value={chiefComplaint}
                      onChange={e => setChiefComplaint(e.target.value)}
                      className="rounded-xl border-white/10 bg-white/[0.04] min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Suspected Condition *</Label>
                    <Input
                      required
                      value={primaryCondition}
                      onChange={e => setPrimaryCondition(e.target.value)}
                      className="rounded-xl border-white/10 bg-white/[0.04]"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Chronic Conditions</Label>
                      <Input
                        value={chronicConditions}
                        onChange={e => setChronicConditions(e.target.value)}
                        placeholder="e.g., Asthma"
                        className="rounded-xl border-white/10 bg-white/[0.04]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Medications</Label>
                      <Input
                        value={currentMeds}
                        onChange={e => setCurrentMeds(e.target.value)}
                        placeholder="Vitamin D"
                        className="rounded-xl border-white/10 bg-white/[0.04]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 space-y-4">
                    <h3 className="text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground">
                      Vitals — Real-time Threshold Flags
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        {
                          label: "Heart Rate (bpm)",
                          value: heartRate,
                          setter: setHeartRate,
                          normal: `${vitalsRange.hrMin}-${vitalsRange.hrMax} bpm`,
                        },
                        {
                          label: "Respiratory Rate (/min)",
                          value: respiratoryRate,
                          setter: setRespiratoryRate,
                          normal: `${vitalsRange.rrMin}-${vitalsRange.rrMax}/min`,
                        },
                        {
                          label: "SpO2 (%)",
                          value: spO2,
                          setter: setSpO2,
                          normal: `≥${vitalsRange.spO2Min}%`,
                        },
                        {
                          label: "Temperature (°C)",
                          value: temperature,
                          setter: setTemperature,
                          normal: `${vitalsRange.tempMin}-${vitalsRange.tempMax}°C`,
                          step: 0.1,
                        },
                      ].map(f => (
                        <div
                          key={f.label}
                          className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2"
                        >
                          <Label className="text-xs">{f.label}</Label>
                          <Input
                            type="number"
                            step={(f as any).step || 1}
                            value={f.value}
                            onChange={e =>
                              (f.setter as any)(parseFloat(e.target.value) || 0)
                            }
                            className="bg-background font-mono text-lg rounded-xl border-white/10"
                          />
                          <p className="text-xs text-muted-foreground">
                            Normal: {f.normal}
                          </p>
                        </div>
                      ))}
                      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2">
                        <Label>Systolic BP</Label>
                        <Input
                          type="number"
                          value={systolicBp}
                          onChange={e =>
                            setSystolicBp(parseInt(e.target.value) || 0)
                          }
                          className="rounded-xl border-white/10 bg-background font-mono"
                        />
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2">
                        <Label>Diastolic BP</Label>
                        <Input
                          type="number"
                          value={diastolicBp}
                          onChange={e =>
                            setDiastolicBp(parseInt(e.target.value) || 0)
                          }
                          className="rounded-xl border-white/10 bg-background font-mono"
                        />
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2">
                        <Label>Weight (kg)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={weightKg}
                          onChange={e =>
                            setWeightKg(parseFloat(e.target.value) || 0)
                          }
                          className="rounded-xl border-white/10 bg-background font-mono"
                        />
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2">
                        <Label>Pain Scale (0-10)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={painScale}
                          onChange={e =>
                            setPainScale(parseInt(e.target.value) || 0)
                          }
                          className="rounded-xl border-white/10 bg-background font-mono"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold inline-flex items-center gap-2">
                          <Activity className="w-4 h-4" /> Real-time Flags for{" "}
                          {fullName} ({ageYears} yrs)
                        </span>
                        {criticalFlagsCount > 0 ? (
                          <Badge className="rounded-full bg-red-500 text-white border-red-500">
                            {criticalFlagsCount} CRITICAL
                          </Badge>
                        ) : warningFlagsCount > 0 ? (
                          <Badge className="rounded-full bg-amber-500/15 text-amber-300 border-amber-500/20">
                            {warningFlagsCount} WARNING
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="rounded-full border-white/10 bg-white/[0.04]"
                          >
                            ALL NORMAL
                          </Badge>
                        )}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {vitalsFlags.map(flag => (
                          <div
                            key={flag.param}
                            className={`rounded-xl p-3 border text-sm flex flex-col ${flag.status === "Critical" ? "border-red-500/30 bg-red-500/10 text-red-300" : flag.status === "Warning" ? "border-amber-500/20 bg-amber-500/10 text-amber-300" : "border-white/10 bg-white/[0.04] text-foreground"}`}
                          >
                            <div className="flex items-center justify-between font-bold mb-1">
                              <span>
                                {flag.param}: {flag.value}
                              </span>
                              <span className="text-[10px] uppercase">
                                {flag.status}
                              </span>
                            </div>
                            <p className="text-xs opacity-80">{flag.message}</p>
                            <div className="text-[10px] opacity-60 mt-1">
                              Target: {flag.expectedRange}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="s4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="solaris-card rounded-2xl border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UploadCloud className="w-5 h-5" /> Documents & Consent —
                    Review
                  </CardTitle>
                  <CardDescription>
                    Attach prior records and confirm authorization. Summary
                    below reflects all prefilled demo data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-xl border-2 border-dashed border-white/10 bg-white/[0.03] p-8 text-center flex flex-col items-center">
                    <UploadCloud className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="text-sm font-semibold">
                      Drag & drop files here
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      PDF, JPG, PNG, CSV (Max 50MB)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSimulatedUpload}
                      className="rounded-full border-white/10 bg-white/[0.04] hover:bg-white/10"
                    >
                      Simulate Browse Files
                    </Button>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground">
                        Attached Documents ({uploadedFiles.length})
                      </h4>
                      {uploadedFiles.map(file => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.04]"
                        >
                          <div className="flex items-center gap-3">
                            <span className="h-9 w-9 rounded-lg bg-white text-black grid place-items-center">
                              <File className="w-4 h-4" />
                            </span>
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground uppercase">
                                {file.type}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => handleRemoveFile(file.id)}
                            className="rounded-full hover:bg-white/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <ClipboardList className="w-4 h-4" /> Review Summary (Demo
                      Prefilled)
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-lg bg-card border border-white/10 p-3">
                        <div className="text-muted-foreground uppercase tracking-wide text-[11px]">
                          Child
                        </div>
                        <div className="font-semibold">
                          {fullName} · {ageYears}y {ageMonths}m · {gender} ·{" "}
                          {bloodGroup}
                        </div>
                        <div className="text-muted-foreground">
                          Allergies: {allergiesText}
                        </div>
                      </div>
                      <div className="rounded-lg bg-card border border-white/10 p-3">
                        <div className="text-muted-foreground uppercase tracking-wide text-[11px]">
                          Guardian
                        </div>
                        <div className="font-semibold">
                          {guardianName} ({guardianRelation})
                        </div>
                        <div className="text-muted-foreground">
                          {guardianPhone} · {guardianEmail}
                        </div>
                      </div>
                      <div className="rounded-lg bg-card border border-white/10 p-3 sm:col-span-2">
                        <div className="text-muted-foreground uppercase tracking-wide text-[11px]">
                          Clinical
                        </div>
                        <div className="font-semibold">{primaryCondition}</div>
                        <div className="text-muted-foreground">
                          {chiefComplaint} · Ward {ward} · Urgency {urgency}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={back}
            disabled={step === 1}
            className="rounded-full border-white/10 bg-white/[0.04] hover:bg-white/10 gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div className="flex items-center gap-2">
            {step < 4 ? (
              <Button
                type="button"
                onClick={next}
                className="rounded-full bg-white text-black hover:bg-white/90 gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                className="rounded-full bg-white text-black hover:bg-white/90 gap-2 shadow-[0_8px_24px_rgba(255,255,255,0.12)]"
              >
                Complete Intake & Launch AI Recommendation{" "}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
