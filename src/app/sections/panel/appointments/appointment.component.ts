import {Component, OnInit} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {AsyncPipe, DatePipe, NgIf} from '@angular/common';
import {Appointment, AppointmentService} from './appointment.service';
import {AppointmentActionsComponent} from "./appointment-actions.component";
import {MatDialog} from "@angular/material/dialog";
import {AppointmentFormComponent} from "./appointment-form.compoment";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RoleEnum, UserRoleService} from "./user-role.service";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {tap} from "rxjs";

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
  displayedColumns: string[] = ['date', 'time', 'reason', 'status', 'customer', 'actions'];
  readonly appointments$ = this.service.appointments$

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

  openAppointmentDialog(appointment?: Appointment): void {
    this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: {appointment}
    })
  }

  createAppointment(): void {
    this.openAppointmentDialog();
  }

  editAppointment(appointment: Appointment): void {
    this.openAppointmentDialog(appointment);
  }
}
