# Pediatric Care Network - Agent Architecture

Based on the Business Requirements Document (BRD v0.1 Draft), the Pediatric Care Network relies heavily on intelligent, automated agents to support clinical decision-making, patient tracking, and administrative efficiency. 

The platform utilizes a **"Human in the loop"** principle (GP1): Agents recommend and monitor, but clinicians confirm and decide.

Here are the primary AI/System Agents required to fulfill the BRD:

## 1. Intelligent Specialist Matching Agent
**Module:** 8.3 Intelligent Specialist Recommendation Engine
**Phase:** Phase 1
**Role:** To ensure every child is routed to the most appropriate pediatric specialist at the earliest possible point.

*   **Inputs:** Presenting condition, urgency grade, specialist availability, required sub-specialty, specialist outcome history, current case load.
*   **Outputs:** A ranked list of recommended specialists with an explainable rationale for each.
*   **Key Rules:** 
    *   Never auto-assigns; requires explicit clinician confirmation (FR-REC-003).
    *   If no confident match is found, routes to a designated senior clinician rather than guessing (FR-REC-007).
    *   Continuously learns and updates weighting based on closed-case outcomes (FR-KNW-008).

## 2. Clinical Intelligence & Escalation Agent
**Module:** 8.9 Clinical Intelligence & Escalation Engine
**Phase:** Phase 1
**Role:** To prevent cases from stalling and to reduce complications by continuously evaluating every open case.

*   **Continuous Checkpoints:**
    1.  Has the child seen the correct specialist?
    2.  Has treatment started?
    3.  Is follow-up completed?
    4.  Are there any complications?
    5.  Is the case resolved?
*   **Outputs:** Case classification (On Track, At Risk, Needs Attention), generation of Executive Alerts, and routing of escalations to named owners with SLAs (FR-CIE-005).
*   **Future Capability:** Early complication detection patterns derived from historical outcome data (Phase 3).

## 3. Care Coordination & Follow-up Agent
**Module:** 8.8 Follow-up, Monitoring & Case Closure
**Phase:** Phase 1
**Role:** To automate the scheduling and tracking of patient recovery after a consultation or treatment plan is established.

*   **Capabilities:**
    *   Auto-generates follow-up schedules from the treatment plan and applicable protocols (FR-FUP-001).
    *   Sends automated reminders to guardians ahead of follow-ups (FR-FUP-003).
    *   Automatically escalates overdue follow-ups once SLAs are breached.

## 4. De-identification & Knowledge Agent
**Module:** 8.12 Knowledge Repository & Learning Loop | 9.4 De-identification Rules
**Phase:** Phase 2
**Role:** To safely convert closed cases into a searchable knowledge repository for medical education and model training.

*   **Capabilities:**
    *   Removes all direct identifiers from published cases.
    *   Detects and redacts identifiers burned into image pixels on DICOM studies and clinical photographs (crucial for privacy compliance).
    *   Generalizes or shifts dates to prevent timeline-based re-identification.
    *   Screens rare-condition cases for re-identification risks.

## 5. Executive Advisory Agent
**Module:** 8.11 Executive Command Center
**Phase:** Phase 1
**Role:** To provide actionable insights to hospital leadership based on real-time operational data.

*   **Capabilities:**
    *   Presents system-generated leadership recommendations as advisory suggestions (e.g., rebalancing load, addressing bottlenecks) requiring human action (FR-EXE-005).
    *   Computes the "Clinical Intelligence Score" across the active case population.
