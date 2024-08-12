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
import { MatPaginatorIntlEspañol } from '../../../../../shared/MatPaginatorIntl';
import { IOrderService, IService } from '../../../../../interfaces/orderService';
import { JsonPipe } from '@angular/common';
import { ServiceOrdersService } from '../../../../../services/serviceOrders.service';
import { AppointmentService } from '../../../../../services/appointments.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VehiclesService } from '../../../../../services/vehicles.service';
import { MatTabsModule } from '@angular/material/tabs';
import { SweetAlert } from '../../../../../shared/SweetAlert';
import { CustomValidators } from '../../../../../shared/validation';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-edit-order-service',
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
    CommonModule,
    MatTabsModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlEspañol }],
  templateUrl: './formEditOrderService.component.html',
  styleUrls: ['./formEditOrderService.component.css'],
})
export class formOrderServiceComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() itemOrderService!: IOrderService;
  @Input() showFormEditOrderService!: boolean;
  dataSource!: IOrderService;
  @Output() changeShowFormEditOrderService = new EventEmitter<boolean>();
  servicesData: IService[] = [];
  vehiclesData: any[] = [];
  appointmentsPendingData: any[] = [];
  filteredVehicles: any[] = [];
  formOrderService: FormGroup;
  buttonDisabled = true;
  ID = 0;

  constructor(
    private serviceOrderService: ServiceOrdersService,
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private vehicleService: VehiclesService,
    private orderServiceService: ServiceOrdersService
  ) {
    this.formOrderService = this.newFormControls();
    this.getAllServices();
    this.getAllVehicles();
    this.getAppointmentPending();
  }
  ngOnInit() {
    this.dataSource = this.itemOrderService;
    this.ID = this.itemOrderService.id || 0;
    // Patch form values with data from itemOrderService
    this.formOrderService.patchValue({
      fileNumber: this.itemOrderService.fileNumber,
      initialMileage: this.itemOrderService.initialMileage,
      notes: this.itemOrderService.notes,
      vehicleId: this.itemOrderService.vehicle.id,
      vehicleDisplay: `${this.itemOrderService.vehicle.model.brand} ${this.itemOrderService.vehicle.model.model} - ${this.itemOrderService.vehicle.year} - ${this.itemOrderService.vehicle.color} - ${this.itemOrderService.vehicle.owner}`,
      servicesIds: this.itemOrderService.services.map((service) => service.id),
      dependsOnAppointment: this.itemOrderService.appointment ? true : false,
      appointmentId: this.itemOrderService.appointment ? this.itemOrderService.appointment.id : '',
      appointmentDisplay: this.itemOrderService.appointment
        ? `${this.itemOrderService.appointment.date} - ${this.itemOrderService.appointment.time} - ${this.itemOrderService.appointment.customer.name} ${this.itemOrderService.appointment.customer.lastName}`
        : '',
      notifyTo: this.itemOrderService.notifyTo,
    });

    this.validateForm(); // Validate form initially
  }
  getAllServices() {
    this.serviceOrderService.getAllService().subscribe((res) => {
      this.servicesData = res.data;
    });
  }
  newFormControls() {
    return this.fb.group({
      fileNumber: ['', [Validators.required, CustomValidators.alphanumeric]],
      servicesIds: ['', [Validators.required]],
      initialMileage: ['', [Validators.required, CustomValidators.onlyNumbers]],
      dependsOnAppointment: [false],
      appointmentId: [''],
      appointmentDisplay: [''],
      vehicleId: ['', [Validators.required]],
      vehicleDisplay: ['', [Validators.required]],
      notifyTo: [''],
      notes: ['', [Validators.required]],
    });
  }

  getAllVehicles() {
    this.vehicleService.getAllVehicles().subscribe((res) => {
      this.vehiclesData = res.data;
      this.filteredVehicles = this.vehiclesData;
    });
  }
  filterVehicles(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredVehicles = this.vehiclesData.filter(
      (vehicle) =>
        vehicle.model.brand.toLowerCase().includes(filterValue) ||
        vehicle.model.model.toLowerCase().includes(filterValue) ||
        vehicle.year.toString().includes(filterValue) ||
        vehicle.color.toLowerCase().includes(filterValue) ||
        vehicle.plates.toLowerCase().includes(filterValue)
    );
  }
  onVehicleSelected(vehicleId: string) {
    const selectedVehicle = this.vehiclesData.find((vehicle) => vehicle.id === vehicleId);
    if (selectedVehicle) {
      this.formOrderService.patchValue({
        vehicleId: selectedVehicle.id,
        vehicleDisplay: `${selectedVehicle.model.brand} ${selectedVehicle.model.model} - ${selectedVehicle.year} - ${selectedVehicle.color} - ${selectedVehicle.owner}`,
      });
    }
  }
  filterAppointments(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.appointmentsPendingData = this.appointmentsPendingData.filter(
      (appointment) =>
        appointment.customer.name.toLowerCase().includes(filterValue) ||
        appointment.customer.lastName.toLowerCase().includes(filterValue) ||
        appointment.date.includes(filterValue) ||
        appointment.time.includes(filterValue)
    );
  }
  onAppointmentSelected(appointmentId: string) {
    const selectedAppointment = this.appointmentsPendingData.find((appointment) => appointment.id === appointmentId);
    if (selectedAppointment) {
      this.formOrderService.patchValue({
        appointmentId: selectedAppointment.id,
        appointmentDisplay: `${selectedAppointment.date} - ${selectedAppointment.time} - ${selectedAppointment.customer.name} ${selectedAppointment.customer.lastName}`,
      });
    }
  }

  closeForm() {
    this.changeShowFormEditOrderService.emit(false);
  }
  sendForm() {
    const formValue = { ...this.formOrderService.value };
    if (formValue.appointmentId === 0) {
      delete formValue.appointmentId;
      formValue.dependsOnAppointment = false;
    }
    if (formValue.dependsOnAppointment === false) {
      delete formValue.appointmentId;
    }
    delete formValue.vehicleDisplay;
    delete formValue.appointmentDisplay;
    delete formValue.dependsOnAppointment;
    // Si tienes campos numéricos, conviértelos al tipo correcto si es necesario
    formValue.vehicleId = Number(formValue.vehicleId);
    formValue.appointmentId = Number(formValue.appointmentId);
    formValue.initialMileage = Number(formValue.initialMileage);

    this.orderServiceService.putServiceOrder(formValue, this.ID).subscribe(
      (res) => {
        SweetAlert.success('success', res.message);
        console.log(res);
        this.formOrderService.value.fileNumber = res.data.fileNumber;
        this.formOrderService.value.initialMileage = res.data.initialMileage;
        this.formOrderService.value.notes = res.data.notes;
        this.formOrderService.value.vehicleId = res.data.vehicle.id;
        this.formOrderService.value.vehicleDisplay = `${res.data.vehicle.model.brand} ${res.data.vehicle.model.model} - ${res.data.vehicle.year} - ${res.data.vehicle.color} - ${res.data.vehicle.owner}`;
        this.formOrderService.value.servicesIds = res.data.services.map((service: any) => service.id);
        this.formOrderService.value.dependsOnAppointment = res.data.appointment ? true : false;
        this.formOrderService.value.appointmentId = res.data.appointment ? res.data.appointment.id : '';
        this.formOrderService.value.appointmentDisplay = res.data.appointment
          ? `${res.data.appointment.date} - ${res.data.appointment.time} - ${res.data.appointment.customer.name} ${res.data.appointment.customer.lastName}`
          : '';
        this.formOrderService.value.notifyTo = res.data.notifyTo;
        this.getAppointmentPending();
        this.closeForm();
      },
      (err) => {
        console.log(err);
        SweetAlert.error('Error', err.error.error.message);
      }
    );
  }

  getAppointmentPending() {
    this.appointmentService.getAppointmentPending().subscribe((res) => {
      this.appointmentsPendingData = res.data;
    });
  }

  validateForm() {
    if (this.formOrderService.invalid) {
      this.buttonDisabled = true;
    } else {
      this.buttonDisabled = false;
    }
  }
}
