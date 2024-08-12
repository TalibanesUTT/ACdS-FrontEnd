import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
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
import { MatTableDataSource } from '@angular/material/table';
import { changeStatusOrderComponent } from '../dialog/changeStatusOrder/changeStatusOrder.component';
import { ProfileService } from '../../../../services/profile.service';

@Component({
  selector: 'app-history-order-service',
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
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlEspañol }],
  templateUrl: './historyOrderService.component.html',
  styleUrls: ['./historyOrderService.component.css'],
})
export class historyOrderServiceComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() itemOrderService!: IOrderService;
  @Input() menuOption!: string;
  @Output() showForm = new EventEmitter<string>();
  dataSource = new MatTableDataSource<IHistory>();
  readonly dialog = inject(MatDialog);
  displayedColumns: string[] = ['status', 'comments', 'time'];
  showCancelButton = true;
  showOnHoldButton = true;
  showRollbackButton = true;
  showContinueButton = false;
  UserData: any;
  token = localStorage.getItem('token');

  constructor(private orderDetailService: ServiceOrdersService, private profileService: ProfileService) {
    this.getProfile();
  }

  ngOnInit() {
    if (this.itemOrderService && Array.isArray(this.itemOrderService.history)) {
      this.dataSource.data = this.itemOrderService.history;
      this.dataSource.paginator = this.paginator;
      this.evaluateButtonVisibility(this.itemOrderService.actualStatus);
    }
  }
  getProfile() {
    this.profileService.getProfile().subscribe((data) => {
      this.UserData = data;
    });
  }
  resetValueShowButton() {
    this.showCancelButton = true;
    this.showOnHoldButton = true;
    this.showRollbackButton = true;
    this.showContinueButton = false;
  }
  evaluateButtonVisibility(status: string) {
    const currentStatus = status;
    const statuses = [
      'Recibido',
      'En revisión',
      'Emitido',
      'Aprobado',
      'En proceso',
      'En chequeo',
      'Completado',
      'Listo para recoger',
      'Entregado',
      'Finalizado',
      'En espera',
      'Cancelado',
    ];
    const currentIndex = statuses.indexOf(currentStatus);

    if (currentStatus === 'Cancelado') {
      this.showCancelButton = false;
      this.showOnHoldButton = false;
    }

    if (currentStatus === 'En espera') {
      this.showOnHoldButton = false;
      this.showContinueButton = true;
    }

    if (currentStatus === 'Recibido') {
      this.showRollbackButton = false;
    }

    if (currentIndex >= statuses.indexOf('Aprobado')) {
      this.showCancelButton = false;
    }

    if (currentIndex >= statuses.indexOf('Listo para recoger')) {
      this.showOnHoldButton = false;
    }

    const onHoldHistory = this.itemOrderService.history.find((h) => h.status === 'En espera');
    if (onHoldHistory && currentIndex >= statuses.indexOf('Aprobado')) {
      this.showCancelButton = false;
    }
  }

  closeForm() {
    this.showForm.emit('table');
  }

  openDialog(type: string) {
    let text = '';
    let widthActual = '700px';
    let heightActual = '400px';
    let form = {
      comments: '',
      rollback: false,
      cancel: false,
      onHold: false,
    };
    if (type === 'onHold') {
      text =
        'Estás a punto de poner en espera esta orden de servicio. Esto impedirá que la orden pueda continuar con su flujo momentáneamente. Por favor, introduce comentarios explicando las razones.';
      form.onHold = true;
    } else if (type === 'cancel') {
      text =
        'Estás a punto de cancelar esta orden de servicio. Esto impedirá que la orden pueda continuar con su flujo. Por favor, introduce comentarios explicando las razones.';
      form.cancel = true;
    } else if (type === 'rollback') {
      text =
        'Estás a punto de revertir el estatus actual de la orden de servicio. Eso regresará la orden de servicio a su penúltimo estatus activo. ¿Deseas continuar?';
      form.rollback = true;
      widthActual = '450px';
      heightActual = '300px';
    } else if (type === 'continue') {
      widthActual = '450px';
      heightActual = '300px';
      text = 'La orden actual se encuentra en espera. ¿Deseas continuar con el flujo?';
    }

    const dialogRef = this.dialog.open(changeStatusOrderComponent, {
      width: widthActual,
      height: heightActual,
      data: { text, form, type, id: this.itemOrderService.id },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data = result.data.history;
        this.resetValueShowButton();
        this.evaluateButtonVisibility(result.data.actualStatus);
      }
    });
  }
}
