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
import {map, startWith} from "rxjs/operators";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIcon,
    MatSelectModule,
    MatButtonModule,
    NgIf,
    NgFor,
    CustomersAutocompleteComponent,
    AsyncPipe
  ],
  template: `
    <div style="display: flex; justify-content: space-between; padding: 1em; align-items: center;">
    <h2 mat-dialog-title>{{ isEditMode ? 'Editar' : 'Crear' }} cita</h2>
    <button (click)="onCancel()" mat-icon-button mat-dialog-close>
      <mat-icon>close</mat-icon>
</button>
</div>
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
          <app-customers-autocomplete [initialValue]="data.appointment?.customer"
            (customerSelected)="appointmentForm.get('userId')?.setValue($event.id)"></app-customers-autocomplete>
        }

        <mat-form-field>
          <mat-label>Razón</mat-label>
          <textarea matInput formControlName="reason" [placeholder]="data.appointment?.reason ?? ''"></textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="center">
        <button style="  color: white;
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border-radius: 5%;
  background-color: #bc0505;
  box-shadow: 0px 0px 5px 0px #000000;
  color: white;" mat-raised-button color="primary" type="submit" [disabled]="appointmentForm.invalid">
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
    const nextTwoMonths = new Date();
        nextTwoMonths.setMonth(nextTwoMonths.getMonth() + 2);
    const isBeforeTwoMonths = date ? date < nextTwoMonths: false;
    const now = new Date();
    const isToday = date ? date.toDateString() === now.toDateString() : false;
    const isBetweenHours = isToday ? date ? date.getHours() >= 9 && date.getHours() <= 19 : false : true;
    return day !== 0 && isBeforeTwoMonths && isBetweenHours; // Disable weekends
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
    // Assuming this is inside your component class
this.availableTimes = this.appointmentForm.get('date')?.valueChanges.pipe(
  startWith(new Date()), // Start with the current date
  map(date => date ? new Date(date) : new Date()), // Convert to Date object
  map(date => this.generateTimeSlots(date))
) ?? of([]);
  }

  ngOnInit(): void {
    if (this.isEditMode) {
      this.appointmentForm.patchValue({... this.data.appointment!,date: new Date(this.data.appointment!.date + 'T00:00:00')});
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
  
  private generateTimeSlots(date: Date): string[] {
    const now = new Date();
    const finalHour = "19:30";
    now.setHours(now.getHours() + 1);
    const isToday = date.toDateString() === now.toDateString();
    const initialHour = isToday ? now.toTimeString().slice(0, 5) : "09:30";
    const formatTime = (hour: number, minute: number): string =>
      `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    return Array.from({length: 26}, (_, index) => {
      const hour = Math.floor(index / 2) + 6;
      const minute = (index % 2) * 30;
      return formatTime(hour, minute);
    }).filter(time => time >= initialHour && time <= finalHour);
  }
}

