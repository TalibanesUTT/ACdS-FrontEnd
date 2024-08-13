import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {Appointment, AppointmentService} from './appointment.service';
import {AsyncPipe, NgFor, NgIf} from "@angular/common";
import {RoleEnum, UserRoleService} from "./user-role.service";
import {CustomersAutocompleteComponent} from "./customers-autocomplete/customers-autocomplete.component";
import {map} from "rxjs/operators";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    NgIf,
    NgFor,
    CustomersAutocompleteComponent,
    AsyncPipe
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Editar' : 'Crear' }} Cita</h2>
    <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field>
          <mat-label>Fecha</mat-label>
          <input [matDatepickerFilter]="dateFilter" matInput [matDatepicker]="picker" formControlName="date"
                 [min]="minDate"
                 [placeholder]="data.appointment?.date ??  ''">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Hora</mat-label>
          <mat-select formControlName="time" [placeholder]="data.appointment?.time ??  ''">
            <mat-option *ngFor="let time of availableTimes | async" [value]="time">
              {{ time }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        @if (canUpdateCustomer | async) {
          <app-customers-autocomplete
            (customerSelected)="appointmentForm.get('userId')?.setValue($event.id)"></app-customers-autocomplete>
        }

        <mat-form-field>
          <mat-label>Razón</mat-label>
          <textarea matInput formControlName="reason" [placeholder]="data.appointment?.reason ?? ''"></textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="center">
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="appointmentForm.invalid">
          {{ isEditMode ? 'Actualizar' : 'Crear' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }
  `]
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm: FormGroup;
  isEditMode: boolean;
  minDate: Date;
  canUpdateCustomer = this.roleService.role$.pipe(
    map(role => role !== RoleEnum.CUSTOMER)
  )
  dateFilter = (date: Date | null): boolean => {
    const day = (date || new Date()).getDay();
    return day !== 0 && day !== 6; // Disable weekends
  };
  availableTimes: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private roleService: UserRoleService,
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { appointment?: Appointment }
  ) {
    this.isEditMode = !!data.appointment;
    this.minDate = new Date();
    this.appointmentForm = this.fb.group({
      date: [null, Validators.required],
      time: [null, Validators.required],
      reason: ['', Validators.required],
      userId: [null]
    });
    
    this.availableTimes = this.appointmentForm.get('date')?.valueChanges.pipe(
      map(date => this.generateTimeSlots(date))
    ) ?? new Observable<string[]>();
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.appointmentForm.patchValue(this.data.appointment!);
    }
  }

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const appointmentData = this.appointmentForm.value;
      const updatedData = {userId: null, ...this.data.appointment, ...appointmentData};
      if (this.isEditMode) {
        this.appointmentService.updateAppointment(this.data.appointment!.id, {
          userId: Number(updatedData.userId),
          date: updatedData.date,
          time: updatedData.time,
          reason: updatedData.reason,
        })
          .subscribe({
            next: updatedAppointment => this.dialogRef.close(updatedAppointment),
            error: error => console.error('Error updating appointment', error)
          });
      } else {
        this.appointmentService.createAppointment({...appointmentData, userId: Number(appointmentData.userId)})
          .subscribe({
            next: newAppointment => this.dialogRef.close(newAppointment),
            error: error => console.error('Error creating appointment', error)
          })
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  
  private generateTimeSlots(date: Date | null): string[] {
    const now = new Date();
    const isToday = date?.toDateString() === now.toDateString();
    now.setHours(now.getHours() + 1);
    const initialHour = isToday ? now.toTimeString().slice(0, 5) : "09:00";
    const finalHour = "19:00";
    const formatTime = (hour: number, minute: number): string =>
      `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    return Array.from({length: 26}, (_, index) => {
      const hour = Math.floor(index / 2) + 6;
      const minute = (index % 2) * 30;
      return formatTime(hour, minute);
    }).filter(time => time >= initialHour && time <= finalHour);
  }
}

