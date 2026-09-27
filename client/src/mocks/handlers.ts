import { http, HttpResponse } from "msw";

let intakeCount = 0;

export const handlers = [
  http.post("/api/intake", async ({ request }) => {
    const body = (await request.json()) as any;
    intakeCount++;
    return HttpResponse.json(
      {
        caseId: `CASE-2026-${100 + intakeCount}`,
        patientId: body?.fullName ? `PT-${Date.now().toString().slice(-4)}` : "PT-0000",
        message: "Intake registered — specialist matching queued",
      },
      { status: 201 }
    );
  }),

  http.get("/api/patients", () => {
    return HttpResponse.json([
      { id: "PT-2001", fullName: "Aarav Sharma" },
      { id: "PT-2002", fullName: "Ananya Sharma" },
    ]);
  }),

  http.get("/api/health", () => {
    return HttpResponse.json({ status: "ok", version: "1.0.0-solaris", time: new Date().toISOString() });
  }),

  http.post("/api/chat", async ({ request }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      id: `MSG-${Date.now()}`,
      text: body.text,
      timestamp: new Date().toISOString(),
      reply: "Thanks for reaching out — care team will review shortly.",
    });
  }),
];
