import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Appointment, AppointmentService, Status } from './appointment.service';
import { AppointmentActionsComponent } from "./appointment-actions.component";
import { MatDialog } from "@angular/material/dialog";
import { AppointmentFormComponent } from "./appointment-form.compoment";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { RoleEnum, UserRoleService } from "./user-role.service";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { catchError, combineLatest, filter, map, Observable, startWith, switchMap, tap } from "rxjs";


@Component({
  selector: 'app-appointment',
  styleUrls: ['appointment.component.css'],
  templateUrl: 'appointment.component.html',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatInput,
    MatSelect,
    MatLabel,
    MatOption,
    AsyncPipe,
    NgIf,
    MatIcon,
    AppointmentActionsComponent,
    MatButton,
    DatePipe,
    ReactiveFormsModule,
    MatFormField
  ],
})
export class AppointmentComponent implements OnInit {
  readonly status: Status[] = ['Pendiente', 'Completada', 'Cancelada'];
  readonly displayedColumns: string[] = ['date', 'time', 'reason', 'status', 'customer', 'actions'];
  readonly searchCtrl = new FormControl<string>('');
  readonly selectedStatusCtrl: FormControl<Status | null> = new FormControl(null);
  
  readonly filteredAppointments$ = this.roleService.role$.pipe(
    tap(currentRole => {
      console.log('Current role:', currentRole);
      if (currentRole !== RoleEnum.CUSTOMER) {
        this.service.getAllAppointments();
      }
      this.service.getUserAppointments();
    }),
    switchMap(() => combineLatest([
      this.service.appointments$,
      this.selectedStatusCtrl.valueChanges.pipe(startWith(null), tap(status => console.log('Selected status:', status))),
      this.searchCtrl.valueChanges.pipe(startWith(''), tap(searchValue => console.log('Search value:', searchValue)))
    ]).pipe(
      map(([appointments, status, searchValue]) => {
        const filteredByStatus = status
          ? appointments.filter(appointment => appointment.status === status)
          : appointments;
        if (!searchValue) return filteredByStatus;
  
        const normalizedValue = searchValue.toLowerCase();
        const result = filteredByStatus.filter(appointment => 
          this._filterAppointmentByColumnValue(appointment, normalizedValue));
        return result;
      }),
      catchError(error => {
        console.error('Error in filteredAppointments$:', error);
        return [];
      })
    ))
  );

  constructor(
    private roleService: UserRoleService,
    private service: AppointmentService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.roleService.role$.pipe(
      tap(currentRole => {
        if (currentRole !== RoleEnum.CUSTOMER) {
          this.service.getAllAppointments()
        } else {
          this.service.getUserAppointments()
        }
      })
    ).subscribe()
  }

  private _filterAppointmentByColumnValue(appoinment: Appointment, searchTerm: string): boolean {
    return Object.values(appoinment).some(value => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm)
      }
      if (typeof value === 'number') {
        return value.toString().toLowerCase().includes(searchTerm)
      }
      if (typeof value === 'object') {
        return this._filterAppointmentByColumnValue(value, searchTerm)
      }
      return false
    })
  }

  openAppointmentDialog(appointment?: Appointment): void {
    this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: { appointment }
    })
  }

  haveEnabledActions(appointment: Appointment): boolean {
    const isCustomer = this.roleService.getLastRole() === RoleEnum.CUSTOMER;
    if (isCustomer) {
      return appointment.status === 'Pendiente';
    }
    return true;
  }

  createAppointment(): void {
    this.openAppointmentDialog();
  }

  editAppointment(appointment: Appointment): void {
    this.openAppointmentDialog(appointment);
  }
  cancelAppointment(appointment: Appointment): void {
    console.log('Canceling appointment:', appointment);
    this.service.cancelAppointment(appointment.id).subscribe();
  }
}
