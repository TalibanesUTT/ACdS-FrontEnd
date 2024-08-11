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
import { ServiceOrdersService } from '../../../../../services/serviceOrders.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
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
  templateUrl: './changeStatusOrder.component.html',
  styleUrls: ['./changeStatusOrder.component.css'],
})
export class changeStatusOrderComponent {
  isDisabled: boolean = false;
  title = 'acds-frontend';
  formChangeStatus!: FormGroup;
  textButton = '';
  dataResponse: any;
  readonly dialogRef = inject(MatDialogRef<changeStatusOrderComponent>);
  data = inject(MAT_DIALOG_DATA);
  constructor(private fb: FormBuilder, private serviceOrdersService: ServiceOrdersService) {
    this.formChangeStatus = this.newForm();
    this.formChangeStatus.patchValue(this.data.form);
  }
  newForm(): FormGroup {
    return (this.formChangeStatus = this.fb.group({
      comments: [''],
      rollback: [false],
      cancel: [false],
      onHold: [false],
    }));
  }
  sendForm() {
    // if (this.data.form.status === 'rollback' || this.data.form.status === 'continue') {
    //   delete this.formChangeStatus.value.com;
    // }
    this.serviceOrdersService.postUpdateStatus(this.formChangeStatus.value, this.data.id).subscribe(
      (res) => {
        SweetAlert.success('success', res.message);
        this.dataResponse = res;
        this.closeDialog();
      },
      (err) => {
        SweetAlert.error('error', err.error.error.message);
      }
    );
  }
  closeDialog() {
    this.dialogRef.close(this.dataResponse);
  }
}
