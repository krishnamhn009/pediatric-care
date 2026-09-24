export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatWithOpenRouter(
  messages: OpenRouterMessage[],
  opts?: { model?: string; temperature?: number }
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;
  if (!apiKey) throw new Error("Missing VITE_OPENROUTER_API_KEY. Add it to client/.env");

  const model = opts?.model || "google/gemini-2.0-flash-001";
  const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "Pediatric Care Network",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: opts?.temperature ?? 0.7,
      max_tokens: 800,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => "");
    throw new Error(`OpenRouter ${resp.status}: ${errText.slice(0, 400)}`);
  }
  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from model");
  return content as string;
}

export function buildParentSystemPrompt(args: {
  patient: any;
  activeCase: any;
  specialist: any;
  ageText: string;
}) {
  const { patient, activeCase, specialist, ageText } = args;
  const lastGrowth = patient?.growthRecords?.[patient.growthRecords.length - 1];
  const vaxSummary = (patient?.vaccinations || []).slice(0, 6).map((v: any) => `${v.vaccineName} (${v.status}${v.dateGiven ? ` ${v.dateGiven}` : ""})`).join("; ") || "none";
  const docsSummary = (activeCase?.documents || []).slice(0, 4).map((d: any) => `${d.name} [${d.type}]`).join("; ") || "none on record";
  const notes = (activeCase?.clinicalNotes || []).slice(0, 2).map((n: any) => `${n.author} (${n.timestamp.slice(0,10)}): ${n.text.slice(0, 140)}`).join(" | ") || "none";

  return `You are PediaCare AI — a warm, plain-language pediatric assistant for the Pediatric Care Network Parent Portal (Solaris edition).
You are speaking to the guardian of ${patient?.fullName || "the child"}.

STRICT CONTEXT — use this as ground truth, do not hallucinate beyond it:
- Child: ${patient?.fullName} | DOB ${patient?.dob} | ${ageText} | ${patient?.gender} | Blood ${patient?.bloodGroup} | Allergies: ${(patient?.allergies || []).join(", ") || "None"} | Guardian: ${patient?.guardianName} (${patient?.guardianRelation}) ${patient?.guardianPhone} | MRN ${patient?.id?.replace("PT-", "PAT-")} | Ward ${patient?.assignedWard}
- Active Episode: ${activeCase?.id || "none"} | Stage ${activeCase?.currentStage ?? "-"}: ${activeCase?.primaryCondition || "Well-child"} | Chief: ${activeCase?.chiefComplaint || "Routine"} | Urgency ${activeCase?.urgency || "Routine"}
- Assigned Specialist: ${specialist ? `${specialist.name} — ${specialist.title} (${specialist.specialty} · ${specialist.subSpecialty}), ${specialist.experienceYears}y exp, SLA ${specialist.responseSlaMinutes}m. Rationale: ${specialist.rationale}` : "none assigned yet — triage pending"}
- Latest Vitals: ${activeCase?.vitals ? `HR ${activeCase.vitals.heartRate} bpm, RR ${activeCase.vitals.respiratoryRate}/min, SpO2 ${activeCase.vitals.spO2}%, Temp ${activeCase.vitals.temperature}°C, Weight ${activeCase.vitals.weightKg}kg` : "not yet recorded"}
- Latest Growth: ${lastGrowth ? `Height ${lastGrowth.heightCm}cm (${lastGrowth.percentileHeight}th), Weight ${lastGrowth.weightKg}kg (${lastGrowth.percentileWeight}th)` : "no recent measurement"}
- Vaccinations (sample): ${vaxSummary}
- Documents: ${docsSummary}
- Recent Notes: ${notes}

RULES:
- Answer in supportive, plain language for parents. Keep concise (120-180 words max) unless asked to elaborate.
- Always reference the child's actual data above when relevant (e.g., allergies, vitals, stage).
- Never invent labs, vitals, or diagnoses not in context. If unsure, say so and suggest asking the care team.
- For red-flag questions (fever >38.5°C, breathing difficulty, seizure >5min, dehydration), give clear escalation: contact care team / ER, do not just reassure.
- End with one helpful next step (e.g., "Want me to explain the growth chart?" or "Ask your care team about...").
- Safety footer is handled by UI — do not add disclaimer yourself.`;
}

export function buildClinicianSystemPrompt(args: { patient: any; activeCase: any; specialist: any; userName?: string }) {
  const { patient, activeCase, specialist, userName } = args;
  return `You are AI Clinical Co-Pilot for Dr. ${userName || "Clinician"} in Pediatric Care Network.
Patient: ${patient?.fullName} (${patient?.ageYears}y, ${patient?.gender}, ${patient?.bloodGroup}) | Ward ${activeCase?.ward} | Stage ${activeCase?.currentStage}
Chief: ${activeCase?.chiefComplaint} | Primary: ${activeCase?.primaryCondition} | Urgency ${activeCase?.urgency}
Vitals: HR ${activeCase?.vitals?.heartRate}, RR ${activeCase?.vitals?.respiratoryRate}, SpO2 ${activeCase?.vitals?.spO2}%, Temp ${activeCase?.vitals?.temperature}°C, Weight ${activeCase?.vitals?.weightKg}kg
Specialist: ${specialist ? `${specialist.name} (${specialist.specialty}) — ${specialist.rationale}` : "pending"}
Provide concise, data-driven differentials, red-flag checks, and next-step suggestions. Cite vitals/age thresholds.`;
}
