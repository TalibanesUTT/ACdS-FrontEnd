import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
import { CustomersService } from '../../../../services/customers.service';
import { SweetAlert } from '../../../../shared/SweetAlert';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

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
  templateUrl: './customerForm.component.html',
  styleUrls: ['./customerForm.component.css'],
})
export class CustomerFormComponent {
  isDisabled: boolean = false;
  title = 'acds-frontend';
  form: FormGroup;
  textButton = '';
  updateURL = '';
  action = '';
  userTemporaly: any;
  readonly dialogRef = inject(MatDialogRef<CustomerFormComponent>);
  data = inject(MAT_DIALOG_DATA);

  constructor(private formBuilder: FormBuilder, private customerService: CustomersService, private router: Router, private authService: AuthService) {
    this.userTemporaly = this.data.item;
    this.action = this.data.action;
    if (this.data.action === 'edit') {
      this.textButton = 'Editar';
    } else {
      this.textButton = 'Agregar';
    }
    this.updateURL = this.data.item.updateURL;

    // Inicializa el formulario
    this.form = this.formBuilder.group({
      name: [this.data.item.name, Validators.required],
      lastName: [this.data.item.lastName, Validators.required],
      email: [this.data.item.email, Validators.required],
      phoneNumber: [this.data.item.phoneNumber || '', Validators.required],
      active: [this.data.item.active, Validators.required],
    });

    // Formatea el número de teléfono y actualiza el valor del formulario si no es nulo o indefinido
    const phoneNumber = this.form.get('phoneNumber')?.value;
    if (phoneNumber) {
      const formattedPhoneNumber = this.phoneFormat(phoneNumber);
      this.form.patchValue({
        phoneNumber: formattedPhoneNumber,
      });
    }
  }

  submit() {
    this.form.value.phoneNumber = this.form.value.phoneNumber.replace(/\D/g, '');
    console.log('user', this.form.value);
    console.log('userModify', this.userTemporaly);
    if (this.data.action === 'edit') {
      this.customerService.putCustomer(this.form.value, this.data.item.id).subscribe((res) => {
        SweetAlert.success('Éxito', res.message);
        this.dialogRef.close();
      });
    } else {
      delete this.form.value.active;
      this.customerService.postCustomer(this.form.value).subscribe(
        (res) => {
          this.dialogRef.close();
        },
        (err) => {
          SweetAlert.error('Error', err.error.error.message);
        }
      );
    }
  }

  onPhoneFormat(event: any): void {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 10) {
      input = input.slice(0, 10);
    }
    input = input.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    event.target.value = input;
    this.form.get('phoneNumber')?.setValue(input, { emitWidget: false });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  phoneFormat(number: string) {
    let input = number.replace(/\D/g, '');
    if (input.length > 10) {
      input = input.slice(0, 10);
    }
    input = input.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return input;
  }
}
