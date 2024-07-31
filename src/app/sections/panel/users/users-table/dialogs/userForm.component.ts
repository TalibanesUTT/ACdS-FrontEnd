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
import { UsersService } from '../../../../../services/users.service';
import { SweetAlert } from '../../../../../shared/SweetAlert';

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
  templateUrl: './userForm.component.html',
  styleUrls: ['./userForm.component.css'],
})
export class userFormComponent {
  Roles: any[] = [
    { value: 'admin', viewValue: 'Admin' },
    { value: 'customer', viewValue: 'Cliente' },
    { value: 'mechanic', viewValue: 'Mecanico' },
    { value: 'root', viewValue: 'Root' },
  ];
  isDisabled: boolean = false;
  title = 'acds-frontend';
  form: FormGroup;
  textButton = '';
  updateURL = '';
  readonly dialogRef = inject(MatDialogRef<userFormComponent>);
  data = inject(MAT_DIALOG_DATA);
  constructor(
    private formBuilder: FormBuilder,
    private userService: UsersService
  ) {
    console.log(this.data);
    if (this.data.action === 'edit') {
      this.textButton = 'Editar';
    } else {
      this.textButton = 'Agregar';
    }
    this.updateURL = this.data.item.updateURL;
    this.form = this.formBuilder.group({
      name: [this.data.item.name, Validators.required],
      lastName: [this.data.item.lastName, Validators.required],
      email: [this.data.item.email, Validators.required],
      phoneNumber: [this.data.item.phoneNumber, Validators.required],
      role: [this.data.item.role, Validators.required],
      active: [this.data.item.active, Validators.required],
    });
  }

  submit() {
    this.userService.updateUser(this.form.value, this.updateURL).subscribe(
      (data) => {
        SweetAlert.success('Exito', data.message);
        this.closeDialog();
      },
      (error) => {
        SweetAlert.error('Error', error.error.message);
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
