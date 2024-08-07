import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { formVehiclesComponent } from './components/formVehicles/formVehicles.component';
import { MatPaginatorIntlEspañol } from '../../../shared/MatPaginatorIntl';
import { tableVehiclesComponent } from './components/tableVehicles/tableVehicles.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-vehicles',
  styleUrls: ['vehicles.component.css'],
  templateUrl: 'vehicles.component.html',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatFormField,
    FormsModule,
    NgIf,
    NgFor,
    MatSlideToggle,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatLabel,
    MatInputModule,
    MatSelectModule,
    tableVehiclesComponent,
    formVehiclesComponent,
    CommonModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlEspañol }],
})
export class vehiclesComponent {
  showTable = true;
  dataVehicle: any;
}
