import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
import { CommonModule, DatePipe } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { MatPaginatorIntlEspañol } from '../../../../shared/MatPaginatorIntl';
import { IHistory, IOrderService, IService } from '../../../../interfaces/orderService';
import { JsonPipe } from '@angular/common';
import { ServiceOrdersService } from '../../../../services/serviceOrders.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { SweetAlert } from '../../../../shared/SweetAlert';
import { MatTableDataSource } from '@angular/material/table';
import { changeStatusOrderComponent } from '../dialog/changeStatusOrder/changeStatusOrder.component';
import { ProfileService } from '../../../../services/profile.service';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../../../../services/webSocket.service';

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
    CommonModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlEspañol }],
  templateUrl: './historyOrderService.component.html',
  styleUrls: ['./historyOrderService.component.css'],
})
export class historyOrderServiceComponent implements OnInit, OnDestroy{
  private statusUpdateSub: Subscription = new Subscription();
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
  UserData: any = {};
  token = localStorage.getItem('token');

  constructor(
    private orderDetailService: ServiceOrdersService, 
    private profileService: ProfileService,
    private wsService: WebSocketService) {
    this.getProfile();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    if (this.itemOrderService && Array.isArray(this.itemOrderService.history)) {
      this.getHistory();
      this.evaluateButtonVisibility(this.itemOrderService.actualStatus);
      this.getProgressStyles(this.itemOrderService.actualStatus);
    }

    this.statusUpdateSub = this.wsService.onStatusUpdate().subscribe(data => {
      if (this.itemOrderService.id === data.orderId) {
        this.itemOrderService.actualStatus = data.status;
        this.getHistory();
        this.resetValueShowButton();
        this.evaluateButtonVisibility(data.status);
      }
    });
  }

  getHistory() {
    if (this.itemOrderService.id !== undefined) {
      this.orderDetailService.getHistoryStatus(this.itemOrderService.id).subscribe((response) => {
        this.dataSource.data = response.data;
        this.dataSource.paginator = this.paginator;
      });
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

    if (currentStatus === 'Rechazado por el cliente') {
      this.showOnHoldButton = false;
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

  getProgressStyles(status: string) {
    let progress = 0;
    let color = '#e0e0e0'; // Default color

    switch (status) {
      case 'Recibido':
        progress = 10;
        color = '#ADD8E6';
        break;
      case 'En revisión':
        progress = 20;
        color = '#FFFFE0';
        break;
      case 'Emitido':
        progress = 30;
        color = '#90EE90';
        break;
      case 'Aprobado':
        progress = 40;
        color = '#00FF00';
        break;
      case 'En proceso':
        progress = 50;
        color = '#FFA500';
        break;
      case 'En chequeo':
        progress = 60;
        color = '#D3D3D3';
        break;
      case 'Completado':
        progress = 70;
        color = '#0000FF';
        break;
      case 'Listo para recoger':
        progress = 80;
        color = '#006400';
        break;
      case 'Entregado':
        progress = 90;
        color = '#50C878';
        break;
      case 'Finalizado':
        progress = 100;
        color = '#800080';
        break;
      case 'En espera':
        progress = 100;
        color = '#F4A460';
        break;
      case 'Cancelado':
        progress = 100;
        color = '#FF0000';
        break;
    }

    return {
      width: `${progress}%`,
      backgroundColor: color,
    };
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
  }

  ngOnDestroy() {
    this.statusUpdateSub.unsubscribe();
  }
}
