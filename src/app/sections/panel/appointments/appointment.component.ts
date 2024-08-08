import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Appointment, AppointmentService } from './appointment.service';
import { catchError, Observable, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-appointment',
  styleUrls: ['appointment.component.css'],
  templateUrl: 'appointment.component.html',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormField,
    FormsModule,
    AsyncPipe,
    NgIf,
    NgFor,
    MatSlideToggle,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatLabel,
    MatInputModule,
    MatSelectModule,
  ],
})
export class appointmentComponent implements OnInit{
  displayedColumns: string[] = ['date', 'time', 'reason', 'actions'];
  appointments$ = this.service.appointments$.pipe();

  constructor(private service: AppointmentService) {}

  ngOnInit(): void {
    this.service.getUserAppointments();
  }
  
  createAppointment(appointment: Appointment) {
    this.service.createAppointment(appointment);
  }

  editAppointment(appointment: Appointment) {
    this.service.updateAppointment(appointment);
  }
  
  cancelAppointment(id: number) {
    this.service.cancelAppointment(id);
  }
}