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
import { IHistory, IOrderService, IService } from '../../../../interfaces/orderService';
import { JsonPipe } from '@angular/common';
import { ServiceOrdersService } from '../../../../services/serviceOrders.service';
import { AppointmentService } from '../../../../services/appointments.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VehiclesService } from '../../../../services/vehicles.service';
import { MatTabsModule } from '@angular/material/tabs';
import { SweetAlert } from '../../../../shared/SweetAlert';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../../services/profile.service';
import Swal from 'sweetalert2';
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-detail-order-service',
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
    CommonModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlEspañol }],
  templateUrl: './detailOrderService.component.html',
  styleUrls: ['./detailOrderService.component.css'],
})
export class detailOrderServiceComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() itemOrderService!: IOrderService;
  @Input() menuOption!: string;
  @Output() showForm = new EventEmitter<string>();
  dataSource: IOrderService | null = null;
  formDetailOrderService!: FormGroup;
  disableButtonForm = true;
  textCondition = '';
  UserData: any;
  showButton = false;
  readonly = true;
  token = localStorage.getItem('token');
  lastDetail: IHistory | null = null;

  constructor(private fb: FormBuilder, private orderDetailService: ServiceOrdersService, private profileService: ProfileService) {
    this.getProfile();
  }

  ngOnInit() {
    if (this.itemOrderService) {
      this.getHistory();
      this.dataSource = this.itemOrderService;
      if (this.dataSource.detail) {
        this.initializeForm();
        this.textCondition = 'Actualizar detalle';
      } else {
        this.textCondition = 'Guardar detalle ';
      }
    }
  }
  getProfile() {
    this.profileService.getProfile().subscribe((response) => {
      this.UserData = response;
    });
  }
  validateForm() {
    if (this.formDetailOrderService.valid) {
      this.disableButtonForm = false;
    } else {
      this.disableButtonForm = true;
    }
  }
  initializeForm() {
    this.formDetailOrderService = this.fb.group({
      id: [this.dataSource!.detail!.id],
      budget: [this.dataSource!.detail!.budget, [Validators.required]],
      totalCost: [this.dataSource!.detail!.totalCost, []],
      departureDate: [this.dataSource!.detail!.departureDate, []],
      finalMileage: [this.dataSource!.detail!.finalMileage, []],
      observations: [this.dataSource!.detail!.observations, []],
      repairDays: [this.dataSource!.detail!.repairDays, []],
    });
  }

  addDetailOrderService() {
    if (!this.dataSource!.detail) {
      this.dataSource!.detail = {
        id: 0,
        budget: '',
        totalCost: 0,
        departureDate: '',
        finalMileage: 0,
        observations: '',
        repairDays: 0,
      };
      this.initializeForm(); // Inicializa el formulario después de crear el detalle
      this.textCondition = 'Guardar detalle';
    }
  }

  sendForm() {
    const formValue = { ...this.formDetailOrderService.value };
    formValue.finalMileage = Number(formValue.finalMileage); // Asegurarse de que finalMileage sea un número
    if (formValue.departureDate === '') delete formValue.departureDate; // Si departureDate es null, eliminarlo
    if (formValue.totalCost === '') formValue.totalCost = 0; // Si totalCost es null, asignarle 0
    if (formValue.finalMileage === '') formValue.finalMileage = 0; // Si finalMileage es null, asignarle 0
    const ID = this.dataSource!.id ?? 0;
    delete formValue.id;
    delete formValue.repairDays;

    this.orderDetailService.postServiceOrderDetail(formValue, ID).subscribe(
      (res) => {
        this.showButton = false;
        SweetAlert.success('Succes', res.message);
        this.textCondition = 'Actualizar detalle';
        this.disableButtonForm = true;
        if (this.dataSource && this.dataSource.detail) {
          this.dataSource.detail.repairDays = res.data.detail.repairDays;
        }
        // this.closeForm();
      },
      (err) => {
        SweetAlert.error('Error', err.error.error.message);
      }
    );
  }

  closeForm() {
    this.showForm.emit('table');
  }
  changeButton() {
    this.showButton = !this.showButton;
    if (!this.showButton) {
      this.readonly = true;
    } else {
      this.readonly = false;
    }
    this.disableButtonForm = false;
  }

  getHistory() {
    this.orderDetailService.getOneServiceOrder(this.itemOrderService.id || 0).subscribe((res) => {
      console.log('hostory', res.data);
      //obtener el ultimo detalle
      this.lastDetail = res.data.actualStatus;
    });
  }

  acceptOrder() {
    let form = {
      rollback: false,
      cancel: false,
      onHold: false,
      // reject: false,
    };
    this.orderDetailService.postUpdateStatus(form, this.itemOrderService.id || 0).subscribe(
      (res) => {
        SweetAlert.success('Succes', res.message);
        console.log('res', res);
        this.lastDetail = res.data.actualStatus;
        // this.showForm.emit('table');
      },
      (err) => {
        SweetAlert.error('Error', err.error.error.message);
      }
    );
  }
  cancelOrder() {
    let form = {
      rollback: false,
      cancel: false,
      onHold: false,
      reject: true,
    };
    Swal.fire({
      title: 'Estás a punto de rechazar esta orden de servicio. ',
      text: '¿Seguro que quieres hacerlo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderDetailService.postUpdateStatus(form, this.itemOrderService.id || 0).subscribe(
          (res) => {
            SweetAlert.success('Succes', res.message);
            console.log('res', res);
            this.lastDetail = res.data.actualStatus;
            // this.showForm.emit('table');
          },
          (err) => {
            SweetAlert.error('Error', err.error.error.message);
          }
        );
      }
    });
  }
}
