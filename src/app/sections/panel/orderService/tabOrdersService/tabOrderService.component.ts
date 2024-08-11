import { Component, EventEmitter, Input, input, Output, ViewChild } from '@angular/core';
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
import { formOrderServiceComponent } from '../forms/formOrderService/formEditOrderService.component';
import { detailOrderServiceComponent } from '../detailOrderService/detailOrderService.component';
import { historyOrderServiceComponent } from '../historyOrderService/historyOrderService.component';
import { infoOrderServiceComponent } from '../infoOrderService/infoOrderService.component';
@Component({
  selector: 'app-tabOrderService',
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
    formOrderServiceComponent,
    detailOrderServiceComponent,
    historyOrderServiceComponent,
    infoOrderServiceComponent,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlEspañol }],
  templateUrl: './tabOrderService.component.html',
  styleUrls: ['./tabOrderService.component.css'],
})
export class tabOrderServiceComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() itemOrderService!: IOrderService;
  @Input() menuOption!: string;
  @Output() showForm = new EventEmitter<string>();

  // Método para manejar el evento emitido por el componente hijo
  handleShowForm(event: string) {
    this.showForm.emit(event);
  }

  // Método para cerrar el formulario
  closeForm() {
    this.showForm.emit('table');
  }

  // Método para mostrar formularios
  showForms(showForm: string) {
    this.menuOption = showForm;
  }
}
