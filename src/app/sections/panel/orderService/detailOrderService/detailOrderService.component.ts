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
import { CommonModule } from '@angular/common';
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

  constructor(private fb: FormBuilder, private orderDetailService: ServiceOrdersService) {}

  ngOnInit() {
    if (this.itemOrderService) {
      this.dataSource = this.itemOrderService;
      if (this.dataSource.detail) {
        console.log(this.dataSource.detail);
        this.initializeForm();
        this.textCondition = 'Actualizar detalle';
      } else {
        this.textCondition = 'Guardar detalle ';
      }
    }
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
      totalCost: [this.dataSource!.detail!.totalCost, [Validators.required]],
      departureDate: [this.dataSource!.detail!.departureDate, [Validators.required]],
      finalMileage: [this.dataSource!.detail!.finalMileage, [Validators.required]],
      observations: [this.dataSource!.detail!.observations, [Validators.required]],
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

    const ID = this.dataSource!.id ?? 0;
    delete formValue.id;

    this.orderDetailService.postServiceOrderDetail(formValue, ID).subscribe(
      (res) => {
        SweetAlert.success('Succes', res.message);
        this.textCondition = 'Actualizar detalle';
        this.disableButtonForm = true;
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
    this.disableButtonForm = false;
  }
}
