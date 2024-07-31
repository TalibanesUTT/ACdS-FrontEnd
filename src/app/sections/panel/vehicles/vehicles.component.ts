import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { startWith, map } from 'rxjs/operators';
import { CustomersService } from '../../../services/customers.service';
import { IUser } from '../../../interfaces/Users';
import { vehiclesFormComponent } from './dialogs/vehiclesForm.component';
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
  ],
})
export class vehiclesComponent implements AfterViewInit {
  form: FormGroup;
  displayedColumns: string[] = ['name', 'email', 'phone', 'role', 'phoneConfirmed', 'emailConfirmed', 'active', 'actions'];
  readonly dialog = inject(MatDialog);
  readonly activeDialog = inject(MatDialog);

  dataSource = new MatTableDataSource<IUser>();
  updateURL = '';
  user = JSON.parse(localStorage.getItem('user') || '{}');
  roles = [
    { value: 'admin', viewValue: 'Admin' },
    { value: 'customer', viewValue: 'Cliente' },
    { value: 'mechanic', viewValue: 'Mecanico' },
    { value: 'root', viewValue: 'Root' },
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(private customerService: CustomersService, private fb: FormBuilder) {
    this.getAllCustomers();
    this.form = this.newFormControls();
    this.setupFilter();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  getAllCustomers() {
    this.customerService.getAllCustomers().subscribe((res) => {
      console.log(res);
      this.dataSource.data = res.data;
    });
  }
  newFormControls(): FormGroup {
    return this.fb.group({
      myControl: [''],
      filter: ['all'],
      role: ['all'],
      status: ['all'],
    });
  }

  setupFilter() {
    this.form.valueChanges
      .pipe(
        startWith({ myControl: '', filter: 'all', role: 'all', status: 'all' }),
        map((value) => this.filterData(value))
      )
      .subscribe();
  }

  filterData(value: any) {
    const filterValue = value.myControl ? value.myControl.trim().toLowerCase() : '';
    this.dataSource.filterPredicate = (data: IUser, filter: string) => {
      console.log(data);
      const matchFilter = [];
      const searchTerms = JSON.parse(filter);

      if (searchTerms.filter && searchTerms.myControl) {
        const searchValue = searchTerms.myControl.toLowerCase();
        switch (searchTerms.filter) {
          case 'name':
            matchFilter.push(`${data.name} ${data.lastName}`.toLowerCase().includes(searchValue));
            break;
          case 'email':
            matchFilter.push(data.email && data.email.toLowerCase().includes(searchValue));
            break;
          case 'phone':
            matchFilter.push(data.phoneNumber ? data.phoneNumber.toString().includes(searchValue) : false);
            break;
        }
      }

      if (searchTerms.role && searchTerms.role !== 'all') {
        matchFilter.push(data.role === searchTerms.role);
      }

      if (searchTerms.status && searchTerms.status !== 'all') {
        const isActive = searchTerms.status === 'active' ? true : false;
        matchFilter.push(data.active === isActive);
      }

      return matchFilter.every(Boolean);
    };

    this.dataSource.filter = JSON.stringify({
      ...value,
      myControl: filterValue,
    });
  }

  resetFilters() {
    this.form.reset({
      myControl: '',
      filter: 'all',
      role: 'all',
      status: 'all',
    });

    // Actualiza el filtro de la tabla después de restablecer el formulario
    this.dataSource.filter = JSON.stringify({
      myControl: '',
      filter: 'all',
      role: 'all',
      status: 'all',
    });

    // Opcional: también puedes forzar la actualización llamando a `setupFilter` de nuevo
    this.setupFilter();
  }

  openDialog(item: any, action: string) {
    console.log(item);
    const dialogRef = this.dialog.open(vehiclesFormComponent, {
      width: '500px',
      height: '500px',
      data: { item, action },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getAllCustomers();
    });
  }
}
