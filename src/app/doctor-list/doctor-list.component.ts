import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.model';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.scss',
})
export class DoctorListComponent implements OnInit {
  private doctorService = inject(DoctorService);

  doctors: Doctor[] = [];
  loading = false;

  ngOnInit(): void {
    this.loading = true;
    this.doctorService.getDoctors().subscribe({
      next: (list) => {
        this.doctors = list;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  trackById(_: number, doctor: Doctor): number {
    return doctor.doctorId;
  }
}