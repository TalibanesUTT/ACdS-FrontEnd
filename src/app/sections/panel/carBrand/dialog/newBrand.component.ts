import { AfterViewInit, Component, ViewChild } from '@angular/core';
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
  Validators,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { startWith, map, filter } from 'rxjs/operators';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeDetectionStrategy, inject, model, signal } from '@angular/core';
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
import { CarBrandsService } from '../../../../services/carBrands.service';
import { SweetAlert } from '../../../../shared/SweetAlert';

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
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './newBrand.component.html',
  styleUrls: ['./newBrand.component.css'],
})
export class newBrandComponent {
  isDisabled: boolean = false;
  title = 'acds-frontend';
  form: FormGroup;
  textButton = '';
  readonly dialogRef = inject(MatDialogRef<newBrandComponent>);
  data = inject(MAT_DIALOG_DATA);

  constructor(private carBrandsService: CarBrandsService) {
    console.log('recived data: ', this.data);
    if (this.data.action === 'edit') {
      console.log('Se va a editar');
      this.textButton = 'Editar';
      this.form = new FormBuilder().group({
        name: [this.data.item.name, [Validators.required]],
      });
    } else {
      console.log('Se va a agregar');
      this.isDisabled = true;
      this.textButton = 'Agregar';
      this.form = new FormBuilder().group({
        name: ['', [Validators.required]],
      });
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  addBrand() {
    if (this.data.action === 'add') {
      this.carBrandsService.postCarBrand(this.form.value).subscribe(
        (res) => {
          SweetAlert.success('Exito', res.message);
          this.dialogRef.close();
        },
        (err) => {
          console.log(err);
          SweetAlert.error('Error', err.error.message);
        }
      );
      return;
    }
    this.carBrandsService
      .putCarBrand(this.form.value, this.data.item.id)
      .subscribe(
        (res) => {
          SweetAlert.success('Exito', res.message);
          this.dialogRef.close();
        },
        (err) => {
          console.log(err);
          SweetAlert.error('Error', err.error.message);
        }
      );
  }

  validateInput() {
    if (this.form.value.name !== '') {
      this.isDisabled = false;
      return;
    }
    this.isDisabled = true;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
