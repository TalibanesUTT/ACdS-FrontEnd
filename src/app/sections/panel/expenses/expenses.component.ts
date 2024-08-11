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
import { JsonPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { ExpenseService } from '../../../services/expenses.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntlEspañol } from '../../../shared/MatPaginatorIntl';
import { MatDatepicker } from '@angular/material/datepicker';
import { SweetAlert } from '../../../shared/SweetAlert';
@Component({
  selector: 'app-expenses',
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
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class expensesComponent {
  formFilterMonthAndYear: FormGroup;
  formExpenditure: FormGroup;
  buttonDisabled = false;
  expenses = [
    { name: 'spareParts', value: 0, nameEspanol: 'Refacciones' },
    { name: 'payroll', value: 0, nameEspanol: 'Nómina' },
    { name: 'cleaning', value: 0, nameEspanol: 'Limpieza' },
    { name: 'water', value: 0, nameEspanol: 'Pago de agua' },
    { name: 'electricity', value: 0, nameEspanol: 'Pago de luz' },
    { name: 'radios', value: 0, nameEspanol: 'Radios' },
    { name: 'telephones', value: 0, nameEspanol: 'Teléfono - internet' },
    { name: 'pettyCash', value: 0, nameEspanol: 'Caja chica' },
    { name: 'vacation', value: 0, nameEspanol: 'Vacaciones' },
    { name: 'insurancePolicies', value: 0, nameEspanol: 'Pólizas de seguros' },
    { name: 'christmasBonusFund', value: 0, nameEspanol: 'Fondo de aguinaldo' },
    { name: 'vehicleRepairService', value: 0, nameEspanol: 'Reparaciones y servicios a vehículos' },
    { name: 'workshopMaintenance', value: 0, nameEspanol: 'Mantenimiento del táller' },
    { name: 'officeEquipment', value: 0, nameEspanol: 'Equipamiento de oficina' },
    { name: 'administrativeServices', value: 0, nameEspanol: 'Servicios administrativos' },
    { name: 'taxPayments', value: 0, nameEspanol: 'Pagos fiscales' },
    { name: 'workshopRents', value: 0, nameEspanol: 'Rentas del táller' },
    { name: 'sponsorshipAdvertising', value: 0, nameEspanol: 'Patrocinio y publicidad' },
    { name: 'workshopMaterialsTools', value: 0, nameEspanol: 'Material y herramientas del táller' },
    { name: 'gasolineVouchers', value: 0, nameEspanol: 'Vales de gasolina' },
    { name: 'settlement', value: 0, nameEspanol: 'Finiquito' },
    { name: 'uniforms', value: 0, nameEspanol: 'Uniformes' },
    { name: 'others', value: 0, nameEspanol: 'Otros' },
  ];
  allMonths = [
    { value: 1, viewValue: 'Enero' },
    { value: 2, viewValue: 'Febrero' },
    { value: 3, viewValue: 'Marzo' },
    { value: 4, viewValue: 'Abril' },
    { value: 5, viewValue: 'Mayo' },
    { value: 6, viewValue: 'Junio' },
    { value: 7, viewValue: 'Julio' },
    { value: 8, viewValue: 'Agosto' },
    { value: 9, viewValue: 'Septiembre' },
    { value: 10, viewValue: 'Octubre' },
    { value: 11, viewValue: 'Noviembre' },
    { value: 12, viewValue: 'Diciembre' },
  ];
  months = [...this.allMonths]; // Inicialmente muestra todos los meses
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;
  years = Array.from({ length: this.currentYear - 1899 }, (_, i) => 1900 + i);

  constructor(private expenseService: ExpenseService, private fb: FormBuilder) {
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    this.getExpenditures(month, year);
    this.formExpenditure = this.newFormControls();
    this.formFilterMonthAndYear = this.newFilterFormControls();

    // Escuchar cambios en el formulario de mes y año
    this.formFilterMonthAndYear.get('month')?.valueChanges.subscribe((month) => {
      const year = this.formFilterMonthAndYear.get('year')?.value;
      this.updateButtonState(month, year);
      if (month && year) {
        this.getExpenditures(month, year);
      }
    });

    this.formFilterMonthAndYear.get('year')?.valueChanges.subscribe((year) => {
      this.filterMonthsByYear(year);
      const month = this.formFilterMonthAndYear.get('month')?.value;
      this.updateButtonState(month, year);
      if (month && year) {
        this.getExpenditures(month, year);
      }
    });
  }

  getExpenditures(month: number, year: number) {
    console.log(month, year);
    this.expenseService.getExpenditures(month, year).subscribe(
      (data) => {
        console.log(data);
        // Asigna los valores de data al formulario de gastos
        this.formExpenditure.patchValue({
          data: data.data.data,
        });
      },
      (error) => {
        // Si no hay gastos para el mes y año seleccionado, se limpian los valores del formulario
        this.formExpenditure.patchValue({
          data: {
            spareParts: '0.00',
            payroll: '0.00',
            cleaning: '0.00',
            water: '0.00',
            electricity: '0.00',
            radios: '0.00',
            telephones: '0.00',
            pettyCash: '0.00',
            vacation: '0.00',
            insurancePolicies: '0.00',
            christmasBonusFund: '0.00',
            vehicleRepairService: '0.00',
            workshopMaintenance: '0.00',
            officeEquipment: '0.00',
            administrativeServices: '0.00',
            taxPayments: '0.00',
            workshopRents: '0.00',
            sponsorshipAdvertising: '0.00',
            workshopMaterialsTools: '0.00',
            gasolineVouchers: '0.00',
            settlement: '0.00',
            uniforms: '0.00',
            others: '0.00',
          },
        });
      }
    );
  }

  newFormControls() {
    return this.fb.group({
      month: [, Validators.required],
      year: [, Validators.required],
      data: this.fb.group({
        spareParts: ['0.00'],
        payroll: ['0.00'],
        cleaning: ['0.00'],
        water: ['0.00'],
        electricity: ['0.00'],
        radios: ['0.00'],
        telephones: ['0.00'],
        pettyCash: ['0.00'],
        vacation: ['0.00'],
        insurancePolicies: ['0.00'],
        christmasBonusFund: ['0.00'],
        vehicleRepairService: ['0.00'],
        workshopMaintenance: ['0.00'],
        officeEquipment: ['0.00'],
        administrativeServices: ['0.00'],
        taxPayments: ['0.00'],
        workshopRents: ['0.00'],
        sponsorshipAdvertising: ['0.00'],
        workshopMaterialsTools: ['0.00'],
        gasolineVouchers: ['0.00'],
        settlement: ['0.00'],
        uniforms: ['0.00'],
        others: ['0.00'],
      }),
    });
  }
  validateMonthAndYear() {
    const month = this.formFilterMonthAndYear.get('month')?.value;
    const year = this.formFilterMonthAndYear.get('year')?.value;

    // Validar que el año esté dentro del rango permitido
    if (!year || year < 1900 || year > this.currentYear) {
      return; // No ejecutar getExpenditures si el año es inválido
    }

    if (year === this.currentYear && month > this.currentMonth) {
      this.formFilterMonthAndYear.get('month')?.setValue(this.currentMonth);
    }

    this.updateButtonState(month, year);

    if (month && year) {
      this.getExpenditures(month, year);
    }
  }

  newFilterFormControls() {
    return this.fb.group({
      month: [this.currentMonth, Validators.required],
      year: [this.currentYear, [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]], // Añadido validadores min y max dinámicos
    });
  }
  onYearInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 4) {
      input.value = input.value.slice(0, 4);
    }
  }

  updateButtonState(month: number, year: number) {
    this.buttonDisabled = !(month && year);
  }

  onMonthChange() {
    const month = this.formFilterMonthAndYear.get('month')?.value;
    const year = this.formFilterMonthAndYear.get('year')?.value;
    if (month && year) {
      this.getExpenditures(month, year);
    }
  }

  sendForm() {
    const formExpenditureValues = this.formExpenditure.value;
    const formFilterValues = this.formFilterMonthAndYear.value;

    formExpenditureValues.month = Number(formFilterValues.month);
    formExpenditureValues.year = Number(formFilterValues.year);

    for (let key in formExpenditureValues.data) {
      if (formExpenditureValues.data.hasOwnProperty(key)) {
        formExpenditureValues.data[key] = parseFloat(formExpenditureValues.data[key]);
      }
    }

    this.expenseService.postExpenditure(formExpenditureValues).subscribe(
      (data) => {
        SweetAlert.success('success', data.message);
      },
      (error) => {
        SweetAlert.error('error', error.error.message);
      }
    );
  }
  filterMonthsByYear(year: number) {
    if (year === this.currentYear) {
      // Si el año es el actual, filtra los meses para mostrar solo los actuales y menores
      this.months = this.allMonths.filter((month) => month.value <= this.currentMonth);
    } else {
      // Si no es el año actual, muestra todos los meses
      this.months = [...this.allMonths];
    }
  }
}
