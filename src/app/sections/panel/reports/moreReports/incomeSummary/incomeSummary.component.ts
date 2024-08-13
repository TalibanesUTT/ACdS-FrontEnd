import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDateRangeInput } from '@angular/material/datepicker';
import { RouterOutlet } from '@angular/router';
import { ReportService } from '../../../../../services/reports.service';

@Component({
  selector: 'app-income-summary',
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
    DatePipe, // Añadido aquí para usarlo en el componente
  ],
  templateUrl: './incomeSummary.component.html',
  styleUrls: ['./incomeSummary.component.css'],
})
export class incomeSummaryComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
    'FileNumber',
    'Date',
    'Vehicle',
    'DepartureDate',
    'RepairDays',
    'InitialMileage',
    'FinalMileage',
    'Services',
    'Budget',
    'TotalCost',
  ];
  formAccountingBalance: FormGroup;
  dataSource = new MatTableDataSource();
  totalIncome: number | null = null;
  showIncome: boolean = false;
  AverageIncomePerDay: number | null = null;
  showIncomePerDay: boolean = false;
  AverageIncomePerMonth: number | null = null;
  showIncomePerMonth: boolean = false;

  constructor(private fb: FormBuilder, private reportService: ReportService) {
    this.formAccountingBalance = this.fb.group({
      startDate: [''], // Control para la fecha de inicio
      endDate: [''], // Control para la fecha de fin
    });
  }

  ngOnInit() {
    // Puedes inicializar cualquier lógica adicional aquí si es necesario
  }

  // Este método se llama cada vez que se cambia una fecha en el selector
  onDateChange() {
    const startDate = this.formAccountingBalance.get('startDate')?.value;
    const endDate = this.formAccountingBalance.get('endDate')?.value;

    if (startDate && endDate) {
      this.aplicateService();
    }
  }

  aplicateService() {
    const startDate = new Date(this.formAccountingBalance.get('startDate')?.value);
    const endDate = new Date(this.formAccountingBalance.get('endDate')?.value);

    const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate
      .getDate()
      .toString()
      .padStart(2, '0')}`;
    const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate
      .getDate()
      .toString()
      .padStart(2, '0')}`;

    const differenceInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

    this.reportService.getIncomeSummary(formattedStartDate, formattedEndDate).subscribe((data) => {
      // Si el rango de fechas es mayor a 2 días
      if (differenceInDays <= 2) {
        this.totalIncome = data[1] ? data[1][0].TotalIncome : null;
        this.showIncome = true;
      }
      if (differenceInDays > 2) {
        this.totalIncome = data[1] ? data[1][0].TotalIncome : null;
        this.AverageIncomePerDay = data[2] ? data[2][0].AverageIncomePerDay : null;
        this.showIncome = true;
        this.showIncomePerDay = true;
      }

      // Si el rango de fechas es mayor a 32 días
      if (differenceInDays > 32) {
        this.AverageIncomePerMonth = data[3] ? data[3][0].AverageIncomePerMonth : null;
        this.showIncomePerMonth = true;
      }

      this.dataSource.data = data[0];
      this.dataSource.paginator = this.paginator;
    });
  }
}
