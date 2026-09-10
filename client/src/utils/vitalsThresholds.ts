export interface VitalsRange {
  ageGroup: "Infant (0-1 yr)" | "Toddler (1-3 yrs)" | "Child (4-11 yrs)" | "Adolescent (12-18 yrs)";
  hrMin: number;
  hrMax: number;
  rrMin: number;
  rrMax: number;
  sysBpMin: number;
  sysBpMax: number;
  spO2Min: number;
  tempMin: number;
  tempMax: number;
}

export function getPediatricVitalsRange(ageYears: number): VitalsRange {
  if (ageYears <= 1) {
    return {
      ageGroup: "Infant (0-1 yr)",
      hrMin: 100,
      hrMax: 160,
      rrMin: 30,
      rrMax: 60,
      sysBpMin: 70,
      sysBpMax: 100,
      spO2Min: 95,
      tempMin: 36.5,
      tempMax: 37.5,
    };
  } else if (ageYears <= 3) {
    return {
      ageGroup: "Toddler (1-3 yrs)",
      hrMin: 90,
      hrMax: 140,
      rrMin: 24,
      rrMax: 40,
      sysBpMin: 80,
      sysBpMax: 110,
      spO2Min: 95,
      tempMin: 36.5,
      tempMax: 37.5,
    };
  } else if (ageYears <= 11) {
    return {
      ageGroup: "Child (4-11 yrs)",
      hrMin: 70,
      hrMax: 120,
      rrMin: 18,
      rrMax: 30,
      sysBpMin: 90,
      sysBpMax: 120,
      spO2Min: 95,
      tempMin: 36.5,
      tempMax: 37.5,
    };
  } else {
    return {
      ageGroup: "Adolescent (12-18 yrs)",
      hrMin: 60,
      hrMax: 100,
      rrMin: 12,
      rrMax: 20,
      sysBpMin: 100,
      sysBpMax: 130,
      spO2Min: 95,
      tempMin: 36.5,
      tempMax: 37.5,
    };
  }
}

export interface VitalFlag {
  param: string;
  value: number | string;
  status: "Normal" | "Warning" | "Critical";
  expectedRange: string;
  message: string;
}

export function evaluateVitals(
  ageYears: number,
  vitals: {
    heartRate: number;
    respiratoryRate: number;
    systolicBp: number;
    spO2: number;
    temperature: number;
  }
): VitalFlag[] {
  const range = getPediatricVitalsRange(ageYears);
  const flags: VitalFlag[] = [];

  // Heart Rate
  if (vitals.heartRate > range.hrMax + 20 || vitals.heartRate < range.hrMin - 15) {
    flags.push({
      param: "Heart Rate",
      value: `${vitals.heartRate} bpm`,
      status: "Critical",
      expectedRange: `${range.hrMin}-${range.hrMax} bpm`,
      message: `Severe ${vitals.heartRate > range.hrMax ? "Tachycardia" : "Bradycardia"} for ${range.ageGroup}`,
    });
  } else if (vitals.heartRate > range.hrMax || vitals.heartRate < range.hrMin) {
    flags.push({
      param: "Heart Rate",
      value: `${vitals.heartRate} bpm`,
      status: "Warning",
      expectedRange: `${range.hrMin}-${range.hrMax} bpm`,
      message: `Elevated or depressed for ${range.ageGroup}`,
    });
  } else {
    flags.push({
      param: "Heart Rate",
      value: `${vitals.heartRate} bpm`,
      status: "Normal",
      expectedRange: `${range.hrMin}-${range.hrMax} bpm`,
      message: "Within normal pediatric limits",
    });
  }

  // Respiratory Rate
  if (vitals.respiratoryRate > range.rrMax + 10 || vitals.respiratoryRate < range.rrMin - 5) {
    flags.push({
      param: "Respiratory Rate",
      value: `${vitals.respiratoryRate}/min`,
      status: "Critical",
      expectedRange: `${range.rrMin}-${range.rrMax}/min`,
      message: `Severe tachypnea/bradypnea for ${range.ageGroup}`,
    });
  } else if (vitals.respiratoryRate > range.rrMax || vitals.respiratoryRate < range.rrMin) {
    flags.push({
      param: "Respiratory Rate",
      value: `${vitals.respiratoryRate}/min`,
      status: "Warning",
      expectedRange: `${range.rrMin}-${range.rrMax}/min`,
      message: `Out of normal range for ${range.ageGroup}`,
    });
  } else {
    flags.push({
      param: "Respiratory Rate",
      value: `${vitals.respiratoryRate}/min`,
      status: "Normal",
      expectedRange: `${range.rrMin}-${range.rrMax}/min`,
      message: "Within normal limits",
    });
  }

  // SpO2
  if (vitals.spO2 < 92) {
    flags.push({
      param: "SpO2 Saturation",
      value: `${vitals.spO2}%`,
      status: "Critical",
      expectedRange: `≥${range.spO2Min}%`,
      message: `Hypoxemia alert! Below critical threshold for ${range.ageGroup}`,
    });
  } else if (vitals.spO2 < range.spO2Min) {
    flags.push({
      param: "SpO2 Saturation",
      value: `${vitals.spO2}%`,
      status: "Warning",
      expectedRange: `≥${range.spO2Min}%`,
      message: `Mild desaturation for ${range.ageGroup}`,
    });
  } else {
    flags.push({
      param: "SpO2 Saturation",
      value: `${vitals.spO2}%`,
      status: "Normal",
      expectedRange: `≥${range.spO2Min}%`,
      message: "Adequate oxygenation",
    });
  }

  // Temperature
  if (vitals.temperature >= 38.5 || vitals.temperature < 35.5) {
    flags.push({
      param: "Temperature",
      value: `${vitals.temperature}°C`,
      status: "Critical",
      expectedRange: `${range.tempMin}-${range.tempMax}°C`,
      message: `High fever or hypothermia for ${range.ageGroup}`,
    });
  } else if (vitals.temperature > range.tempMax || vitals.temperature < range.tempMin) {
    flags.push({
      param: "Temperature",
      value: `${vitals.temperature}°C`,
      status: "Warning",
      expectedRange: `${range.tempMin}-${range.tempMax}°C`,
      message: `Low-grade fever or subnormal temp for ${range.ageGroup}`,
    });
  } else {
    flags.push({
      param: "Temperature",
      value: `${vitals.temperature}°C`,
      status: "Normal",
      expectedRange: `${range.tempMin}-${range.tempMax}°C`,
      message: "Normothermic",
    });
  }

  return flags;
}
