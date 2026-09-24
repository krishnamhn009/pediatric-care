import { describe, it, expect, beforeEach } from "vitest";
import {
  secureGet,
  secureSet,
  clearAllSecure,
  patientSchema,
} from "./secureStore";

describe("secureStore", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips encrypted data", () => {
    secureSet("test", { a: 1 });
    expect(secureGet("test", null as any)).toEqual({ a: 1 });
  });

  it("validates with zod schema and falls back on bad data", () => {
    localStorage.setItem(
      "pcn_v1_patients",
      btoa(JSON.stringify({ bad: true } as any))
    );
    const fallback: any[] = [];
    expect(secureGet("patients", fallback, patientSchema)).toEqual(fallback);
  });

  it("migrates old pcn_ keys", () => {
    localStorage.setItem(
      "pcn_patients",
      JSON.stringify([
        {
          id: "x",
          fullName: "y",
          dob: "2020-01-01",
          ageYears: 1,
          ageMonths: 0,
          gender: "Male",
          bloodGroup: "O+",
          allergies: [],
          guardianName: "g",
          guardianRelation: "Father",
          guardianPhone: "1",
          insuranceId: "1",
          consentSigned: true,
          assignedWard: "OPD",
        },
      ])
    );
    expect(secureGet("patients", [], patientSchema).length).toBe(1);
  });

  it("clearAllSecure removes PHI", () => {
    secureSet("patients", [{ a: 1 }]);
    secureSet("alerts", [{ a: 1 }]);
    clearAllSecure();
    expect(localStorage.getItem("pcn_v1_patients")).toBeNull();
  });
});
