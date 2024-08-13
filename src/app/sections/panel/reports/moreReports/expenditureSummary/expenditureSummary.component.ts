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
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlEspañol }],
  templateUrl: './expenditureSummary.component.html',
  styleUrls: ['./expenditureSummary.component.css'],
})
export class expenditureSummaryComponent {
  formAccountingBalance: FormGroup;
  isMonthlySelected = false;
  isAnnualSelected = false;

  formFields = [
    { name: 'TotalSpareParts', label: 'Total refacciones' },
    // { name: 'AverageExpenditurePerMonth', label: 'Total gasto promedio por mes' },
    { name: 'TotalPayroll', label: 'Total nómina' },
    { name: 'TotalCleaning', label: 'Total limpieza' },
    { name: 'TotalWater', label: 'Total agua' },
    { name: 'TotalElectricity', label: 'Total electricidad' },
    { name: 'TotalRadios', label: 'Total radios' },
    { name: 'TotalPettyCash', label: 'Total caja chica' },
    { name: 'TotalVacation', label: 'Total vacaciones' },
    { name: 'TotalInsurancePolicies', label: 'Total pólizas de seguro' },
    { name: 'TotalChristmasBonusFund', label: 'Total fondo de aguinaldos' },
    { name: 'TotalVehicleRepairService', label: 'Total reparaciones de vehículos' },
    { name: 'TotalWorkshopMaintenance', label: 'Total mantenimiento del taller' },
    { name: 'TotalOfficeEquipment', label: 'Total equipo de oficina' },
    { name: 'TotalAdministrativeServices', label: 'Total servicios administrativos' },
    { name: 'TotalTaxPayments', label: 'Total pagos de impuestos' },
    { name: 'TotalWorkshopRents', label: 'Total rentas del taller' },
    { name: 'TotalSponsorshipAdvertising', label: 'Total publicidad y patrocinios' },
    { name: 'TotalWorkshopMaterialsTools', label: 'Total materiales y herramientas del taller' },
    { name: 'TotalGasolineVouchers', label: 'Total vales de gasolina' },
    { name: 'TotalSettlement', label: 'Total liquidación' },
    { name: 'TotalUniforms', label: 'Total uniformes' },
    { name: 'TotalOthers', label: 'Total otros gastos ' },

    // { name: 'TotalExpenditure', label: 'Egresos totales' },
    // { name: 'AverageExpenditurePerDay', label: 'Gasto promedio por día' },
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
      AverageExpenditurePerMonth: [''],
      TotalExpenditure: [''],
      AverageExpenditurePerDay: [''],

      TotalAdministrativeServices: [''],
      TotalChristmasBonusFund: [''],
      TotalCleaning: [''],
      TotalElectricity: [''],
      TotalGasolineVouchers: [''],
      TotalInsurancePolicies: [''],
      TotalOfficeEquipment: [''],
      TotalOthers: [''],
      TotalPayroll: [''],
      TotalPettyCash: [''],
      TotalRadios: [''],
      TotalSettlement: [''],
      TotalSpareParts: [''],
      TotalSponsorshipAdvertising: [''],
      TotalTaxPayments: [''],
      TotalUniforms: [''],
      TotalVacation: [''],
      TotalVehicleRepairService: [''],
      TotalWater: [''],
      TotalWorkshopMaintenance: [''],
      TotalWorkshopMaterialsTools: [''],
      TotalWorkshopRents: [''],
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
      const input = $event.target as HTMLInputElement;
      if (input.value.length > 4) {
        input.value = input.value.slice(0, 4); // Limita el valor a los primeros 4 dígitos
        this.formAccountingBalance.patchValue({ yearOnly: input.value });
      }
      console.log($event.target.value);
      this.reportService.getExpenditureSummary(this.formAccountingBalance.value.yearOnly).subscribe((data) => {
        console.log(data[0][0]);
        this.formAccountingBalance.patchValue({
          AverageExpenditurePerDay: data[0][0].AverageExpenditurePerDay || 0,
          AverageExpenditurePerMonth: data[0][0].AverageExpenditurePerMonth || 0,
          TotalAdministrativeServices: data[0][0].TotalAdministrativeServices || 0,
          TotalChristmasBonusFund: data[0][0].TotalChristmasBonusFund || 0,
          TotalCleaning: data[0][0].TotalCleaning || 0,
          TotalElectricity: data[0][0].TotalElectricity || 0,
          TotalExpenditure: data[0][0].TotalExpenditure || 0,
          TotalGasolineVouchers: data[0][0].TotalGasolineVouchers || 0,
          TotalInsurancePolicies: data[0][0].TotalInsurancePolicies || 0,
          TotalOfficeEquipment: data[0][0].TotalOfficeEquipment || 0,
          TotalOthers: data[0][0].TotalOthers || 0,
          TotalPayroll: data[0][0].TotalPayroll || 0,
          TotalPettyCash: data[0][0].TotalPettyCash || 0,
          TotalRadios: data[0][0].TotalRadios || 0,
          TotalSettlement: data[0][0].TotalSettlement || 0,
          TotalSpareParts: data[0][0].TotalSpareParts || 0,
          TotalSponsorshipAdvertising: data[0][0].TotalSponsorshipAdvertising || 0,
          TotalTaxPayments: data[0][0].TotalTaxPayments || 0,
          TotalUniforms: data[0][0].TotalUniforms || 0,
          TotalVacation: data[0][0].TotalVacation || 0,
          TotalVehicleRepairService: data[0][0].TotalVehicleRepairService || 0,
          TotalWater: data[0][0].TotalWater || 0,
          TotalWorkshopMaintenance: data[0][0].TotalWorkshopMaintenance || 0,
          TotalWorkshopMaterialsTools: data[0][0].TotalWorkshopMaterialsTools || 0,
          TotalWorkshopRents: data[0][0].TotalWorkshopRents || 0,
        });
      });
    }
    if (this.formAccountingBalance.value.period === 'mensual') {
      let month = this.formAccountingBalance.value.both.split('-')[1];
      let year = this.formAccountingBalance.value.both.split('-')[0];
      console.log(year, month);
      this.reportService.getExpenditureSummary(year, month).subscribe((data) => {
        console.log(data[0][0]);
        this.formAccountingBalance.patchValue({
          AverageExpenditurePerDay: data[0][0].AverageExpenditurePerDay || 0,
          AverageExpenditurePerMonth: data[0][0].AverageExpenditurePerMonth || 0,
          TotalAdministrativeServices: data[0][0].TotalAdministrativeServices || 0,
          TotalChristmasBonusFund: data[0][0].TotalChristmasBonusFund || 0,
          TotalCleaning: data[0][0].TotalCleaning || 0,
          TotalElectricity: data[0][0].TotalElectricity || 0,
          TotalExpenditure: data[0][0].TotalExpenditure || 0,
          TotalGasolineVouchers: data[0][0].TotalGasolineVouchers || 0,
          TotalInsurancePolicies: data[0][0].TotalInsurancePolicies || 0,
          TotalOfficeEquipment: data[0][0].TotalOfficeEquipment || 0,
          TotalOthers: data[0][0].TotalOthers || 0,
          TotalPayroll: data[0][0].TotalPayroll || 0,
          TotalPettyCash: data[0][0].TotalPettyCash || 0,
          TotalRadios: data[0][0].TotalRadios || 0,
          TotalSettlement: data[0][0].TotalSettlement || 0,
          TotalSpareParts: data[0][0].TotalSpareParts || 0,
          TotalSponsorshipAdvertising: data[0][0].TotalSponsorshipAdvertising || 0,
          TotalTaxPayments: data[0][0].TotalTaxPayments || 0,
          TotalUniforms: data[0][0].TotalUniforms || 0,
          TotalVacation: data[0][0].TotalVacation || 0,
          TotalVehicleRepairService: data[0][0].TotalVehicleRepairService || 0,
          TotalWater: data[0][0].TotalWater || 0,
          TotalWorkshopMaintenance: data[0][0].TotalWorkshopMaintenance || 0,
          TotalWorkshopMaterialsTools: data[0][0].TotalWorkshopMaterialsTools || 0,
          TotalWorkshopRents: data[0][0].TotalWorkshopRents || 0,
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
