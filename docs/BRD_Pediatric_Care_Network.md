Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

BUSINESS REQUIREMENTS DOCUMENT

Pediatric Care Network

Intelligent Specialist Matching & Continuity of Care Platform
Right Child. Right Expert. Right Time. Better Outcomes.

Field

Detail

Document Title

Business Requirements Document — Pediatric Care Network Platform

Version

0.1

Status

Draft — for stakeholder review and sign-off

Date

24 August 2026

Prepared By

Business Analyst

Business Sponsor

Dr. Prabhu, Chief Pediatrician

Source Input

Executive vision deck (PrabhuSirPresentation.pptx, 12 slides)

Classification

Confidential — Internal Use Only

This document is a controlled deliverable. Requirements are baselined on approval; subsequent changes are subject to formal change
control.

Confidential — Internal Use Only

Page 1 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

Table of Contents
1. Document Control................................................................................................................................................... 3
2. Executive Summary................................................................................................................................................. 3
3. Business Context & Problem Statement................................................................................................................. 4
4. Business Objectives & Success Metrics................................................................................................................... 5
5. Scope....................................................................................................................................................................... 6
6. Stakeholders & User Personas................................................................................................................................ 7
7. Business Process — The Child Journey.................................................................................................................... 8
8. Functional Requirements........................................................................................................................................ 8
9. Data Requirements................................................................................................................................................15
10. Non-Functional Requirements............................................................................................................................ 16
11. Integration Requirements...................................................................................................................................17
12. Regulatory & Compliance Requirements............................................................................................................ 18
13. Assumptions, Constraints & Dependencies........................................................................................................18
14. Risk Register........................................................................................................................................................ 19
15. Phased Delivery Plan........................................................................................................................................... 20
16. Business Acceptance Criteria — Phase 1.............................................................................................................20
17. Open Questions................................................................................................................................................... 20
Appendix A — Requirements Traceability Matrix.....................................................................................................21
Appendix B — Glossary.............................................................................................................................................22

Confidential — Internal Use Only

Page 2 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

1. Document Control
1.1 Revision History
Ver

Date

Author

Change Summary

0.1

24-Aug-2026

Business Analyst

Initial draft derived from the executive vision deck

1.2 Approvals
This document requires sign-off from each of the following before the requirements baseline is established and
build commences.
Role

Name

Business Sponsor / Chief Pediatrician

TBD

Head of Clinical Operations

TBD

CIO / Head of IT

TBD

Data Protection Officer

TBD

Quality & Compliance Head (NABH)

TBD

Delivery Manager

TBD

Signature

Date

1.3 Distribution List
Recipient Group

Purpose

Clinical Governance Board

Review and approval of clinical rules and decision-support scope

Hospital Leadership

Scope, phasing and investment approval

IT & Integration Team

Technical feasibility and integration planning

Legal & Data Protection

Consent model, children's data processing, repository publication

Delivery / Engineering Team

Build input and estimation

2. Executive Summary
The Pediatric Care Network is a cloud-based clinical platform that ensures every child entering the hospital is
routed to the most appropriate pediatric specialist at the earliest possible point in their care journey, with
qualified clinician oversight at every step.
The platform is explicitly not a diagnostic engine and does not replace clinical judgement. It is a decision-support
and care-coordination system with six core capabilities:
1. Capture structured symptom, vitals and clinical assessment data at the point of intake.
2. Recommend the most suitable pediatric specialist based on condition, urgency, specialist experience and
historical outcome data — for a clinician to confirm, override or escalate.
3. Maintain a single longitudinal digital record per child covering clinical notes, laboratory results, imaging,
media, consents, prescriptions and discharge summaries.
Confidential — Internal Use Only

Page 3 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

4. Continuously evaluate every open case against five clinical checkpoints and escalate when a case stalls.
5. Give hospital leadership real-time operational visibility across departments and, in later phases, across the
facility network.
6. Convert closed cases into a de-identified, searchable knowledge repository that improves future referral
accuracy and supports medical education.

Primary business outcome: reduce time-to-right-specialist, reduce complications and readmissions arising from delayed
or misrouted referrals, and eliminate cases that fall through the cracks between departments.

Delivery is proposed in three phases. Phase 1 establishes the end-to-end clinical journey, the master health
record, the checkpoint engine and single-facility leadership dashboards. Phase 2 adds the parent-facing
experience, teleconsultation, multidisciplinary collaboration, multi-facility consolidation and the knowledge
repository. Phase 3 introduces advanced predictive capability and the medical-education module.

phase
items
should
separated
properly.

3. Business Context & Problem Statement
3.1 Current State
Several hundred children present daily across OPD, Emergency, inpatient wards, PICU and NICU. Presentations
range from routine childhood illness to rare conditions requiring highly sub-specialised intervention.
The bottleneck identified by the business sponsor is specific and deliberate:

Problem statement: The difficulty is not finding a pediatrician. The difficulty is finding the right pediatric expert at the
right time.

3.2 Pain Points
Ref

Pain Point

Business Impact

P1

Referral routing depends on the individual
knowledge of whoever is on duty

Inconsistent routing; the outcome varies by shift rather
than by clinical need

P2

Specialist experience and outcome history are not
visible at the point of referral

Referrals made on availability rather than suitability

P3

History and prior investigations are fragmented
across paper, PACS, LIS and departmental systems

Repeat investigations, delayed decisions, avoidable
radiation exposure and blood draws

P4

No systematic tracking of whether a referral was
actually acted upon

Cases stall silently; follow-ups are missed

P5

Multidisciplinary discussion is ad hoc and
undocumented

Decisions are not auditable; clinical rationale is lost

P6

Parents lack visibility into who is treating their child
and why

Low trust, repeated queries, friction at consent points

P7

Leadership has no live operational view across
departments or facilities

Reactive management; load imbalance detected late

Confidential — Internal Use Only

Page 4 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

Ref

Pain Point

Business Impact

P8

Clinical learning from treated cases is not captured
or reusable

Institutional knowledge leaves with individuals

3.3 Desired Future State
A single platform in which every child is assessed correctly, guided intelligently, connected to the right specialist
without delay, treated according to evidence-based protocol, and monitored until complete recovery — with
parents informed throughout and their right to a second opinion explicitly supported.

3.4 Guiding Principles
The following principles were stated by the sponsor as non-negotiable. Each carries a direct and testable design
implication.
ID

Principle

Design Implication

GP1

Human in the loop — the system
recommends, a clinician decides

No automatic assignment without clinician confirmation; override
always available and always recorded with a structured reason

GP2

Data in action — recommendations
grounded in real history and outcomes

Every recommendation must present its supporting evidence, not
merely a ranked name

GP3

Transparency to parents — parents see
relevant experience and outcome data

Parent-facing views must be curated, accurate, risk-adjusted and nonmisleading

GP4

Second opinion is a right

The second-opinion request must be a first-class, frictionless
workflow that the system never discourages

GP5

Continuity until closure

A case is not complete until clinically resolved and signed off; the
system chases, not human memory

GP6

Every case teaches

Closed cases feed the knowledge base and the recommendation
weighting

4. Business Objectives & Success Metrics
Each objective is paired with a measurable KPI. Baseline values must be established during discovery; without
them, objectives BO2, BO3 and BO5 cannot be verified at acceptance. This is raised as open question OQ-01.

ID

Business Objective

KPI

Baseline

Target

BO1

Reduce time from presentation to
the correct specialist

Average referral time

TBD

< 30 minutes

BO2

Improve referral accuracy

% referrals not re-routed within 48
hours

TBD

+24% over baseline

BO3

Improve clinical outcomes

Recovery rate / complication rate

TBD

+18% improvement

BO4

Eliminate missed follow-ups

Count of overdue follow-ups

TBD

Zero missed per day

BO5

Reduce readmissions

30-day readmission rate

TBD

−10% year on year

Confidential — Internal Use Only

Page 5 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

ID

Business Objective

KPI

Baseline

Target

BO6

Establish a single source of truth per
child

% active cases with a complete
digital record

TBD

> 95%

BO7

Improve leadership responsiveness

Median time from alert raised to
action logged

TBD

< 60 minutes

BO8

Build institutional knowledge

Closed, consented cases published
to repository

0

100%

BO9

Increase parent confidence

Parent satisfaction on
communication

TBD

> 4.5 / 5

5. Scope
5.1 In Scope — Phase 1 (MVP)
• Child and guardian registration, identity resolution and consent capture
• Symptom intake and structured clinical assessment with age-aware vitals
• Specialist recommendation engine with mandatory clinician confirmation
• Referral routing, acceptance and in-person consultation scheduling
• Master Health Record — notes, labs, imaging, prescriptions, consents, discharge summaries
• Diagnosis coding and personalised treatment plan capture
• Follow-up scheduling, monitoring and clinician-signed case closure
• Clinical Intelligence checkpoint engine and escalation queues
• Executive Command Center dashboards for a single facility
• Role-based access control, break-glass access and full audit trail
• Master data administration — specialties, departments, specialists, protocols

5.2 In Scope — Phase 2
• Parent / guardian portal (web and mobile)
• Virtual consultation (teleconsultation)
• Multidisciplinary team collaboration workspace
• Second-opinion request workflow
• Multi-hospital rollout with consolidated network view
• Knowledge Repository — de-identified case search, imaging library, advanced filters
• Learning loop feeding closed-case outcomes into recommendation weighting

5.3 In Scope — Phase 3
• Advanced pattern recognition and early complication detection models
• Predictive analytics for bed and load forecasting
• Medical education module — curated teaching sets and rare-case collections
• External referral network beyond the hospital group

Confidential — Internal Use Only

Page 6 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

5.4 Out of Scope
The following are explicitly excluded from all phases of this initiative.
• Autonomous diagnosis or treatment decisions without clinician sign-off
• Billing, revenue cycle management, insurance claims and TPA processing
• Pharmacy inventory and supply chain management
• HR, payroll and staff rostering — roster data is consumed, not managed
• Replacement of the existing HIS, LIS or RIS-PACS; the platform integrates with them
• Adult care pathways
• Direct-to-consumer patient acquisition or marketplace functionality

6. Stakeholders & User Personas
6.1 Stakeholder Register
Stakeholder

Interest

Involvement

Chief Pediatrician (Sponsor)

Outcome quality, referral accuracy, network
visibility

Approves scope; owns clinical rules

Pediatricians / Care Team

Fast, accurate routing with low documentation
burden

Primary users; UAT participants

Pediatric Sub-specialists

Relevant referrals with complete context on
arrival

Primary users; UAT participants

Nursing & Care Coordinators

Task clarity and reliable follow-up tracking

Primary users

Hospital Leadership / COO

Capacity, load balance, throughput, safety

Dashboard consumers

Quality & Safety (NABH)

Complication tracking, protocol adherence,
audit evidence

Requirements input; audit sign-off

Parents / Guardians

Clarity, speed, trust and choice

End users (Phase 2); consent providers

IT & Integration Team

Interoperability, uptime, security

Delivery and ongoing support

Data Protection Officer /
Legal

Lawful processing of children's health data

Mandatory sign-off gate

Medical Education /
Academics

Teaching cases and research access

Repository consumers (Phase 3)

6.2 User Personas
Persona

Role

Primary Need

Dr. Anitha

General Pediatrician

“Tell me who this child should see, and show me why.”

Dr. Raghav

Pediatric Cardiologist

“Don't send me cases outside my scope; when you do, send the full
history with them.”

Sr. Meera

Care Coordinator

“Show me every child waiting on a step, and who owns it.”

Confidential — Internal Use Only

Page 7 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

Persona

Role

Primary Need

Dr. Prabhu

Chief Pediatrician

“One live screen across all departments — and tell me what needs
my attention now.”

Mr. & Mrs. Sharma

Parents / Guardians

“Who is treating my child, why them, what happens next, and can I
get another opinion?”

Priya

Quality Officer

“Evidence that protocol was followed, with a name and timestamp on
every decision.”

7. Business Process — The Child Journey
The care journey comprises ten defined stages. Every open case sits in exactly one stage at any point in time, and
every stage transition is timestamped and attributed to a named user.

#

Stage

Trigger

Owner

Exit Criteria

1

Registration

Child arrives or preregisters

Front desk

Child and guardian identity and
consent captured

2

Symptoms

Registration complete

Parent + nurse

Structured symptom set and vitals
recorded

3

Clinical Assessment

Symptoms captured

Pediatrician / care team

Assessment notes, provisional
impression and urgency grade
recorded

4

Specialist
Recommendation

Assessment complete

System recommends;
clinician confirms

Specialist confirmed, or
overridden with a documented
reason

5

Consultation

Referral accepted

Specialist

Consultation conducted and
documented (in-person or virtual)

6

Diagnosis

Consultation and
investigations complete

Specialist

Confirmed diagnosis coded and
recorded

7

Treatment

Diagnosis confirmed

Specialist + care team

Treatment plan created and
treatment initiated

8

Recovery

Treatment in progress

Care team

Progress monitored against plan
milestones

9

Follow-up

Discharge or plan
milestone

Care coordinator

Scheduled follow-ups completed
and outcomes recorded

10

Case Closed

Clinical resolution

Specialist sign-off

Child confirmed recovered or
stable; case archived

Escalation overlay: any case exceeding the SLA for its current stage is automatically flagged (At Risk, then Needs
Attention) and surfaced in the Alerts Center regardless of which stage it occupies.

8. Functional Requirements
Confidential — Internal Use Only

Page 8 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

Requirements are grouped into thirteen functional modules. Priority is expressed as M (Must have — MVP), S
(Should have) and C (Could have). Phase allocation is noted where it differs from Phase 1.

8.1 Registration, Identity & Consent
ID

Requirement

Pri

FR-REG-001

Register a child with demographics (name, date of birth, gender, blood group) and autogenerate a unique persistent Patient ID.

M

FR-REG-002

Link one or more guardians to a child record with relationship type and a legal-guardian flag.

M

FR-REG-003

Prevent duplicate registration through fuzzy matching on name, date of birth and guardian
contact; present merge candidates to an authorised user.

M

FR-REG-004

Capture and version digital consents (treatment, data processing, imaging and media
capture, repository publication, teleconsultation) with timestamp, capturing user and
consent text version.

M

FR-REG-005

Allow consent withdrawal at any time and propagate withdrawal to all downstream use,
including removal from the repository publication queue.

M

FR-REG-006

Support emergency registration with a minimum dataset, flagged for mandatory completion
within a configurable window.

M

FR-REG-007

Integrate with the existing HIS so that the platform Patient ID reconciles to the hospital MRN.

M

FR-REG-008

Support ABHA / national health ID linkage where the guardian opts in.

S

8.2 Symptom Intake & Clinical Assessment
ID

Requirement

Pri

FR-ASM-001

Capture presenting complaints using a structured, age-aware symptom taxonomy with a
free-text supplement.

M

FR-ASM-002

Record vitals (temperature, heart rate, respiratory rate, SpO₂, blood pressure, weight, height,
head circumference) with age-appropriate reference ranges displayed inline.

M

FR-ASM-003

Automatically flag any vital sign falling outside the age-appropriate threshold.

M

FR-ASM-004

Capture clinical assessment notes, examination findings and provisional impression.

M

FR-ASM-005

Assign an urgency grade (Emergency / Urgent / Routine) that drives the downstream referral
SLA.

M

FR-ASM-006

Surface the child's complete prior history — past cases, diagnoses, allergies, medications and
prior investigations — inline during assessment.

M

FR-ASM-007

Support voice-to-text and templated note entry to reduce documentation time.

C

Confidential — Internal Use Only

Page 9 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

8.3 Intelligent Specialist Recommendation Engine
This module carries the highest clinical-safety weight in the platform. Every requirement below is subject to
clinical governance sign-off before release.
ID

Requirement

Pri

FR-REC-001

Generate a ranked list of recommended specialists based on presenting condition, urgency,
required sub-specialty, specialist availability, specialist experience in that condition, and
historical outcome data.

M

FR-REC-002

Display, for each recommendation, the supporting rationale — matched condition, case
volume in that condition, outcome history, current load and next availability.

M

FR-REC-003

Never auto-assign. A recommendation becomes a referral only upon explicit clinician
confirmation.

M

FR-REC-004

Allow the clinician to override any recommendation and select a different specialist; a
structured override reason is mandatory.

M

FR-REC-005

Log every recommendation, its inputs and rationale, the clinician decision and the eventual
outcome, for audit and model evaluation.

M

FR-REC-006

Support recommendation of a multidisciplinary group where the condition spans specialties.

S

FR-REC-007

Where no confident match exists, return “no confident recommendation” and route to a
designated senior clinician rather than returning a low-confidence guess.

M

FR-REC-008

Support the defined pediatric specialties — Cardiology, Neurology, Nephrology, Urology,
Gastroenterology, Endocrinology, Pulmonology, Pediatric Surgery, Neonatology and PICU —
and allow further specialties to be added by configuration without a code change.

M

FR-REC-009

Make recommendation logic (rules, weights, thresholds) configurable by authorised clinical
governance users, with versioning and effective dates.

M

FR-REC-010

Maintain and report a referral accuracy metric — recommendation accepted and not rerouted within 48 hours — by specialty and by model version.

M

BA note: FR-REC-003 and FR-REC-004 together constitute the platform's primary clinical risk control. They are also the
basis of any argument that the platform is decision support rather than a regulated medical device. They must not be
relaxed for convenience during build.

8.4 Referral & Consultation Management
ID

Requirement

Pri

FR-REF-001

Create a referral to the confirmed specialist with the full clinical context attached.

M

FR-REF-002

Notify the receiving specialist in real time, in-app and via a configurable channel, with
urgency-based priority.

M

FR-REF-003

Allow the specialist to accept, or to decline with a mandatory reason that triggers rerecommendation.

M

FR-REF-004

Track the referral against the SLA for its urgency grade; a breach raises an escalation.

M

FR-REF-005

Schedule the consultation (slot, location, modality) and notify the guardian.

M

Confidential — Internal Use Only

Page 10 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

ID

Requirement

Pri

FR-REF-006

Support virtual consultation with secure video, in-session note capture, and recording only
where explicitly consented.

S — Ph2

FR-REF-007

Record the consultation outcome and next action — investigate, admit, treat, refer onward
or discharge.

M

FR-REF-008

Maintain the full referral chain when a child moves between specialists, preserving the
reason at each hop.

M

8.5 Multidisciplinary Collaboration
ID

Requirement

Pri

FR-MDT-001

Convene a multidisciplinary discussion on a case, inviting named specialists.

S — Ph2

FR-MDT-002

Present the complete history, prior data and investigations to all participants in a shared case
view.

S — Ph2

FR-MDT-003

Record the decision, the participating clinicians, the evidence considered and the rationale.

S — Ph2

FR-MDT-004

Record that the guardian was informed of the outcome and capture their acknowledgement.

S — Ph2

FR-MDT-005

Link the multidisciplinary decision to the resulting treatment plan.

S — Ph2

8.6 Diagnosis, Treatment Plan & Recovery
ID

Requirement

Pri

FR-TRT-001

Record confirmed diagnosis using a standard coding system (ICD-10 / ICD-11), supporting
multiple and provisional diagnoses.

M

FR-TRT-002

Create a personalised treatment plan with objectives, interventions, medications, milestones
and expected review dates.

M

FR-TRT-003

Link the treatment plan to an applicable evidence-based protocol from the protocol library
where one exists.

M

FR-TRT-004

Flag deviations from the linked protocol and require a documented reason.

S

FR-TRT-005

Generate a parent-readable version of the care plan in plain language.

S — Ph2

FR-TRT-006

Track progress against plan milestones and record recovery status.

M

FR-TRT-007

Record complications with type, severity, detection date and action taken.

M

FR-TRT-008

Support amendment of the treatment plan with full version history retained.

M

8.7 Master Health Record
ID

Requirement

Pri

FR-MHR-001

Maintain one longitudinal record per child spanning all cases, episodes and departments.

M

FR-MHR-002

Store and render clinical notes, lab results, ultrasound, CT, MRI, X-ray, photographs, surgery
images, videos, consent forms, prescriptions and discharge summaries.

M

Confidential — Internal Use Only

Page 11 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

ID

Requirement

Pri

FR-MHR-003

Provide four views of the record: Overview, Timeline (chronological), Documents (by type)
and Reports.

M

FR-MHR-004

Display a persistent record header showing Patient ID, age, blood group, allergies and active
clinical alerts on every screen.

M

FR-MHR-005

Ingest imaging from RIS/PACS via DICOM and laboratory results via HL7/FHIR rather than
relying on manual upload.

M

FR-MHR-006

Support in-browser preview of images and documents without requiring download.

M

FR-MHR-007

Enforce record immutability — corrections are made as new versions with an addendum
reason; nothing is silently overwritten or hard-deleted.

M

FR-MHR-008

Log every access to a child record (user, time, artefact, source) and make the access log
reportable.

M

FR-MHR-009

Export the complete record as a portable, standards-compliant bundle on authorised
request.

S

FR-MHR-010

Enforce media-capture consent before any photograph or video can be attached to a record.

M

8.8 Follow-up, Monitoring & Case Closure
ID

Requirement

Pri

FR-FUP-001

Auto-generate follow-up schedules from the treatment plan and the applicable protocol.

M

FR-FUP-002

Maintain a work queue of pending follow-ups showing owner, due date and ageing.

M

FR-FUP-003

Send reminders to guardians ahead of each follow-up through configurable channels.

M

FR-FUP-004

Escalate an overdue follow-up automatically once a configurable threshold is passed.

M

FR-FUP-005

Record the follow-up outcome and update recovery status accordingly.

M

FR-FUP-006

Require explicit specialist sign-off to close a case, confirming clinical resolution.

M

FR-FUP-007

Prevent closure while mandatory checkpoints remain incomplete, unless closed under an
authorised and documented exception.

M

FR-FUP-008

Support case re-opening on relapse, linked to the original case.

M

8.9 Clinical Intelligence & Escalation Engine
The engine continuously evaluates five checkpoints for every open case:
7. Has the child seen the correct specialist?
8. Has treatment started?
9. Is follow-up completed?
10.

Are there any complications?

11.

Is the case resolved?

Confidential — Internal Use Only

Page 12 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

ID

Requirement

Pri

FR-CIE-001

Evaluate all five checkpoints for every open case on a continuous or scheduled basis.

M

FR-CIE-002

Classify each case as On Track, At Risk or Needs Attention according to configurable rules.

M

FR-CIE-003

Compute a Clinical Intelligence Score representing the proportion of checkpoints actively
satisfied across the active case population.

M

FR-CIE-004

Maintain escalation queues for At Risk Cases, Overdue Follow-ups, Complications Detected
and Ready for Closure.

M

FR-CIE-005

Route each escalation to a named owner with an SLA; unacknowledged escalations escalate
one level up.

M

FR-CIE-006

Record acknowledgement and the action taken against every escalation, closing the loop.

M

FR-CIE-007

Allow clinical governance to configure checkpoint rules, thresholds and SLAs without a code
release.

M

FR-CIE-008

Apply early-complication detection patterns derived from historical outcome data.

C — Ph3

BA note: alert fatigue is the primary failure mode for engines of this kind. Alert-to-action rate should be tracked as a
product KPI from day one of the pilot, and thresholds tuned before wider rollout.

8.10 Parent & Guardian Experience
ID

Requirement

Pri

FR-PAR-001

Show the guardian which specialist is treating their child and why that specialist was
selected.

S — Ph2

FR-PAR-002

Display the specialist's relevant experience and outcome data for the child's condition, in a
curated, accurate and non-misleading form approved by clinical governance.

S — Ph2

FR-PAR-003

Show the current care journey stage and what happens next.

S — Ph2

FR-PAR-004

Provide a plain-language care plan and appointment schedule.

S — Ph2

FR-PAR-005

Provide a one-click second-opinion request that is logged, routed, and never blocked or
discouraged by the system.

S — Ph2

FR-PAR-006

Allow secure viewing of reports and discharge summaries once released by the clinician.

S — Ph2

FR-PAR-007

Capture digital consent from the guardian remotely.

S — Ph2

FR-PAR-008

Scope guardian access strictly to their own linked children, with access revocable at any time.

M

FR-PAR-009

Support multilingual content — English plus regional languages.

C

BA note: FR-PAR-002 requires careful handling. Publishing individual clinician outcome statistics to families creates a de
facto league table, with case-mix bias, legal, HR and defensive-practice consequences. Clinical governance and Legal
must jointly define which metrics are shown, at what aggregation, and with what risk adjustment. Tracked as OQ-05.

Confidential — Internal Use Only

Page 13 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

8.11 Executive Command Center
ID

Requirement

Pri

FR-EXE-001

Present live KPI tiles for Children Registered, Waiting Patients, Emergency Cases, Specialists
Assigned, Average Referral Time, Pending Follow-ups, Recovered, Complications and
Readmissions, each with period-over-period variance.

M

FR-EXE-002

Show department performance including patients today, average referral time, backlog,
status indicator and trend.

M

FR-EXE-003

Show a live hospital heat map by area (OPD, Emergency, PICU, NICU, Wards, Imaging) with
occupancy or waiting counts banded Low / Moderate / High / Critical.

M

FR-EXE-004

Present an Executive Alerts feed, newest first, with acknowledgement capture.

M

FR-EXE-005

Present system-generated leadership recommendations as advisory suggestions requiring
human action; these are never auto-executed.

M

FR-EXE-006

Provide trend visualisations for referral time, patient volume mix and outcomes.

M

FR-EXE-007

Provide a leadership summary showing total active cases, critical cases, average length of
stay, bed occupancy and staff on duty.

M

FR-EXE-008

Support facility filtering, including a consolidated all-facilities view.

S — Ph2

FR-EXE-009

Provide navigation to Patients, Departments, Referrals, Cases, Follow-ups, Quality & Safety,
Reports, Analytics, Alerts Center and Settings.

M

FR-EXE-010

Support drill-down from any KPI tile to the underlying case list.

M

FR-EXE-011

Support scheduled and ad-hoc report export to PDF and Excel, with the data-as-of timestamp
printed on the output.

M

FR-EXE-012

Refresh dashboards at a configurable interval and display the last-refreshed time explicitly.

M

8.12 Knowledge Repository & Learning Loop
ID

Requirement

Pri

FR-KNW-001

Publish closed cases to the repository in de-identified form, only where consent permits.

M — Ph2

FR-KNW-002

Provide keyword search across diagnosis, symptoms, procedures and clinical notes.

M — Ph2

FR-KNW-003

Provide filters for age, gender, department, disease, procedure, outcome, date and location.

M — Ph2

FR-KNW-004

Support image-based search and browsing across X-ray, MRI, CT, ultrasound, clinical
photographs and surgery images.

S — Ph2

FR-KNW-005

Provide curated collections — Top Diseases, Top Procedures, Complications, Imaging Library,
Rare Cases and Best Outcomes.

S — Ph2

FR-KNW-006

Show repository metrics: total cases, diseases covered, procedures, images and media, and
successful-outcome rate.

S — Ph2

FR-KNW-007

Provide a case-detail view showing presentation, pathway, interventions and outcome, with
all identifiers removed.

M — Ph2

FR-KNW-008

Feed closed-case outcomes back into recommendation weighting, with each model version
tracked and its impact on referral accuracy measured before promotion.

S — Ph2

Confidential — Internal Use Only

Page 14 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

ID

Requirement

Pri

FR-KNW-009

Track and report learning metrics: cases learned, insights added, protocols improved, referral
accuracy improvement and outcome improvement.

S — Ph2

FR-KNW-010

Enforce a governance workflow — de-identification validation and clinical review — before
any case is published.

M — Ph2

FR-KNW-011

Provide a controlled academic and teaching access role, separate from clinical access.

C — Ph3

BA note: De-identification must include detection and redaction of identifiers burned into image pixels on DICOM
studies and clinical photographs. Header scrubbing alone is insufficient and is a well-documented leak path. This is called
out as a distinct build task, not an assumption.

8.13 Administration, Security & Audit
ID

Requirement

Pri

FR-ADM-001

Enforce role-based access control on least-privilege principles across all roles: pediatrician,
specialist, nurse, coordinator, leadership, quality, administrator, guardian and academic.

M

FR-ADM-002

Maintain master data for specialties, departments, specialist profiles and credentials,
facilities, protocols, symptom taxonomy and consent templates.

M

FR-ADM-003

Maintain specialist profiles including sub-specialty, conditions treated, credentials,
availability and outcome history.

M

FR-ADM-004

Provide a break-glass emergency access mechanism granting time-boxed access, alerting
immediately and requiring post-hoc review.

M

FR-ADM-005

Maintain a tamper-evident audit trail of every create, read, update, delete, consent event,
override and escalation, capturing user, timestamp, source and before/after values.

M

FR-ADM-006

Enforce configurable data retention aligned to pediatric record regulation, typically retention
until the child attains majority plus a statutory period.

M

FR-ADM-007

Support single sign-on with the hospital identity provider and enforce multi-factor
authentication for privileged roles.

M

FR-ADM-008

Provide a configuration console for rules, SLAs, thresholds and notification templates that
requires no code deployment.

M

9. Data Requirements
9.1 Core Business Entities
Child · Guardian · Consent · Case · Encounter · Assessment · SymptomRecord · Vitals · Recommendation · Referral ·
Consultation · Diagnosis · TreatmentPlan · Intervention · Complication · FollowUp · Document · MediaAsset ·
Specialist · Specialty · Department · Facility · Protocol · Checkpoint · Alert · Escalation · KnowledgeCase ·
AuditEvent

Confidential — Internal Use Only

Page 15 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

9.2 Data Standards
Domain

Standard

Clinical interoperability

HL7 FHIR R4

Diagnosis coding

ICD-10 / ICD-11

Procedures and clinical terms

SNOMED CT (preferred)

Laboratory results

LOINC

Imaging

DICOM

Medications

Hospital formulary with RxNorm mapping

9.3 Data Quality Rules
• Mandatory fields are enforced at each stage gate; a stage cannot be exited with incomplete mandatory data.
• Duplicate patient creation is prevented at registration through fuzzy matching (FR-REG-003).
• Referential integrity is maintained between case, referral, diagnosis and treatment plan.
• No hard deletion of clinical data — logical deletion with audit trail only.
• All timestamps are stored in UTC and displayed in facility local time.

9.4 De-identification Rules for the Repository
• All direct identifiers are removed from published cases.
• Dates are shifted or generalised to prevent timeline-based re-identification.
• Rare-condition cases are individually screened for re-identification risk before publication.
• Identifiers burned into image pixels on DICOM studies and clinical photographs must be detected and
redacted.
• Publication is gated on both valid consent and clinical governance review.

10. Non-Functional Requirements
ID

Category

Requirement

NFR-01

Availability

99.9% uptime. Critical paths — registration, assessment, referral and record view —
must degrade gracefully rather than fail outright.

NFR-02

Performance

Page load under 2 seconds; recommendation generated within 3 seconds;
dashboard refresh within 5 seconds at peak load.

NFR-03

Scalability

Support the target concurrent clinical user count per facility with horizontal scaleout across the full facility network.

NFR-04

Security

Encryption in transit (TLS 1.3) and at rest (AES-256); secrets held in a managed
vault; annual penetration testing with tracked remediation.

NFR-05

Privacy

Compliance with the Digital Personal Data Protection Act 2023, including its
heightened obligations for processing children's personal data, plus HIPAA and
GDPR alignment where the network operates internationally.

Confidential — Internal Use Only

Page 16 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

ID

Category

Requirement

NFR-06

Auditability

Immutable, exportable audit log retained for the full regulatory retention period.

NFR-07

Usability

Clinical tasks completable in minimal clicks; the assessment-to-referral flow must be
completable on a tablet at the bedside.

NFR-08

Accessibility

WCAG 2.1 Level AA for all parent-facing interfaces.

NFR-09

Browser & device

Current Chrome, Edge, Safari and Firefox; responsive tablet layouts; native or
progressive web app for the parent experience.

NFR-10

Localisation

English at launch, with an architecture that supports regional languages without
rework.

NFR-11

Interoperability

FHIR-based APIs for HIS, LIS, RIS-PACS, ADT and identity integration.

NFR-12

Backup & DR

Recovery point objective of 15 minutes or less; recovery time objective of 4 hours
or less; disaster recovery drills twice yearly.

NFR-13

Traceability

Every requirement traceable to a test case; every clinical decision traceable to a
named user.

NFR-14

Monitoring

Application, infrastructure and clinical-SLA monitoring with proactive alerting.

NFR-15

Model governance

Any change to recommendation logic requires versioning, offline evaluation, clinical
sign-off, post-deployment accuracy monitoring and a tested rollback path.

11. Integration Requirements
ID

System

Direction

Purpose

INT-01

HIS / EMR

Bi-directional

Patient demographics, MRN, ADT events,
encounters

INT-02

Laboratory Information System

Inbound

Laboratory orders and results

INT-03

RIS / PACS

Inbound

Imaging studies and radiology reports via DICOM

INT-04

Identity Provider

Inbound

Single sign-on, MFA, role provisioning

INT-05

Notification gateway

Outbound

SMS, email, messaging and push to guardians and
clinicians

INT-06

Video platform

Bi-directional

Teleconsultation (Phase 2)

INT-07

Staff roster system

Inbound

Specialist availability and duty status

INT-08

Bed management system

Inbound

Occupancy data for the hospital heat map

INT-09

National health ID (ABDM)

Bi-directional

ABHA linkage and consented record exchange

INT-10

Data warehouse / BI

Outbound

Analytics and regulatory reporting

Confidential — Internal Use Only

Page 17 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

12. Regulatory & Compliance Requirements
ID

Requirement

REG-01

Comply with the Digital Personal Data Protection Act 2023, including verifiable parental consent for processing
a child's personal data and the prohibition on behavioural tracking or monitoring of children.

REG-02

Comply with NABH standards for clinical documentation, consent and quality indicator reporting.

REG-03

Comply with applicable telemedicine practice guidelines for any virtual consultation.

REG-04

Retain records in accordance with statutory medical-record retention rules applicable to minors.

REG-05

Assess any clinical decision-support capability against applicable Software as a Medical Device classification.
The design of “recommendation plus mandatory human confirmation” is the intended risk control and must be
validated as such.

REG-06

Maintain a documented validation package (URS, FS, DS, IQ/OQ/PQ and traceability matrix) should the
platform be deemed to require formal computer system validation.

REG-07

Maintain a data-processing register, a Data Protection Impact Assessment and a documented breachnotification procedure.

13. Assumptions, Constraints & Dependencies
13.1 Assumptions
ID

Assumption

A1

The hospital operates an existing HIS with an accessible patient master and an API or HL7 interface.

A2

Imaging is already digitised in a PACS accessible via DICOM.

A3

Historical case and outcome data of sufficient volume and quality exists to seed the recommendation engine.
Where it does not, Phase 1 operates on clinical rules alone.

A4

Specialists will maintain accurate availability data, directly or through roster integration.

A5

Clinicians have tablet or desktop access at the point of care with reliable network connectivity.

A6

A clinical governance body will be constituted before build to own rules, protocols and model sign-off.

A7

Phase 1 is a single-facility pilot; multi-facility rollout follows a successful pilot.

13.2 Constraints
ID

Constraint

C1

The platform must not disrupt existing clinical workflows during rollout; parallel running is required throughout
the pilot period.

C2

The platform cannot replace the HIS as the system of record for billing and administrative data.

C3

Recommendation quality is bounded by the completeness and quality of historical outcome data.

C4

Any parent-facing display of clinician performance data is subject to legal and HR clearance.

C5

Downtime windows are severely limited in a 24×7 clinical environment.

Confidential — Internal Use Only

Page 18 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

13.3 Dependencies
ID

Dependency

Owner

D1

Integration access and credentials for HIS, LIS and PACS

Hospital IT

D2

Clinical rules, protocol library and specialty taxonomy

Clinical Governance

D3

Historical case dataset, cleansed and mapped

Clinical + Data team

D4

Legal and DPO sign-off on the consent model and repository publication

Legal / DPO

D5

Baseline KPI measurement prior to build

Quality team

D6

Specialist master data and credentialing records

Medical Administration /
HR

14. Risk Register
ID

Risk

Impact

Likelihood

Mitigation

R1

Clinicians distrust or ignore
recommendations

High

Medium

Explainable rationale on every recommendation;
clinician co-design; frictionless override; accuracy
metrics published openly

R2

Recommendation logic trained on
biased or incomplete history
entrenches existing referral
patterns

High

Medium

Fairness and case-mix review; rules-first in Phase
1; accuracy monitored by specialty; clinical signoff gate on every version

R3

Re-identification from repository
cases, particularly rare conditions
and imaging

High

Medium

Governance review before publication; burned-in
identifier redaction; rare-case risk screening;
consent gating

R4

Documentation burden slows
clinicians and adoption stalls

High

High

Time-and-motion study during pilot; templates
and voice input; hard cap on mandatory fields per
stage

R5

Integration delays with legacy HIS
and PACS

High

Medium

Early integration spike; contracted vendor
support; manual-upload fallback for the pilot

R6

Alert fatigue from the escalation
engine

Medium

High

Threshold tuning during pilot; role-scoped
queues; alert-to-action rate tracked as a product
KPI

R7

Parent-facing outcome data
misread as a clinician league table

High

Medium

Clinical governance defines the displayed metrics;
risk-adjusted, non-comparative presentation; legal
sign-off

R8

Scope creep from the vision deck
into Phase 1

Medium

High

Phased scope baselined in this document; formal
change control on all additions

R9

Data privacy non-compliance for
children's data

High

Low

DPIA completed before build; DPO in the approval
chain; verifiable guardian consent

Confidential — Internal Use Only

Page 19 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

15. Phased Delivery Plan
Phase

Focus

Indicative Duration

Phase 0 — Discovery

Baseline KPI measurement, process mapping, integration assessment,
data quality assessment, DPIA, constitution of clinical governance

4 – 6 weeks

Phase 1 — MVP Pilot

End-to-end child journey from registration to closure; Master Health
Record; Clinical Intelligence engine; single-facility Command Center

16 – 20 weeks

Phase 2 — Extend

Parent portal, teleconsultation, multidisciplinary workspace, second
opinion, multi-facility view, knowledge repository, learning loop

12 – 16 weeks

Phase 3 — Intelligence

Advanced models, early complication detection, predictive capacity
analytics, medical education module

12+ weeks

Durations are indicative and subject to confirmation against a detailed delivery estimate following discovery.

16. Business Acceptance Criteria — Phase 1
Phase 1 is accepted when all of the following are demonstrably true in the pilot department, on real clinical cases.
12.

A child can be taken end to end from registration through case closure entirely within the platform.

13. Every referral carries either a system recommendation accepted by a clinician or a documented override
reason — 100% coverage, no exceptions.
14.

Average referral time is measured and demonstrably tracking toward the 30-minute target.

15.

No case is closed with incomplete mandatory checkpoints without a documented, authorised exception.

16.

The Master Health Record shows a complete, correctly ordered artefact set for at least 95% of pilot cases.

17. The Command Center reflects live pilot-department data, and every executive alert raised has a recorded
acknowledgement and action.
18.

The audit trail can reconstruct the full decision history of any pilot case on demand for the quality team.

19.

Security testing is passed with all high and critical findings remediated.

20. The Data Protection Officer and clinical governance have signed off on the consent model and the
recommendation ruleset.

17. Open Questions
The following must be resolved before the requirements baseline can be finalised. OQ-01 and OQ-03 have the
greatest influence on the shape of the build.

ID

Question

Owner

Needed By

OQ-01

What are the current baseline values for referral time,
complication rate, readmission rate and missed follow-ups?
Several KPIs are unverifiable without them.

Quality team

Phase 0

OQ-02

Is Phase 1 a single facility or the full network from day one?

Sponsor

Before scope
baseline

Confidential — Internal Use Only

Page 20 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

ID

Question

Owner

Needed By

OQ-03

What historical case volume and outcome data actually exists, and
in what condition? This determines whether the recommendation
engine launches rules-based or data-driven.

Data + Clinical

Phase 0

OQ-04

Which HIS, LIS and PACS products are in place, and what
integration interfaces do they expose?

Hospital IT

Phase 0

OQ-05

Exactly which specialist experience and outcome metrics may be
shown to parents, at what aggregation and with what risk
adjustment?

Clinical Governance +
Legal

Before Phase 2
design

OQ-06

Does the second-opinion workflow route within the network only,
or also externally?

Sponsor

Phase 2

OQ-07

Who constitutes the clinical governance body that owns rules,
protocols and model sign-off?

Sponsor

Phase 0

OQ-08

What is the required data retention period for pediatric records in
the operating jurisdictions?

Legal / DPO

Phase 0

OQ-09

Is the platform expected to be classified as Software as a Medical
Device, and does formal validation apply?

Regulatory

Phase 0

OQ-10

Will repository cases be shared beyond the network for research,
academia or publication? Consent language depends on the
answer.

Sponsor + Legal

Phase 2

OQ-11

What is the budget envelope and the target go-live date?

Sponsor

Before planning

OQ-12

Is teleconsultation in scope for the pilot, or strictly Phase 2?

Sponsor

Before scope
baseline

Appendix A — Requirements Traceability Matrix
Every business objective maps to the requirement groups that deliver it. Each requirement will in turn be traced
to test cases during the test design phase.

Business Objective

Supporting Requirements

BO1 — Reduce time to right specialist

FR-ASM-005; FR-REC-001 to FR-REC-010; FR-REF-001 to FR-REF-004

BO2 — Improve referral accuracy

FR-REC-002; FR-REC-005; FR-REC-010; FR-KNW-008

BO3 — Improve clinical outcomes

FR-TRT-001 to FR-TRT-008; FR-CIE-001 to FR-CIE-007; FR-MDT-001 to FRMDT-005

BO4 — Eliminate missed follow-ups

FR-FUP-001 to FR-FUP-008; FR-CIE-004 to FR-CIE-006

BO5 — Reduce readmissions

FR-FUP-005; FR-TRT-006; FR-EXE-001

BO6 — Single source of truth per child

FR-MHR-001 to FR-MHR-010; INT-01 to INT-03

BO7 — Leadership responsiveness

FR-EXE-001 to FR-EXE-012; FR-CIE-005

BO8 — Build institutional knowledge

FR-KNW-001 to FR-KNW-011

BO9 — Increase parent confidence

FR-PAR-001 to FR-PAR-009; FR-REG-004

Confidential — Internal Use Only

Page 21 of 22

Business Requirements Document

Pediatric Care Network Platform | v0.1 Draft

Appendix B — Glossary
Term

Definition

ABDM / ABHA

India's national digital health mission and its associated health account identifier

Case

A clinical episode for one child, from presentation through to closure

Checkpoint

One of the five clinical questions evaluated continuously for every open case

Clinical Intelligence Score

The proportion of checkpoints actively satisfied across the active case population

DICOM

Digital Imaging and Communications in Medicine — the standard for medical imaging

DPIA

Data Protection Impact Assessment

FHIR

Fast Healthcare Interoperability Resources — the HL7 interoperability standard

Master Health Record

The longitudinal consolidated clinical record for one child

MDT

Multidisciplinary Team

NABH

National Accreditation Board for Hospitals and Healthcare Providers

Referral accuracy

The percentage of recommendations accepted and not re-routed within 48 hours

SaMD

Software as a Medical Device

SLA

Service Level Agreement — the time within which a stage or escalation must be actioned

— End of Document —

Confidential — Internal Use Only

Page 22 of 22

