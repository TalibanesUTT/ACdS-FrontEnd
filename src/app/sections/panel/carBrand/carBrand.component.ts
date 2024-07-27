import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { startWith, map, filter } from 'rxjs/operators';
import { CarBrandsService } from '../../../services/carBrands.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SweetAlert } from '../../../shared/SweetAlert';
import { newBrandComponent } from './dialog/newBrand.component';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-carBrand',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTooltipModule,
    MatDialogModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './carBrand.component.html',
  styleUrls: ['./carBrand.component.css'],
})
export class carBrandComponent {
  readonly dialog = inject(MatDialog);
  title = 'acds-frontend';
  formFilter: FormGroup;
  formCarBrand: FormGroup;
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<any>();
  editTableIndex: number | null = null; // Variable para rastrear la fila que se está editando

  constructor(
    private fb: FormBuilder,
    private carBrandsService: CarBrandsService
  ) {
    this.formFilter = this.fb.group({
      myControl: [''],
    });
    this.formCarBrand = this.fb.group({
      name: [''],
    });
    this.getAllCarBrands();

    // Configura el filtro para la tabla
    this.formFilter.get('myControl')!.valueChanges.subscribe((value) => {
      this.applyFilter(value);
    });
  }

  getAllCarBrands() {
    this.carBrandsService.getCardBrands().subscribe(
      (res) => {
        this.dataSource.data = res.data;
        console.log(this.dataSource.data);
      },
      (err) => {}
    );
  }

  editForm(data: any, index: number) {
    if (this.editTableIndex === index) {
      console.log('save');
      this.carBrandsService
        .putCarBrand(this.formCarBrand.value, data.id)
        .subscribe(
          (res) => {
            SweetAlert.success('Exito', res.message);
            this.getAllCarBrands();
          },
          (err) => {
            console.log(err);
            SweetAlert.error('Error', err.error.error.message);
          }
        );
      this.editTableIndex = null; // Resetea el índice después de guardar
    } else {
      console.log('edit', data);
      this.editTableIndex = index; // Establece el índice de la fila que se está editando
      this.formCarBrand.patchValue(data);
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(newBrandComponent, {
      width: '400px',
      height: '200px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getAllCarBrands();
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
