import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Appointment, AppointmentService, Status } from './appointment.service';
import { AppointmentActionsComponent } from './appointment-actions.component';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormComponent } from './appointment-form.compoment';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RoleEnum, UserRoleService } from './user-role.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { catchError, combineLatest, filter, map, Observable, startWith, switchMap, tap } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { NgFor } from '@angular/common';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ServiceOrdersService } from '../../../services/serviceOrders.service';
import { IOrderService, IService } from '../../../interfaces/orderService';
import { MatPaginatorIntlEspañol } from '../../../shared/MatPaginatorIntl';
import { AppointmentAbelaService } from '../../../services/appoinmetAbela.service';
import { ProfileService } from '../../../services/profile.service';
import { RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { SweetAlert } from '../../../shared/SweetAlert';
import { CommonModule } from '@angular/common';
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
    MatFormField,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDateRangeInput,
    FormsModule,
    NgFor,
    MatIconModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatDialogModule,
    CommonModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlEspañol }],
})
export class AppointmentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  formFilter: FormGroup;
  status: any[] = [
    {
      value: 'Pendiente',
      viewValue: 'Pendiente',
    },
    {
      value: 'Completada',
      viewValue: 'Completada',
    },
    {
      value: 'Cancelada',
      viewValue: 'Cancelada',
    },
  ];
  horarios = [
    { value: '09:00', viewValue: '09:00' },
    { value: '09:30', viewValue: '09:30' },
    { value: '10:00', viewValue: '10:00' },
    { value: '10:30', viewValue: '10:30' },
    { value: '11:00', viewValue: '11:00' },
    { value: '11:30', viewValue: '11:30' },
    { value: '12:00', viewValue: '12:00' },
    { value: '12:30', viewValue: '12:30' },
    { value: '13:00', viewValue: '13:00' },
    { value: '13:30', viewValue: '13:30' },
    { value: '14:00', viewValue: '14:00' },
    { value: '14:30', viewValue: '14:30' },
    { value: '15:00', viewValue: '15:00' },
    { value: '15:30', viewValue: '15:30' },
    { value: '16:00', viewValue: '16:00' },
    { value: '16:30', viewValue: '16:30' },
    { value: '17:00', viewValue: '17:00' },
    { value: '17:30', viewValue: '17:30' },
    { value: '18:00', viewValue: '18:00' },
    { value: '18:30', viewValue: '18:30' },
  ];
  userData: any;
  customerColumns: string[] = ['date', 'time', 'reason', 'status', 'actions'];
  nonCustomerColumns: string[] = ['date', 'time', 'reason', 'status', 'customer', 'actions'];

  displayedColumns: string[] = ['date', 'time', 'reason', 'status', 'customer', 'actions'];
  dataSource = new MatTableDataSource<Appointment>();
  originalData: Appointment[] = [];

  constructor(
    private roleService: UserRoleService,
    private service: AppointmentService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private appointmentAbelaService: AppointmentAbelaService,
    private profileService: ProfileService
  ) {
    this.getProfile();

    this.formFilter = this.newFormControls();
  }

  ngOnInit() {
    this.formFilter.valueChanges.subscribe((filters) => {
      this.applyFilters(filters);
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getProfile(): void {
    this.profileService.getProfile().subscribe((data) => {
      this.userData = data;
      if (this.userData.role !== 'customer') {
        this.displayedColumns = this.nonCustomerColumns;
        this.getAllApooointments();
      } else {
        this.displayedColumns = this.customerColumns;
        this.getUserAppointments();
      }
    });
  }

  getAllApooointments(): void {
    this.appointmentAbelaService.getAllAppointments().subscribe((appointments) => {
      this.originalData = appointments.data;
      this.dataSource.data = this.originalData; // Cargar los datos originales
      this.applyFilters(this.formFilter.value); // Aplicar filtros iniciales
    });
  }

  getUserAppointments(): void {
    this.appointmentAbelaService.getUserAppointments().subscribe((appointments) => {
      this.originalData = appointments.data;
      this.dataSource.data = this.originalData; // Cargar los datos originales
      this.applyFilters(this.formFilter.value); // Aplicar filtros iniciales
    });
  }
  openAppointmentDialog(appointment?: Appointment): void {
    this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: { appointment },
    });
  }

  haveEnabledActions(appointment: Appointment): boolean {
    const isCustomer = this.roleService.getLastRole() === RoleEnum.CUSTOMER;
    if (isCustomer) {
      return appointment.status === 'Pendiente';
    }
    return true;
  }

  applyFilters(filters: any) {
    let filteredData = this.originalData; // Usar los datos originales como base

    // Filtrar por texto en `myControl`
    if (filters.myControl) {
      filteredData = filteredData.filter(
        (appointment) => appointment.customer && appointment.customer.name.toLowerCase().includes(filters.myControl.toLowerCase())
      );
    }

    // Filtrar por `horarios`
    if (filters.horarios && filters.horarios !== 'all') {
      filteredData = filteredData.filter((appointment) => appointment.time === filters.horarios);
    }

    // Filtrar por `status`
    if (filters.status && filters.status !== 'all') {
      filteredData = filteredData.filter((appointment) => appointment.status === filters.status);
    }

    // Filtrar por fecha exacta
    if (filters.startDate) {
      const selectedDate = new Date(filters.startDate);

      filteredData = filteredData.filter((appointment) => {
        const appointmentDate = new Date(appointment.date);

        // Comparar sólo el día, mes y año
        return (
          appointmentDate.getDate() === selectedDate.getDate() &&
          appointmentDate.getMonth() === selectedDate.getMonth() &&
          appointmentDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    }

    // Actualizar los datos en el `dataSource`
    this.dataSource.data = filteredData;
  }

  createAppointment(): void {
    this.openAppointmentDialog();
  }

  editAppointment(appointment: Appointment): void {
    this.openAppointmentDialog(appointment);
  }

  cancelAppointment(appointment: Appointment): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'la cita será cancelada y esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#bc0505',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.cancelAppointment(appointment.id).subscribe();
        SweetAlert.success('Cita cancelada', 'La cita ha sido cancelada correctamente');
        this.getProfile();
      }
    });
  }

  newFormControls(): FormGroup {
    return this.fb.group({
      myControl: [''],
      filter: [''],
      horarios: ['all'],
      status: ['all'],
      startDate: [null],
      endDate: [null],
    });
  }

  resetFilters(): void {
    this.formFilter.reset({
      myControl: '',
      filter: 'all',
      horarios: 'all',
      status: 'all',
      startDate: null, // Cambia a null para asegurarte de que se restablezca correctamente
      endDate: null, // Cambia a null para asegurarte de que se restablezca correctamente
    });
    this.applyFilters(this.formFilter.value); // Aplicar filtros después de resetear
  }
}
