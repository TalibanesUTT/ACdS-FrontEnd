import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { MatPaginatorIntlEspañol } from '../../../../shared/MatPaginatorIntl';
import { IOrderService, IService } from '../../../../interfaces/orderService';
import { JsonPipe } from '@angular/common';
import { ServiceOrdersService } from '../../../../services/serviceOrders.service';
import { AppointmentService } from '../../../../services/appointments.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VehiclesService } from '../../../../services/vehicles.service';
import { MatTabsModule } from '@angular/material/tabs';
import { SweetAlert } from '../../../../shared/SweetAlert';
import { formEditOrderServiceComponent } from '../forms/formEditOrderService/formOrderService.component';
import { formOrderServiceComponent } from '../forms/formOrderService/formEditOrderService.component';
import { ProfileService } from '../../../../services/profile.service';
@Component({
  selector: 'app-info-order-service',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    DatePipe,
    NgIf,
    NgFor,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDateRangeInput,
    JsonPipe,
    MatTabsModule,
    formEditOrderServiceComponent,
    formOrderServiceComponent,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlEspañol }],
  templateUrl: './infoOrderService.component.html',
  styleUrls: ['./infoOrderService.component.css'],
})
export class infoOrderServiceComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() itemOrderService!: IOrderService;
  @Input() menuOption!: string;
  @Output() showForm = new EventEmitter<string>();
  formOrderService!: FormGroup;
  servicesData: IService[] = [];
  vehiclesData: any[] = [];
  filteredVehicles: any[] = [];
  showFormEditOrderService = false;
  UserData: any = {};
  token = localStorage.getItem('token');
  constructor(
    private fb: FormBuilder,
    private serviceOrderService: ServiceOrdersService,
    private vehicleService: VehiclesService,
    private profileService: ProfileService
  ) {
    this.getProfile();
    this.formOrderService = this.newFormControls();
  }

  ngOnInit() {
    if (this.itemOrderService) {
      this.populateForm(this.itemOrderService);
    }
    this.getAllServices();
    this.getAllVehicles();
  }
  getProfile() {
    this.profileService.getProfile().subscribe((res) => {
      this.UserData = res;
    });
  }
  newFormControls() {
    return this.fb.group({
      // Información
      id: [''],
      fileNumber: ['', [Validators.required]],
      createDate: ['', [Validators.required]],
      actualStatus: ['', [Validators.required]],
      initialMileage: ['', [Validators.required]],
      notes: [''],
      emailNotification: [''],
      servicesIds: [[], [Validators.required]],

      // Información de la cita
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      customer: ['', [Validators.required]],
      dependsOnAppointment: ['', [Validators.required]],

      // Información del vehículo
      vehicleId: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: ['', [Validators.required]],
      color: ['', [Validators.required]],
      owner: ['', [Validators.required]],
    });
  }
  closeForm() {
    this.showForm.emit('table');
  }

  populateForm(orderService: IOrderService) {
    if (orderService.appointment) {
      this.formOrderService.patchValue({
        dependsOnAppointment: '1',
      });
    } else {
      this.formOrderService.patchValue({
        dependsOnAppointment: '0',
      });
    }
    this.formOrderService.patchValue({
      id: orderService.id,
      // Información
      fileNumber: orderService.fileNumber,
      createDate: orderService.createDate ? new Date(orderService.createDate) : '', // Convierte la fecha a objeto Date
      actualStatus: orderService.actualStatus,
      initialMileage: orderService.initialMileage,
      notes: orderService.notes,

      // Servicios
      servicesIds: orderService.services ? orderService.services.map((service) => service.id) : [],

      // Información de la cita
      date: orderService.appointment?.date ? new Date(orderService.appointment.date) : '', // Convierte la fecha a objeto Date
      time: orderService.appointment?.time || '',
      customer: orderService.appointment?.customer ? `${orderService.appointment.customer.name} ${orderService.appointment.customer.lastName}` : '',

      // Información del vehículo
      vehicleId: orderService.vehicle?.id || '',
      brand: orderService.vehicle?.model?.brand || '',
      model: orderService.vehicle?.model?.model || '',
      year: orderService.vehicle?.year || '',
      color: orderService.vehicle?.color || '',
      owner: orderService.vehicle?.owner || '',
    });
  }
  getAllServices() {
    this.serviceOrderService.getAllService().subscribe((res) => {
      this.servicesData = res.data;
    });
  }

  getAllVehicles() {
    this.vehicleService.getAllVehicles().subscribe((res) => {
      this.vehiclesData = res.data;
      this.filteredVehicles = this.vehiclesData;
    });
  }

  sendForm() {
    const ID = this.formOrderService.value.id;
    const formValue = { ...this.formOrderService.value };
    formValue.vehicleId = Number(formValue.vehicleId);
    formValue.initialMileage = Number(formValue.initialMileage);

    // Eliminar campos innecesarios antes de enviar
    delete formValue.id;
    delete formValue.createDate;
    delete formValue.actualStatus;
    delete formValue.date;
    delete formValue.time;
    delete formValue.customer;
    delete formValue.dependsOnAppointment;
    delete formValue.brand;
    delete formValue.model;
    delete formValue.year;
    delete formValue.color;
    delete formValue.owner;
    delete formValue.emailNotification;

    this.serviceOrderService.putServiceOrder(formValue, ID).subscribe(
      (res) => {
        SweetAlert.success('success', res.message);
        this.closeForm();
      },
      (err) => {
        SweetAlert.error('Error', err.error.message);
      }
    );
  }
  editForm() {
    this.showFormEditOrderService = true;
  }
  changeShowFormEditOrderService(event: boolean) {
    this.showFormEditOrderService = event;
  }
}
