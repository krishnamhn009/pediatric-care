export interface Doctor {
  doctorId: number;
  name: string;
  qualification: string;
  specialty: string;
  experienceYears: number;
  languages: string[];
  consultationFee: number;
  availableDays: string[];
  registrationNo: string;
}