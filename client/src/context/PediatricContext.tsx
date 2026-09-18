import React, { createContext, useContext, useState, useEffect } from "react";

export type CareStageNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface CareStageInfo {
 stageNumber: CareStageNumber;
 name: string;
 description: string;
}

export const CARE_STAGES: CareStageInfo[] = [
 { stageNumber: 1, name: "Registration", description: "Demographics & digital consent captured" },
 { stageNumber: 2, name: "Triage & Vitals", description: "Vitals recorded and age thresholds checked" },
 { stageNumber: 3, name: "Clinical Assessment", description: "Chief complaint & primary condition documented" },
 { stageNumber: 4, name: "Matching Request", description: "AI Matching criteria compiled" },
 { stageNumber: 5, name: "Specialist Recommendation", description: "Ranked specialists generated based on clinical data" },
 { stageNumber: 6, name: "Human Decision / Assignment", description: "Clinician accepts recommendation or inputs structured override" },
 { stageNumber: 7, name: "Consult Scheduled", description: "Specialist consultation scheduled and assigned" },
 { stageNumber: 8, name: "Treatment Started", description: "Treatment plan initiated and order set published" },
 { stageNumber: 9, name: "Continuity & Follow-up", description: "Clinical checkpoints actively monitored for care continuity" },
 { stageNumber: 10, name: "Case Closed", description: "Specialist sign-off recorded or documented exception validated" },
];

export interface VitalsData {
 heartRate: number;
 respiratoryRate: number;
 systolicBp: number;
 diastolicBp: number;
 spO2: number;
 temperature: number; // Celsius
 weightKg: number;
 painScale: number; // 0 - 10
 timestamp: string;
}

export interface Patient {
 id: string;
 fullName: string;
 dob: string;
 ageYears: number;
 ageMonths: number;
 gender: "Male" | "Female" | "Other";
 bloodGroup: string;
 allergies: string[];
 guardianName: string;
 guardianRelation: string;
 guardianPhone: string;
 insuranceId: string;
 consentSigned: boolean;
 consentTimestamp?: string;
 medicalHistory: string[];
 riskCategory: "Low" | "Moderate" | "High" | "Critical";
 assignedWard: "OPD" | "Emergency" | "PICU" | "NICU" | "Pediatric Wards" | "Imaging";
}

export interface Specialist {
 id: string;
 name: string;
 title: string;
 specialty: "Cardiology" | "Neurology" | "Pediatric Surgery";
 subSpecialty: string;
 experienceYears: number;
 activeCasesCount: number;
 maxCapacity: number;
 responseSlaMinutes: number;
 matchScoreDefault: number;
 status: "Available" | "In Consult" | "On Call" | "Busy";
 avatar: string;
 rating: number;
 hospitalAffiliation: string;
 rationale: string;
}

export interface PatientCase {
 id: string;
 patientId: string;
 patientName: string;
 ageText: string;
 chiefComplaint: string;
 primaryCondition: string;
 urgency: "Routine" | "Moderate" | "Urgent" | "Critical";
 currentStage: CareStageNumber;
 stageHistory: Array<{
 stageNumber: CareStageNumber;
 updatedAt: string;
 updatedBy: string;
 note?: string;
 }>;
 vitals: VitalsData;
 assignedSpecialistId: string | null;
 assignedSpecialistName: string | null;
 assignedAt?: string;
 overrideReason?: string | null;
 specialistSignOff: boolean;
 specialistSignOffAt?: string;
 documentedException?: string | null;
 documentedExceptionAt?: string;
 ward: "OPD" | "Emergency" | "PICU" | "NICU" | "Pediatric Wards" | "Imaging";
 createdAt: string;
 updatedAt: string;
 clinicalNotes: Array<{
 id: string;
 author: string;
 role: string;
 text: string;
 timestamp: string;
 }>;
 documents?: Array<{
 id: string;
 name: string;
 type: string;
 url: string;
 uploadedAt: string;
 }>;
}

export interface ExecutiveAlert {
 id: string;
 caseId?: string;
 patientId?: string;
 patientName?: string;
 severity: "critical" | "amber" | "blue" | "green";
 title: string;
 detail: string;
 checkpointType: "overdue_consult" | "treatment_delayed" | "vitals_unresolved" | "discharge_pending" | "followup_checkpoint";
 createdAt: string;
 acknowledged: boolean;
 acknowledgedBy?: string;
 acknowledgedAt?: string;
 actionTaken?: string;
}

export interface AuditLogEntry {
 id: string;
 timestamp: string;
 user: string;
 userRole: string;
 actionType: "INTAKE_REGISTERED" | "VITALS_ALERT" | "SPECIALIST_ACCEPTED" | "SPECIALIST_OVERRIDDEN" | "ALERT_ACKNOWLEDGED" | "STAGE_ADVANCED" | "CASE_CLOSED" | "NOTE_ADDED" | "SECOND_OPINION_REQUESTED";
 caseId?: string;
 patientId?: string;
 patientName?: string;
 summary: string;
 details?: string;
 overrideReason?: string;
 exceptionReason?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  patientId: string;
  specialistIds: string[];
  messages: ChatMessage[];
}

interface PediatricContextType {
 patients: Patient[];
 cases: PatientCase[];
 specialists: Specialist[];
 alerts: ExecutiveAlert[];
 auditLog: AuditLogEntry[];
 chats: ChatThread[];

 // CRUD Operations & Actions
 registerIntake: (
 patientData: Omit<Patient, "id">,
 caseData: {
 chiefComplaint: string;
 primaryCondition: string;
 urgency: PatientCase["urgency"];
 vitals: VitalsData;
 ward: PatientCase["ward"];
 documents?: PatientCase["documents"];
 }
 ) => { patientId: string; caseId: string };

 updateCaseStage: (caseId: string, newStage: CareStageNumber, note?: string) => void;
 updateCaseVitals: (caseId: string, newVitals: VitalsData) => void;
 acceptSpecialist: (caseId: string, specialistId: string, clinicianName?: string) => void;
 overrideSpecialist: (
 caseId: string,
 specialistId: string,
 structuredReason: string,
 clinicianName?: string
 ) => void;
 acknowledgeAlert: (alertId: string, actionTaken: string, clinicianName?: string) => void;
 closeCase: (
 caseId: string,
 specialistSignOff: boolean,
 documentedException?: string,
 clinicianName?: string
 ) => { success: boolean; error?: string };
 addClinicalNote: (caseId: string, text: string, author?: string) => void;
 addAuditEntry: (entry: Omit<AuditLogEntry, "id" | "timestamp">) => void;
 requestSecondOpinion: (caseId: string) => void;
 getPatientById: (patientId: string) => Patient | undefined;
 getCaseById: (caseId: string) => PatientCase | undefined;
 getCaseByPatientId: (patientId: string) => PatientCase | undefined;

 // Chat Actions
 getChatThread: (patientId: string) => ChatThread | undefined;
 startChatThread: (patientId: string, specialistIds: string[]) => void;
 addChatMessage: (patientId: string, message: Omit<ChatMessage, "id" | "timestamp">) => void;

 // Master Data Admin
 addSpecialist: (specialistData: Omit<Specialist, "id">) => void;
 updateSpecialist: (specialistId: string, updates: Partial<Specialist>) => void;
 removeSpecialist: (specialistId: string) => void;
}

const PediatricContext = createContext<PediatricContextType | null>(null);

// Initial Mock Data
const INITIAL_PATIENTS: Patient[] = [
 {
 id: "PT-1001",
 fullName: "Ishaan Menon",
 dob: "2019-04-12",
 ageYears: 7,
 ageMonths: 4,
 gender: "Male",
 bloodGroup: "O positive",
 allergies: ["Penicillin", "Peanuts"],
 guardianName: "Sunita Menon",
 guardianRelation: "Mother",
 guardianPhone: "+91 98450 12345",
 insuranceId: "HDFC-ERGO-PEDI-9921",
 consentSigned: true,
 consentTimestamp: "2026-09-08T08:30:00Z",
 medicalHistory: ["Congenital Heart Defect (VSD)", "Asthma"],
 riskCategory: "Critical",
 assignedWard: "PICU",
 },
 {
 id: "PT-1002",
 fullName: "Anaya Rao",
 dob: "2023-01-15",
 ageYears: 3,
 ageMonths: 7,
 gender: "Female",
 bloodGroup: "A positive",
 allergies: ["Latex"],
 guardianName: "Vikram Rao",
 guardianRelation: "Father",
 guardianPhone: "+91 98112 54321",
 insuranceId: "STAR-HEALTH-CHILD-4410",
 consentSigned: true,
 consentTimestamp: "2026-09-07T14:15:00Z",
 medicalHistory: ["Post-Op Tetralogy of Fallot Repair"],
 riskCategory: "High",
 assignedWard: "PICU",
 },
 {
 id: "PT-1003",
 fullName: "Rehan Sharma",
 dob: "2020-11-20",
 ageYears: 5,
 ageMonths: 9,
 gender: "Male",
 bloodGroup: "B positive",
 allergies: ["None"],
 guardianName: "Meera Sharma",
 guardianRelation: "Mother",
 guardianPhone: "+91 97223 88990",
 insuranceId: "ICICI-LOMBARD-KID-1082",
 consentSigned: true,
 consentTimestamp: "2026-09-09T06:00:00Z",
 medicalHistory: ["Refractory Seizures", "Epilepsy"],
 riskCategory: "Critical",
 assignedWard: "PICU",
 },
 {
 id: "PT-1004",
 fullName: "Myra Joseph",
 dob: "2021-08-05",
 ageYears: 5,
 ageMonths: 1,
 gender: "Female",
 bloodGroup: "AB positive",
 allergies: ["Sulfa drugs"],
 guardianName: "David Joseph",
 guardianRelation: "Father",
 guardianPhone: "+91 98991 11223",
 insuranceId: "MAX-BUPA-CARE-7733",
 consentSigned: true,
 consentTimestamp: "2026-09-09T10:20:00Z",
 medicalHistory: ["Acute Bronchiolitis"],
 riskCategory: "Moderate",
 assignedWard: "Pediatric Wards",
 },
 {
 id: "PT-1005",
 fullName: "Kabir Joshi",
 dob: "2025-03-10",
 ageYears: 1,
 ageMonths: 5,
 gender: "Male",
 bloodGroup: "O negative",
 allergies: ["Egg proteins"],
 guardianName: "Pooja Joshi",
 guardianRelation: "Mother",
 guardianPhone: "+91 99002 33445",
 insuranceId: "SBI-HEALTH-MINI-0012",
 consentSigned: true,
 consentTimestamp: "2026-09-09T11:45:00Z",
 medicalHistory: ["Ventricular Septal Defect evaluation"],
 riskCategory: "Moderate",
 assignedWard: "OPD",
 },
];

const INITIAL_SPECIALISTS: Specialist[] = [
 {
 id: "SPEC-CARD-01",
 name: "Dr. Anitha Raman",
 title: "Chief of Pediatric Cardiology",
 specialty: "Cardiology",
 subSpecialty: "Congenital Heart Defects & Echocardiography",
 experienceYears: 18,
 activeCasesCount: 4,
 maxCapacity: 8,
 responseSlaMinutes: 15,
 matchScoreDefault: 98,
 status: "Available",
 avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
 rating: 4.9,
 hospitalAffiliation: "Main City Hospital · Cardiac Center of Excellence",
 rationale: "Highest match for pediatric VSD, heart failure monitoring, and post-op cardiac management. Available within 15 min SLA.",
 },
 {
 id: "SPEC-CARD-02",
 name: "Dr. Nimal Jayawardene",
 title: "Senior Pediatric Cardiologist",
 specialty: "Cardiology",
 subSpecialty: "Pediatric Electrophysiology & Interventional Cardiology",
 experienceYears: 14,
 activeCasesCount: 6,
 maxCapacity: 8,
 responseSlaMinutes: 30,
 matchScoreDefault: 91,
 status: "In Consult",
 avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
 rating: 4.8,
 hospitalAffiliation: "Main City Hospital · West Wing Cardiology",
 rationale: "Strong expertise in pediatric rhythm disorders and cardiac catheterization. Currently in consult, estimated available in 25 min.",
 },
 {
 id: "SPEC-NEURO-01",
 name: "Dr. Sahan Perera",
 title: "Lead Pediatric Neurologist",
 specialty: "Neurology",
 subSpecialty: "Refractory Epilepsy & Neuro-Critical Care",
 experienceYears: 16,
 activeCasesCount: 3,
 maxCapacity: 7,
 responseSlaMinutes: 20,
 matchScoreDefault: 96,
 status: "Available",
 avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
 rating: 4.95,
 hospitalAffiliation: "Main City Hospital · Brain & Spine Institute",
 rationale: "Specializes in pediatric status epilepticus, continuous Video EEG monitoring, and pediatric neuro-intensive care.",
 },
 {
 id: "SPEC-NEURO-02",
 name: "Dr. Maya Lin",
 title: "Pediatric Neurologist & Neuro-Geneticist",
 specialty: "Neurology",
 subSpecialty: "Pediatric Neuromuscular & Metabolic Disorders",
 experienceYears: 12,
 activeCasesCount: 5,
 maxCapacity: 8,
 responseSlaMinutes: 35,
 matchScoreDefault: 88,
 status: "On Call",
 avatar: "https://images.unsplash.com/photo-1594824813566-88855ce7890b?w=150&auto=format&fit=crop&q=80",
 rating: 4.75,
 hospitalAffiliation: "Main City Hospital · Pediatric Neuro-Development Unit",
 rationale: "Expert in neurodegenerative disorders and genetic epilepsies in early childhood.",
 },
 {
 id: "SPEC-SURG-01",
 name: "Dr. Vikram Seth",
 title: "Director of Pediatric Surgery",
 specialty: "Pediatric Surgery",
 subSpecialty: "Pediatric Thoracic & Neonatal Surgery",
 experienceYears: 20,
 activeCasesCount: 5,
 maxCapacity: 6,
 responseSlaMinutes: 10,
 matchScoreDefault: 97,
 status: "Available",
 avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80",
 rating: 4.98,
 hospitalAffiliation: "Main City Hospital · Surgical Suites Wing A",
 rationale: "Pioneer in minimally invasive pediatric laparoscopy and emergency neonatal surgical repairs.",
 },
 {
 id: "SPEC-SURG-02",
 name: "Dr. Priya Shah",
 title: "Attending Pediatric Surgeon",
 specialty: "Pediatric Surgery",
 subSpecialty: "Pediatric Trauma & Abdominal Surgery",
 experienceYears: 11,
 activeCasesCount: 3,
 maxCapacity: 7,
 responseSlaMinutes: 25,
 matchScoreDefault: 89,
 status: "Available",
 avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80",
 rating: 4.85,
 hospitalAffiliation: "Main City Hospital · Children's Trauma Unit",
 rationale: "Top-ranked for acute pediatric abdominal surgical emergencies and post-trauma reconstruction.",
 },
];

const INITIAL_CASES: PatientCase[] = [
 {
 id: "CASE-2026-001",
 patientId: "PT-1001",
 patientName: "Ishaan Menon",
 ageText: "7 yrs",
 chiefComplaint: "Acute shortness of breath, tachycardia, and peripheral cyanosis",
 primaryCondition: "Ventricular Septal Defect (VSD) with Exacerbated Pulmonary Flow",
 urgency: "Critical",
 currentStage: 9, // Continuity & Follow-up
 stageHistory: [
 { stageNumber: 1, updatedAt: "2026-09-08T08:30:00Z", updatedBy: "Care Coordinator" },
 { stageNumber: 2, updatedAt: "2026-09-08T08:45:00Z", updatedBy: "Nurse Triage" },
 { stageNumber: 3, updatedAt: "2026-09-08T09:10:00Z", updatedBy: "Dr. Anitha Raman" },
 { stageNumber: 4, updatedAt: "2026-09-08T09:20:00Z", updatedBy: "Intelligent Matching Engine" },
 { stageNumber: 5, updatedAt: "2026-09-08T09:22:00Z", updatedBy: "AI Engine" },
 { stageNumber: 6, updatedAt: "2026-09-08T09:35:00Z", updatedBy: "Dr. Anitha Raman", note: "Accepted Dr. Anitha Raman (Cardiology)" },
 { stageNumber: 7, updatedAt: "2026-09-08T10:00:00Z", updatedBy: "System" },
 { stageNumber: 8, updatedAt: "2026-09-08T11:00:00Z", updatedBy: "Dr. Anitha Raman" },
 { stageNumber: 9, updatedAt: "2026-09-09T08:00:00Z", updatedBy: "Dr. Anitha Raman", note: "Continuous telemetry & fluid tracking active" },
 ],
 vitals: {
 heartRate: 154,
 respiratoryRate: 38,
 systolicBp: 110,
 diastolicBp: 70,
 spO2: 91,
 temperature: 38.2,
 weightKg: 22.5,
 painScale: 6,
 timestamp: "2026-09-09T09:40:00Z",
 },
 assignedSpecialistId: "SPEC-CARD-01",
 assignedSpecialistName: "Dr. Anitha Raman",
 assignedAt: "2026-09-08T09:35:00Z",
 specialistSignOff: false,
 ward: "PICU",
 createdAt: "2026-09-08T08:30:00Z",
 updatedAt: "2026-09-09T09:40:00Z",
 clinicalNotes: [
 {
 id: "CN-01",
 author: "Dr. Anitha Raman",
 role: "Chief of Pediatric Cardiology",
 text: "PICU Morning Review: Respiratory effort improved overnight with nasal cannula O2 (1.5L/min). Telemetry shows sinus tachycardia 154 bpm. Continue furosemide and reassess at 14:00.",
 timestamp: "2026-09-09T09:40:00Z",
 },
 {
 id: "CN-02",
 author: "Nurse Triage",
 role: "PICU Staff Nurse",
 text: "Guardian present at bedside. SpO2 currently 91% on room air, 96% with nasal cannula. Patient calm.",
 timestamp: "2026-09-09T07:15:00Z",
 },
 ],
 },
 {
 id: "CASE-2026-002",
 patientId: "PT-1002",
 patientName: "Anaya Rao",
 ageText: "3 yrs",
 chiefComplaint: "Post-operative monitoring post Tetralogy repair, fever spike",
 primaryCondition: "Tetralogy of Fallot Repair - Post-Op Day 3 Fever",
 urgency: "Urgent",
 currentStage: 8, // Treatment Started
 stageHistory: [
 { stageNumber: 1, updatedAt: "2026-09-07T14:15:00Z", updatedBy: "Admission Triage" },
 { stageNumber: 6, updatedAt: "2026-09-07T15:00:00Z", updatedBy: "Dr. Nimal Jayawardene" },
 { stageNumber: 8, updatedAt: "2026-09-08T09:00:00Z", updatedBy: "Surgical Team" },
 ],
 vitals: {
 heartRate: 132,
 respiratoryRate: 28,
 systolicBp: 102,
 diastolicBp: 64,
 spO2: 95,
 temperature: 38.6,
 weightKg: 14.2,
 painScale: 4,
 timestamp: "2026-09-09T08:15:00Z",
 },
 assignedSpecialistId: "SPEC-CARD-02",
 assignedSpecialistName: "Dr. Nimal Jayawardene",
 assignedAt: "2026-09-07T15:00:00Z",
 specialistSignOff: false,
 ward: "PICU",
 createdAt: "2026-09-07T14:15:00Z",
 updatedAt: "2026-09-09T08:15:00Z",
 clinicalNotes: [
 {
 id: "CN-03",
 author: "Dr. Nimal Jayawardene",
 role: "Senior Pediatric Cardiologist",
 text: "Blood cultures drawn for fever spike (38.6°C). Sternal wound intact without purulence. Broad-spectrum antibiotic coverage started.",
 timestamp: "2026-09-09T08:15:00Z",
 },
 ],
 },
 {
 id: "CASE-2026-003",
 patientId: "PT-1003",
 patientName: "Rehan Sharma",
 ageText: "5 yrs",
 chiefComplaint: "Cluster seizures > 10 minutes, post-ictal lethargy",
 primaryCondition: "Status Epilepticus / Refractory Seizures",
 urgency: "Critical",
 currentStage: 5, // Specialist Recommendation
 stageHistory: [
 { stageNumber: 1, updatedAt: "2026-09-09T06:00:00Z", updatedBy: "ER Triage" },
 { stageNumber: 2, updatedAt: "2026-09-09T06:10:00Z", updatedBy: "ER Nurse" },
 { stageNumber: 3, updatedAt: "2026-09-09T06:25:00Z", updatedBy: "Attending ER Physician" },
 { stageNumber: 4, updatedAt: "2026-09-09T06:30:00Z", updatedBy: "System Engine" },
 { stageNumber: 5, updatedAt: "2026-09-09T06:31:00Z", updatedBy: "Matching Engine", note: "Recommended Dr. Sahan Perera (Match Score 96%)" },
 ],
 vitals: {
 heartRate: 142,
 respiratoryRate: 32,
 systolicBp: 118,
 diastolicBp: 76,
 spO2: 93,
 temperature: 37.8,
 weightKg: 18.0,
 painScale: 0,
 timestamp: "2026-09-09T06:25:00Z",
 },
 assignedSpecialistId: null,
 assignedSpecialistName: null,
 specialistSignOff: false,
 ward: "PICU",
 createdAt: "2026-09-09T06:00:00Z",
 updatedAt: "2026-09-09T06:31:00Z",
 clinicalNotes: [
 {
 id: "CN-04",
 author: "Dr. Prabhu",
 role: "ER Attending",
 text: "IV Midazolam bolus administered. Seizures aborted. Immediate pediatric neurology consult required for continuous EEG placement.",
 timestamp: "2026-09-09T06:30:00Z",
 },
 ],
 },
 {
 id: "CASE-2026-004",
 patientId: "PT-1004",
 patientName: "Myra Joseph",
 ageText: "5 yrs",
 chiefComplaint: "Wheezing, persistent cough, intercostal retractions",
 primaryCondition: "Severe Acute Bronchiolitis with Hypoxemia",
 urgency: "Moderate",
 currentStage: 9,
 stageHistory: [
 { stageNumber: 1, updatedAt: "2026-09-09T10:20:00Z", updatedBy: "Pediatric Ward Nurse" },
 { stageNumber: 6, updatedAt: "2026-09-09T10:45:00Z", updatedBy: "Dr. Anitha Raman" },
 { stageNumber: 9, updatedAt: "2026-09-09T11:30:00Z", updatedBy: "Dr. Anitha Raman" },
 ],
 vitals: {
 heartRate: 118,
 respiratoryRate: 26,
 systolicBp: 104,
 diastolicBp: 66,
 spO2: 97,
 temperature: 37.1,
 weightKg: 17.5,
 painScale: 2,
 timestamp: "2026-09-09T11:30:00Z",
 },
 assignedSpecialistId: "SPEC-CARD-01",
 assignedSpecialistName: "Dr. Anitha Raman",
 assignedAt: "2026-09-09T10:45:00Z",
 specialistSignOff: false,
 ward: "Pediatric Wards",
 createdAt: "2026-09-09T10:20:00Z",
 updatedAt: "2026-09-09T11:30:00Z",
 clinicalNotes: [
 {
 id: "CN-05",
 author: "Dr. Anitha Raman",
 role: "Consultant Pediatrician",
 text: "Nebulizer treatment complete. Retractions resolved. SpO2 97% on room air. Pending final discharge checkpoint sign-off.",
 timestamp: "2026-09-09T11:30:00Z",
 },
 ],
 },
];

const INITIAL_ALERTS: ExecutiveAlert[] = [
 {
 id: "ALT-01",
 caseId: "CASE-2026-001",
 patientId: "PT-1001",
 patientName: "Ishaan Menon",
 severity: "critical",
 title: "Overdue Specialist Follow-up (>48h)",
 detail: "Case #CASE-2026-001 in PICU requires formal 48-hour cardiology re-evaluation and echo review.",
 checkpointType: "overdue_consult",
 createdAt: "2026-09-09T08:00:00Z",
 acknowledged: false,
 },
 {
 id: "ALT-02",
 caseId: "CASE-2026-003",
 patientId: "PT-1003",
 patientName: "Rehan Sharma",
 severity: "critical",
 title: "Unassigned Critical Specialist Recommendation",
 detail: "Child with status epilepticus awaiting clinician human decision on Dr. Sahan Perera recommendation (>30 min delay).",
 checkpointType: "treatment_delayed",
 createdAt: "2026-09-09T06:31:00Z",
 acknowledged: false,
 },
 {
 id: "ALT-03",
 caseId: "CASE-2026-001",
 patientId: "PT-1001",
 patientName: "Ishaan Menon",
 severity: "amber",
 title: "Out-of-Range Vitals Threshold Flag (SpO2 91%)",
 detail: "SpO2 91% for 7-year-old child in PICU is below the 95% threshold. Nurse alerted.",
 checkpointType: "vitals_unresolved",
 createdAt: "2026-09-09T09:40:00Z",
 acknowledged: false,
 },
 {
 id: "ALT-04",
 caseId: "CASE-2026-004",
 patientId: "PT-1004",
 patientName: "Myra Joseph",
 severity: "blue",
 title: "Discharge Readiness Checkpoint Pending",
 detail: "Patient meets clinical discharge criteria in Pediatric Wards. Awaiting specialist sign-off or documented exception.",
 checkpointType: "discharge_pending",
 createdAt: "2026-09-09T11:30:00Z",
 acknowledged: false,
 },
 {
 id: "ALT-05",
 caseId: "CASE-2026-002",
 patientId: "PT-1002",
 patientName: "Anaya Rao",
 severity: "amber",
 title: "Post-Operative Day 3 Follow-up Checkpoint",
 detail: "Fever spike detected during post-op care continuity phase. Blood culture results pending.",
 checkpointType: "followup_checkpoint",
 createdAt: "2026-09-09T08:15:00Z",
 acknowledged: false,
 },
];

const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
 {
 id: "AUD-101",
 timestamp: "2026-09-09T11:30:00Z",
 user: "Dr. Anitha Raman",
 userRole: "Chief of Pediatric Cardiology",
 actionType: "STAGE_ADVANCED",
 caseId: "CASE-2026-004",
 patientId: "PT-1004",
 patientName: "Myra Joseph",
 summary: "Advanced case stage to Stage 9 (Continuity & Follow-up)",
 details: "Nebulizer treatment successful. Patient oxygen saturation normalized to 97%.",
 },
 {
 id: "AUD-102",
 timestamp: "2026-09-09T09:40:00Z",
 user: "Nurse Triage",
 userRole: "PICU Staff Nurse",
 actionType: "VITALS_ALERT",
 caseId: "CASE-2026-001",
 patientId: "PT-1001",
 patientName: "Ishaan Menon",
 summary: "Recorded out-of-range vitals for 7-year-old child",
 details: "Heart rate 154 bpm (Age 7 Normal: 70-120 bpm), SpO2 91% (Normal: >95%). Nasal cannula initiated.",
 },
 {
 id: "AUD-103",
 timestamp: "2026-09-09T06:35:00Z",
 user: "Dr. Prabhu",
 userRole: "Chief Pediatrician",
 actionType: "SPECIALIST_OVERRIDDEN",
 caseId: "CASE-2026-002",
 patientId: "PT-1002",
 patientName: "Anaya Rao",
 summary: "Clinician override executed for specialist recommendation",
 details: "Assigned Dr. Nimal Jayawardene instead of default match.",
 overrideReason: "Dr. Nimal Jayawardene performed the original Tetralogy repair surgery and knows patient surgical history.",
 },
 {
 id: "AUD-104",
 timestamp: "2026-09-08T09:35:00Z",
 user: "Dr. Anitha Raman",
 userRole: "Chief of Pediatric Cardiology",
 actionType: "SPECIALIST_ACCEPTED",
 caseId: "CASE-2026-001",
 patientId: "PT-1001",
 patientName: "Ishaan Menon",
 summary: "Accepted AI Specialist Match Recommendation",
 details: "Assigned Dr. Anitha Raman (Cardiology, Match Score 98%). Advanced stage to Stage 6.",
 },
 {
 id: "AUD-105",
 timestamp: "2026-09-08T08:30:00Z",
 user: "Care Coordinator",
 userRole: "Admissions Specialist",
 actionType: "INTAKE_REGISTERED",
 caseId: "CASE-2026-001",
 patientId: "PT-1001",
 patientName: "Ishaan Menon",
 summary: "New Intake Registered with Digital Consent",
 details: "Captured demographics, guardian authorization, and digital HIPAA consent. Case initialized at Stage 1.",
 },
];

export const PediatricProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [patients, setPatients] = useState<Patient[]>(() => {
 const saved = localStorage.getItem("pcn_patients");
 return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
 });

 const [cases, setCases] = useState<PatientCase[]>(() => {
 const saved = localStorage.getItem("pcn_cases");
 return saved ? JSON.parse(saved) : INITIAL_CASES;
 });

 const [specialists, setSpecialists] = useState<Specialist[]>(INITIAL_SPECIALISTS);

 const [alerts, setAlerts] = useState<ExecutiveAlert[]>(() => {
 const saved = localStorage.getItem("pcn_alerts");
 return saved ? JSON.parse(saved) : INITIAL_ALERTS;
 });

 const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
 const saved = localStorage.getItem("pcn_audit_log");
 return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOG;
 });

 const [chats, setChats] = useState<ChatThread[]>(() => {
 const saved = localStorage.getItem("pcn_chats");
 return saved ? JSON.parse(saved) : [];
 });

 // Save to LocalStorage whenever state changes
 useEffect(() => {
 localStorage.setItem("pcn_patients", JSON.stringify(patients));
 }, [patients]);

 useEffect(() => {
 localStorage.setItem("pcn_cases", JSON.stringify(cases));
 }, [cases]);

 useEffect(() => {
 localStorage.setItem("pcn_alerts", JSON.stringify(alerts));
 }, [alerts]);

 useEffect(() => {
 localStorage.setItem("pcn_audit_log", JSON.stringify(auditLog));
 }, [auditLog]);

 useEffect(() => {
 localStorage.setItem("pcn_chats", JSON.stringify(chats));
 }, [chats]);

 const getChatThread = (patientId: string) => {
   return chats.find(c => c.patientId === patientId);
 };

 const startChatThread = (patientId: string, specialistIds: string[]) => {
   setChats(prev => {
     if (prev.find(c => c.patientId === patientId)) return prev;
     return [...prev, { patientId, specialistIds, messages: [] }];
   });
 };

 const addChatMessage = (patientId: string, message: Omit<ChatMessage, "id" | "timestamp">) => {
   const newMessage: ChatMessage = {
     ...message,
     id: `MSG-${Date.now().toString().slice(-6)}`,
     timestamp: new Date().toISOString()
   };
   
   setChats(prev => prev.map(chat => {
     if (chat.patientId === patientId) {
       return { ...chat, messages: [...chat.messages, newMessage] };
     }
     return chat;
   }));
 };

 const addAuditEntry = (entry: Omit<AuditLogEntry, "id" | "timestamp">) => {
 const newEntry: AuditLogEntry = {
 ...entry,
 id: `AUD-${Date.now().toString().slice(-5)}`,
 timestamp: new Date().toISOString(),
 };
 setAuditLog(prev => [newEntry, ...prev]);
 };

 const registerIntake: PediatricContextType["registerIntake"] = (patientData, caseData) => {
 const patientId = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
 const caseId = `CASE-2026-${Math.floor(100 + Math.random() * 900)}`;
 const now = new Date().toISOString();

 const newPatient: Patient = {
 ...patientData,
 id: patientId,
 consentSigned: true,
 consentTimestamp: now,
 };

 const newCase: PatientCase = {
 id: caseId,
 patientId: patientId,
 patientName: patientData.fullName,
 ageText: `${patientData.ageYears} yrs`,
 chiefComplaint: caseData.chiefComplaint,
 primaryCondition: caseData.primaryCondition,
 urgency: caseData.urgency,
 currentStage: 4, // Intake completes stages 1-3, sets case to stage 4 (Matching Request)
 stageHistory: [
 { stageNumber: 1, updatedAt: now, updatedBy: "Registration System", note: "Demographics and digital consent recorded" },
 { stageNumber: 2, updatedAt: now, updatedBy: "Nurse Triage", note: "Vitals recorded and age thresholds checked" },
 { stageNumber: 3, updatedAt: now, updatedBy: "Attending Clinician", note: "Chief complaint & initial clinical assessment compiled" },
 { stageNumber: 4, updatedAt: now, updatedBy: "Matching Engine", note: "Specialist matching request triggered" },
 ],
 vitals: caseData.vitals,
 assignedSpecialistId: null,
 assignedSpecialistName: null,
 specialistSignOff: false,
 ward: caseData.ward,
 createdAt: now,
 updatedAt: now,
 clinicalNotes: [
 {
 id: `CN-${Date.now()}`,
 author: "Admissions Nurse",
 role: "Registration & Triage",
 text: `Patient registered with chief complaint: ${caseData.chiefComplaint}. Digital guardian consent verified. Initial vitals captured.`,
 timestamp: now,
 },
 ],
 documents: caseData.documents || [],
 };

 setPatients(prev => [newPatient, ...prev]);
 setCases(prev => [newCase, ...prev]);

 // Push to Audit Log
 addAuditEntry({
 user: "Admissions Specialist",
 userRole: "Clinical Registrar",
 actionType: "INTAKE_REGISTERED",
 caseId: caseId,
 patientId: patientId,
 patientName: patientData.fullName,
 summary: `Registered new patient intake: ${patientData.fullName} (${caseData.urgency} Urgency)`,
 details: `Demographics, digital guardian consent, and vitals logged. Case initialized at Stage 4 (Matching Request).`,
 });

 return { patientId, caseId };
 };

 const updateCaseStage: PediatricContextType["updateCaseStage"] = (caseId, newStage, note) => {
 const now = new Date().toISOString();
 setCases(prev =>
 prev.map(c => {
 if (c.id === caseId) {
 const updatedHistory = [
 ...c.stageHistory,
 { stageNumber: newStage, updatedAt: now, updatedBy: "Clinician User", note },
 ];
 return {
 ...c,
 currentStage: newStage,
 stageHistory: updatedHistory,
 updatedAt: now,
 };
 }
 return c;
 })
 );

 const targetCase = cases.find(c => c.id === caseId);
 const stageInfo = CARE_STAGES.find(s => s.stageNumber === newStage);

 addAuditEntry({
 user: "Dr. Anitha Raman",
 userRole: "Attending Clinician",
 actionType: "STAGE_ADVANCED",
 caseId,
 patientId: targetCase?.patientId,
 patientName: targetCase?.patientName,
 summary: `Advanced Case #${caseId} to Stage ${newStage}: ${stageInfo?.name}`,
 details: note || stageInfo?.description,
 });
 };

 const updateCaseVitals: PediatricContextType["updateCaseVitals"] = (caseId, newVitals) => {
 const now = new Date().toISOString();
 setCases(prev =>
 prev.map(c => (c.id === caseId ? { ...c, vitals: newVitals, updatedAt: now } : c))
 );

 const targetCase = cases.find(c => c.id === caseId);
 
 // Phase 3: Advanced Pattern Recognition (Early Complication Detection)
 if (targetCase) {
   // Simulated ML ruleset: if SpO2 drops below 92 or HR spikes > 150, trigger predictive warning
   if (newVitals.spO2 < 92 || newVitals.heartRate > 150) {
     const mlAlert: ExecutiveAlert = {
       id: `ML-ALERT-${Date.now()}`,
       caseId: targetCase.id,
       patientId: targetCase.patientId,
       patientName: targetCase.patientName,
       severity: "critical",
       checkpointType: "vitals_unresolved",
       title: "Predictive AI: Clinical Deterioration Risk",
       detail: `Early complication detection model flagged rapid degradation based on vitals trend (SpO2: ${newVitals.spO2}%, HR: ${newVitals.heartRate}). High risk of respiratory failure. Immediate intervention recommended.`,
       createdAt: now,
       acknowledged: false
     };
     
     // Ensure we don't spam the same alert if it's already there and unacknowledged
     setAlerts(prev => {
       const hasActiveMLAlert = prev.some(a => a.caseId === caseId && a.title.includes("Predictive AI") && !a.acknowledged);
       if (hasActiveMLAlert) return prev;
       return [mlAlert, ...prev];
     });
   }
 }

 addAuditEntry({
 user: "Clinical Nurse",
 userRole: "PICU Nursing",
 actionType: "VITALS_ALERT",
 caseId,
 patientId: targetCase?.patientId,
 patientName: targetCase?.patientName,
 summary: `Updated vitals monitoring for ${targetCase?.patientName || caseId}`,
 details: `HR: ${newVitals.heartRate} bpm, RR: ${newVitals.respiratoryRate}, SpO2: ${newVitals.spO2}%, BP: ${newVitals.systolicBp}/${newVitals.diastolicBp}.`,
 });
 };

 const acceptSpecialist: PediatricContextType["acceptSpecialist"] = (
 caseId,
 specialistId,
 clinicianName = "Dr. Anitha Raman"
 ) => {
 const spec = specialists.find(s => s.id === specialistId);
 const targetCase = cases.find(c => c.id === caseId);
 if (!spec || !targetCase) return;

 const now = new Date().toISOString();

 setCases(prev =>
 prev.map(c => {
 if (c.id === caseId) {
 const stageHist = [
 ...c.stageHistory,
 {
 stageNumber: 4 as CareStageNumber,
 updatedAt: now,
 updatedBy: clinicianName,
 note: `Accepted AI Specialist Recommendation: ${spec.name} (${spec.specialty})`,
 },
 {
 stageNumber: 5 as CareStageNumber,
 updatedAt: now,
 updatedBy: "System Engine",
 note: `Referral routed to ${spec.name}`,
 },
 ];
 return {
 ...c,
 assignedSpecialistId: spec.id,
 assignedSpecialistName: spec.name,
 assignedAt: now,
 currentStage: 5,
 stageHistory: stageHist,
 updatedAt: now,
 };
 }
 return c;
 })
 );

 // Remove any critical alert about unassigned specialist for this case
 setAlerts(prev => prev.filter(a => !(a.caseId === caseId && a.checkpointType === "treatment_delayed")));

 addAuditEntry({
 user: clinicianName,
 userRole: "Attending Clinician",
 actionType: "SPECIALIST_ACCEPTED",
 caseId,
 patientId: targetCase.patientId,
 patientName: targetCase.patientName,
 summary: `Accepted AI Specialist Recommendation: ${spec.name}`,
 details: `Specialist ${spec.name} (${spec.specialty} - ${spec.subSpecialty}) assigned to case. Match score: ${spec.matchScoreDefault}%. Stage advanced to Stage 7 (Consult Scheduled).`,
 });
 };

 const overrideSpecialist: PediatricContextType["overrideSpecialist"] = (
 caseId,
 specialistId,
 structuredReason,
 clinicianName = "Dr. Prabhu"
 ) => {
 const spec = specialists.find(s => s.id === specialistId);
 const targetCase = cases.find(c => c.id === caseId);
 if (!spec || !targetCase) return;

 const now = new Date().toISOString();

 setCases(prev =>
 prev.map(c => {
 if (c.id === caseId) {
 const stageHist = [
   ...c.stageHistory,
   {
     stageNumber: 4 as CareStageNumber,
     updatedAt: now,
     updatedBy: clinicianName,
     note: `CLINICIAN OVERRIDE: Selected ${spec.name} (${spec.specialty}). Reason: ${structuredReason}`,
   },
   {
     stageNumber: 5 as CareStageNumber,
     updatedAt: now,
     updatedBy: "System Engine",
     note: `Referral routed to ${spec.name}`,
   },
 ];
 return {
   ...c,
   assignedSpecialistId: spec.id,
   assignedSpecialistName: spec.name,
   overrideReason: structuredReason,
   assignedAt: now,
   currentStage: 5,
   stageHistory: stageHist,
   updatedAt: now,
 };
 }
 return c;
 })
 );

 // Remove unassigned specialist alert
 setAlerts(prev => prev.filter(a => !(a.caseId === caseId && a.checkpointType === "treatment_delayed")));

 addAuditEntry({
 user: clinicianName,
 userRole: "Hospital Leadership / Senior Clinician",
 actionType: "SPECIALIST_OVERRIDDEN",
 caseId,
 patientId: targetCase.patientId,
 patientName: targetCase.patientName,
 summary: `CLINICIAN OVERRIDE: Specialist selection modified for ${targetCase.patientName}`,
 details: `Replaced default recommendation with ${spec.name} (${spec.specialty}). Stage advanced to Stage 7.`,
 overrideReason: structuredReason,
 });
 };

 const acknowledgeAlert: PediatricContextType["acknowledgeAlert"] = (
 alertId,
 actionTaken,
 clinicianName = "Dr. Anitha Raman"
 ) => {
 const now = new Date().toISOString();
 let targetAlert: ExecutiveAlert | undefined;

 setAlerts(prev =>
 prev.map(a => {
 if (a.id === alertId) {
 targetAlert = a;
 return {
 ...a,
 acknowledged: true,
 acknowledgedBy: clinicianName,
 acknowledgedAt: now,
 actionTaken,
 };
 }
 return a;
 })
 );

 if (targetAlert) {
 addAuditEntry({
 user: clinicianName,
 userRole: "Attending Clinician",
 actionType: "ALERT_ACKNOWLEDGED",
 caseId: targetAlert.caseId,
 patientId: targetAlert.patientId,
 patientName: targetAlert.patientName,
 summary: `Acknowledged Executive Alert: "${targetAlert.title}"`,
 details: `Action taken: ${actionTaken}. Severity: ${targetAlert.severity.toUpperCase()}. Checkpoint: ${targetAlert.checkpointType}.`,
 });
 }
 };

 const closeCase: PediatricContextType["closeCase"] = (
  caseId,
  signOff,
  documentedException,
  clinicianName = "Dr. Anitha Raman"
  ) => {
  const targetCase = cases.find(c => c.id === caseId);
  if (!targetCase) return { success: false, error: "Case not found" };

  // Check for active alerts (unacknowledged)
  const activeAlerts = alerts.filter(a => a.caseId === caseId && !a.acknowledged);
  if (activeAlerts.length > 0 && (!documentedException || !documentedException.trim())) {
  return {
  success: false,
  error: "Active clinical checkpoints must be acknowledged before case closure.",
  };
  }

  // Prevent closing without specialist signoff or explicit documented exception
  if (!signOff && (!documentedException || !documentedException.trim())) {
  return {
  success: false,
  error: "Strict Clinical Safeguard: Case closure requires explicit specialist sign-off OR a documented exception reason.",
  };
  }

 const now = new Date().toISOString();

 setCases(prev =>
 prev.map(c => {
 if (c.id === caseId) {
 const stageHist = [
 ...c.stageHistory,
 {
 stageNumber: 10 as CareStageNumber,
 updatedAt: now,
 updatedBy: clinicianName,
 note: signOff
 ? "Specialist sign-off recorded. Clinical resolution confirmed."
 : `Case closed under documented exception: ${documentedException}`,
 },
 ];
 return {
 ...c,
 currentStage: 10,
 specialistSignOff: signOff,
 specialistSignOffAt: signOff ? now : undefined,
 documentedException: documentedException || null,
 documentedExceptionAt: documentedException ? now : undefined,
 stageHistory: stageHist,
 updatedAt: now,
 };
 }
 return c;
 })
 );

  addAuditEntry({
    user: clinicianName,
    userRole: "Specialist / Attending Physician",
    actionType: "CASE_CLOSED",
    caseId,
    patientId: targetCase.patientId,
    patientName: targetCase.patientName,
    summary: `CASE CLOSED: ${targetCase.patientName} (${caseId})`,
    details: signOff
    ? "Explicit specialist sign-off recorded. Continuity of care checkpoints satisfied."
    : "Closed with documented clinical exception.",
    exceptionReason: documentedException,
  });

  // Phase 2: Learning Loop
  // Feed successful case outcome back into recommendation weighting
  if (signOff && targetCase.assignedSpecialistId) {
    setSpecialists(prev => prev.map(s => {
      if (s.id === targetCase.assignedSpecialistId) {
        return {
          ...s,
          matchScoreDefault: Math.min(99, s.matchScoreDefault + 1)
        };
      }
      return s;
    }));
    addAuditEntry({
      user: "System Learning Engine",
      userRole: "System",
      actionType: "NOTE_ADDED",
      summary: `Learning Loop: Adjusted model weights for ${targetCase.assignedSpecialistName}`,
      details: "Outcome analysis complete. Match weighting increased due to successful case resolution."
    });
  }

  return { success: true };
 };

 const addClinicalNote: PediatricContextType["addClinicalNote"] = (
 caseId,
 text,
 author = "Dr. Anitha Raman"
 ) => {
 const now = new Date().toISOString();
 const newNote = {
 id: `CN-${Date.now()}`,
 author,
 role: "Attending Clinician",
 text,
 timestamp: now,
 };

 setCases(prev =>
 prev.map(c => (c.id === caseId ? { ...c, clinicalNotes: [newNote, ...c.clinicalNotes] } : c))
 );

 const targetCase = cases.find(c => c.id === caseId);
 addAuditEntry({
 user: author,
 userRole: "Attending Clinician",
 actionType: "NOTE_ADDED",
 caseId,
 patientId: targetCase?.patientId,
 patientName: targetCase?.patientName,
 summary: `Added clinical note to Master Health Record (${caseId})`,
 details: text,
 });
 };

 const requestSecondOpinion = (caseId: string) => {
    const targetCase = cases.find(c => c.id === caseId);
    if (!targetCase) return;

    addAuditEntry({
      user: "Parent/Guardian",
      userRole: "Guardian",
      actionType: "SECOND_OPINION_REQUESTED",
      caseId,
      patientId: targetCase.patientId,
      patientName: targetCase.patientName,
      summary: `Second opinion requested for ${targetCase.patientName}`,
      details: "A parent/guardian has requested a second opinion via the Parent Portal.",
    });

    const now = new Date().toISOString();
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          stageHistory: [
            ...c.stageHistory,
            {
              stageNumber: c.currentStage,
              updatedAt: now,
              updatedBy: "System Engine",
              note: "Second opinion request initiated."
            }
          ],
          updatedAt: now
        };
      }
      return c;
    }));
  };

  const getPatientById = (patientId: string) => patients.find(p => p.id === patientId);
  const getCaseById = (caseId: string) => cases.find(c => c.id === caseId);
  const getCaseByPatientId = (patientId: string) => cases.find(c => c.patientId === patientId);

  const addSpecialist: PediatricContextType["addSpecialist"] = (specData) => {
    const newSpec: Specialist = {
      ...specData,
      id: `DR-${Math.floor(Math.random() * 9000) + 1000}`,
    };
    setSpecialists(prev => [...prev, newSpec]);
    addAuditEntry({
      user: "System Admin",
      userRole: "Admin",
      actionType: "STAGE_ADVANCED",
      summary: `Added new specialist: ${newSpec.name}`,
    });
  };

  const updateSpecialist: PediatricContextType["updateSpecialist"] = (id, updates) => {
    setSpecialists(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    addAuditEntry({
      user: "System Admin",
      userRole: "Admin",
      actionType: "STAGE_ADVANCED",
      summary: `Updated specialist profile: ${id}`,
    });
  };

  const removeSpecialist: PediatricContextType["removeSpecialist"] = (id) => {
    setSpecialists(prev => prev.filter(s => s.id !== id));
    addAuditEntry({
      user: "System Admin",
      userRole: "Admin",
      actionType: "STAGE_ADVANCED",
      summary: `Removed specialist from directory: ${id}`,
    });
  };

  return (
  <PediatricContext.Provider
  value={{
  patients,
  cases,
  specialists,
  alerts,
  auditLog,
  chats,
  registerIntake,
  updateCaseStage,
  updateCaseVitals,
  acceptSpecialist,
  overrideSpecialist,
  acknowledgeAlert,
  closeCase,
  addClinicalNote,
  addAuditEntry,
  requestSecondOpinion,
  getPatientById,
  getCaseById,
  getCaseByPatientId,
  getChatThread,
  startChatThread,
  addChatMessage,
  addSpecialist,
  updateSpecialist,
  removeSpecialist
  }}
  >
  {children}
  </PediatricContext.Provider>
  );
};

export function usePediatric() {
 const context = useContext(PediatricContext);
 if (!context) {
 throw new Error("usePediatric must be used within a PediatricProvider");
 }
 return context;
}
