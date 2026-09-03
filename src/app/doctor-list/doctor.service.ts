import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Doctor } from './doctor.model';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private doctors: Doctor[] = [
    {
      doctorId: 201,
      name: 'Dr. Ananya Basu',
      qualification: 'MBBS, MD (Paediatrics)',
      specialty: 'General Paediatrics',
      experienceYears: 14,
      languages: ['English', 'Bengali', 'Hindi'],
      consultationFee: 800,
      availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
      registrationNo: 'WBMC-54821',
    },
    {
      doctorId: 202,
      name: 'Dr. Rajat Mukherjee',
      qualification: 'MBBS, DCH, DM (Neonatology)',
      specialty: 'Neonatology',
      experienceYears: 21,
      languages: ['English', 'Bengali'],
      consultationFee: 1500,
      availableDays: ['Mon', 'Wed', 'Sat'],
      registrationNo: 'WBMC-38104',
    },
    {
      doctorId: 203,
      name: 'Dr. Sneha Iyer',
      qualification: 'MBBS, MD, Fellowship (Paediatric Pulmonology)',
      specialty: 'Paediatric Pulmonology',
      experienceYears: 9,
      languages: ['English', 'Hindi', 'Tamil'],
      consultationFee: 1200,
      availableDays: ['Tue', 'Thu', 'Sat'],
      registrationNo: 'TNMC-71209',
    },
    {
      doctorId: 204,
      name: 'Dr. Imran Sheikh',
      qualification: 'MBBS, MD (Paediatrics), DNB',
      specialty: 'Paediatric Cardiology',
      experienceYears: 17,
      languages: ['English', 'Hindi', 'Urdu'],
      consultationFee: 1800,
      availableDays: ['Wed', 'Fri'],
      registrationNo: 'WBMC-46330',
    },
    {
      doctorId: 205,
      name: 'Dr. Meera Ghosh',
      qualification: 'MBBS, DCH',
      specialty: 'Vaccination & Well-baby Care',
      experienceYears: 6,
      languages: ['English', 'Bengali'],
      consultationFee: 600,
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      registrationNo: 'WBMC-69017',
    },
  ];

  getDoctors(): Observable<Doctor[]> {
    return of([...this.doctors]);
  }

  getDoctorById(id: number): Observable<Doctor | undefined> {
    return of(this.doctors.find((d) => d.doctorId === id));
  }
}