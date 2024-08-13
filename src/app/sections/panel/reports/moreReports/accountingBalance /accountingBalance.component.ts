import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatPaginatorIntlEspañol } from '../../../../../shared/MatPaginatorIntl';
import { DatePipe } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { RouterOutlet } from '@angular/router';
import { ReportService } from '../../../../../services/reports.service';
import moment, { Moment } from 'moment';

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'MM/YYYY', // Para seleccionar Mes y Año
//   },
//   display: {
//     dateInput: 'MM/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };
// export const MY_FORMATS_YEAR_ONLY = {
//   parse: {
//     dateInput: 'YYYY', // Para seleccionar solo el Año
//   },
//   display: {
//     dateInput: 'YYYY',
//     monthYearLabel: 'YYYY',
//     dateA11yLabel: 'YYYY',
//     monthYearA11yLabel: 'YYYY',
//   },
// };
@Component({
  selector: 'app-orderService',
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
    RouterOutlet,
    RouterLink,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlEspañol },
    // O puedes cambiarlo al formato solo Año para el campo correspondiente
  ],
  templateUrl: './accountingBalance.component.html',
  styleUrls: ['./accountingBalance.component.css'],
})
export class accountingBalanceComponent {
  formAccountingBalance: FormGroup;
  isMonthlySelected = false;
  isAnnualSelected = false;

  formFields = [
    { name: 'TotalIncomes', label: 'Ingresos totales' },
    { name: 'AverageIncomePerDay', label: 'Ingreso promedio por día' },
    { name: 'AverageExpenditurePerMonth', label: 'Gasto promedio por mes' },
    { name: 'TotalExpenditure', label: 'Egresos totales' },
    { name: 'AverageExpenditurePerDay', label: 'Gasto promedio por día' },
    { name: 'AverageIncomePerMonth', label: 'Ingreso promedio por mes' },
    { name: 'Profit', label: 'Utilidad' },
  ];

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.formAccountingBalance = this.newForm();
  }

  ngOnInit(): void {
    this.formAccountingBalance.get('period')?.valueChanges.subscribe((value) => {
      this.updateFormFields(value);
    });
  }

  newForm() {
    return this.fb.group({
      period: [''],
      both: [{ value: '', disabled: true }],
      yearOnly: [{ value: '', disabled: true }],
      AverageExpenditurePerDay: [''],
      AverageExpenditurePerMonth: [''], // Asegúrate de que esto esté aquí
      AverageIncomePerDay: [''],
      AverageIncomePerMonth: [''],
      Profit: [''],
      TotalExpenditure: [''],
      TotalIncomes: [''],
    });
  }

  updateFormFields(period: string) {
    this.isMonthlySelected = period === 'mensual';
    this.isAnnualSelected = period === 'anual';

    if (this.isMonthlySelected) {
      this.formAccountingBalance.get('both')?.enable();
      this.formAccountingBalance.get('yearOnly')?.disable();
    } else if (this.isAnnualSelected) {
      this.formAccountingBalance.get('both')?.disable();
      this.formAccountingBalance.get('yearOnly')?.enable();
    } else {
      this.formAccountingBalance.get('both')?.disable();
      this.formAccountingBalance.get('yearOnly')?.disable();
    }
  }
  onPeriodChange(event: any) {
    console.log(event);

    // Limpiar los campos de los inputs cuando se cambia el período
    this.formAccountingBalance.reset({
      period: event.value,
      both: '', // Restablece el campo "both" (mes y año)
      yearOnly: '', // Restablece el campo "yearOnly" (año)
      AverageExpenditurePerDay: '',
      AverageExpenditurePerMonth: '',
      AverageIncomePerDay: '',
      AverageIncomePerMonth: '',
      Profit: '',
      TotalExpenditure: '',
      TotalIncomes: '',
    });

    // Actualiza los campos visibles de acuerdo al período seleccionado
    this.isMonthlySelected = event.value === 'mensual';
    this.isAnnualSelected = event.value === 'anual';

    if (this.isMonthlySelected) {
      this.formAccountingBalance.get('both')?.enable();
      this.formAccountingBalance.get('yearOnly')?.disable();
    } else if (this.isAnnualSelected) {
      this.formAccountingBalance.get('both')?.disable();
      this.formAccountingBalance.get('yearOnly')?.enable();
    } else {
      this.formAccountingBalance.get('both')?.disable();
      this.formAccountingBalance.get('yearOnly')?.disable();
    }
  }

  viewLog() {
    console.log(this.formAccountingBalance.value);
  }

  aplicateService($event: any) {
    console.log(this.formAccountingBalance.value);
    if (this.formAccountingBalance.value.period === 'anual') {
      this.reportService.getAccountingBalance(this.formAccountingBalance.value.yearOnly).subscribe((data) => {
        console.log(data[0][0]);
        this.formAccountingBalance.patchValue({
          AverageExpenditurePerDay: data[0][0].AverageExpenditurePerDay || 0,
          AverageExpenditurePerMonth: data[0][0].AverageExpenditurePerMonth || 0,
          AverageIncomePerDay: data[0][0].AverageIncomePerDay || 0,
          AverageIncomePerMonth: data[0][0].AverageIncomePerMonth || 0,
          Profit: data[0][0].Profit || 0,
          TotalExpenditure: data[0][0].TotalExpenditure || 0,
          TotalIncomes: data[0][0].TotalIncomes || 0,
        });
      });
    }
    if (this.formAccountingBalance.value.period === 'mensual') {
      let month = this.formAccountingBalance.value.both.split('-')[1];
      let year = this.formAccountingBalance.value.both.split('-')[0];
      console.log(year, month);
      this.reportService.getAccountingBalance(year, month).subscribe((data) => {
        console.log(data[0][0]);
        this.formAccountingBalance.patchValue({
          AverageExpenditurePerDay: data[0][0].AverageExpenditurePerDay || 0,
          AverageExpenditurePerMonth: data[0][0].AverageExpenditurePerMonth || 0,
          AverageIncomePerDay: data[0][0].AverageIncomePerDay || 0,
          AverageIncomePerMonth: data[0][0].AverageIncomePerMonth || 0,
          Profit: data[0][0].Profit || 0,
          TotalExpenditure: data[0][0].TotalExpenditure || 0,
          TotalIncomes: data[0][0].TotalIncomes || 0,
        });
      });
    }
  }
  get visibleFormFields() {
    return this.formFields.filter((control) => !(this.isMonthlySelected && control.name === 'AverageExpenditurePerMonth')).length;
  }
  get groupedFormFields() {
    const visibleFields = this.formFields.filter((control) => !(this.isMonthlySelected && control.name === 'AverageExpenditurePerMonth'));
    const groupedFields = [];

    for (let i = 0; i < visibleFields.length; i += 3) {
      groupedFields.push(visibleFields.slice(i, i + 3));
    }

    return groupedFields;
  }
}
