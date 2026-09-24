import { describe, it, expect } from "vitest";
import { getPediatricVitalsRange, evaluateVitals } from "./vitalsThresholds";

describe("getPediatricVitalsRange", () => {
  it("returns infant range for 0-1 yr", () => {
    expect(getPediatricVitalsRange(0).hrMax).toBe(160);
    expect(getPediatricVitalsRange(1).hrMin).toBe(100);
  });
  it("returns toddler range for 2 yrs", () => {
    expect(getPediatricVitalsRange(2).ageGroup).toBe("Toddler (1-3 yrs)");
  });
});

describe("evaluateVitals", () => {
  it("flags critical tachycardia", () => {
    const flags = evaluateVitals(2, {
      heartRate: 170,
      respiratoryRate: 30,
      systolicBp: 100,
      spO2: 98,
      temperature: 37,
    });
    expect(flags.find(f => f.param === "Heart Rate")?.status).toBe("Critical");
  });
  it("flags normal vitals", () => {
    const flags = evaluateVitals(5, {
      heartRate: 90,
      respiratoryRate: 22,
      systolicBp: 100,
      spO2: 98,
      temperature: 37,
    });
    expect(flags.every(f => f.status === "Normal")).toBe(true);
  });
  it("flags hypoxemia", () => {
    const flags = evaluateVitals(5, {
      heartRate: 90,
      respiratoryRate: 22,
      systolicBp: 100,
      spO2: 90,
      temperature: 37,
    });
    expect(flags.find(f => f.param === "SpO2 Saturation")?.status).toBe(
      "Critical"
    );
  });
});
