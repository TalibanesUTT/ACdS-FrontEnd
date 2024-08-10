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
  displayedColumns: string[] = ['date', 'time', 'reason', 'actions'];
  appointments$ = this.service.appointments$

  constructor(
    private roleService: UserRoleService,
    private service: AppointmentService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    switch (this.roleService.role) {
      case RoleEnum.CUSTOMER:
        this.service.getUserAppointments();
        break;
      default:
        this.service.getAllAppointments();
        break;
    }
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
