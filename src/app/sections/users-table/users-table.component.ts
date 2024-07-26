import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsersService } from '../../services/users.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from './confirm-dialog.component';
import { ActiveDialog } from './active-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';

import { startWith, map, filter } from 'rxjs/operators';
import { SweetAlert } from '../../shared/SweetAlert';

@Component({
  selector: 'app-users-table',
  styleUrls: ['users-table.component.css'],
  templateUrl: 'users-table.component.html',
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
export class UsersTableComponent implements AfterViewInit {
  form: FormGroup;
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'role',
    'phoneConfirmed',
    'emailConfirmed',
    'active',
    'actions',
  ];
  readonly dialog = inject(MatDialog);
  readonly activeDialog = inject(MatDialog);

  dataSource = new MatTableDataSource<UserInterface>();
  usersService: UsersService;
  roles = [
    { value: 'admin', viewValue: 'Admin' },
    { value: 'customer', viewValue: 'Cliente' },
    { value: 'mechanic', viewValue: 'Mecanico' },
    { value: 'root', viewValue: 'Root' },
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(usersService: UsersService, private fb: FormBuilder) {
    this.usersService = usersService;
    this.usersService.getAllUsers().subscribe((data: any) => {
      console.log(data);

      data.data.map((user: UserInterface) => {
        user.isEditing = false;
      });
      this.dataSource.data = data.data;
    });
    this.form = this.newFormControls();
    this.setupFilter();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  newFormControls(): FormGroup {
    return this.fb.group({
      myControl: [''],
      filter: [''],
      role: [''],
      status: [''],
    });
  }

  setupFilter() {
    this.form.valueChanges
      .pipe(
        startWith({ myControl: '', filter: '', role: '', status: '' }),
        map((value) => this.filterData(value))
      )
      .subscribe();
  }

  filterData(value: any) {
    const filterValue = value.myControl
      ? value.myControl.trim().toLowerCase()
      : '';
    const filterField = value.filter;
    const roleFilter = value.role;
    const statusFilter = value.status;

    this.dataSource.filterPredicate = (data: UserInterface, filter: string) => {
      const matchFilter = [];
      const searchTerms = JSON.parse(filter);

      if (searchTerms.filter && searchTerms.myControl) {
        const searchValue = searchTerms.myControl.toLowerCase();
        switch (searchTerms.filter) {
          case 'name':
            matchFilter.push(
              `${data.name} ${data.lastName}`
                .toLowerCase()
                .includes(searchValue)
            );
            break;
          case 'email':
            matchFilter.push(data.email.toLowerCase().includes(searchValue));
            break;
        }
      }

      if (searchTerms.role) {
        matchFilter.push(data.role === searchTerms.role);
      }

      if (searchTerms.status) {
        const isActive = searchTerms.status === 'one' ? true : false;
        matchFilter.push(data.active === isActive);
      }

      return matchFilter.every(Boolean);
    };

    this.dataSource.filter = JSON.stringify({
      ...value,
      myControl: filterValue,
    });
  }

  editUser(id: number) {
    const user = this.dataSource.data.find(
      (user: UserInterface) => user.id === id
    );
    if (user) {
      user.isEditing = true;
    }
  }

  updateUser(id: number) {
    const user = this.dataSource.data.find(
      (user: UserInterface) => user.id === id
    );
    if (user) {
      user.isEditing = false;
      const userToSend = {
        name: user.name,
        lastName: user.lastName,
        phoneNumber: user.phone,
        email: user.email,
        role: user.role,
        active: user.active,
      };

      this.usersService.updateUser(user.updateURL, userToSend).subscribe();
      SweetAlert.success('¡Éxito!', 'Usuario actualizado correctamente');
    }
  }

  cancelEdit(id: number) {
    const user = this.dataSource.data.find(
      (user: UserInterface) => user.id === id
    );
    if (user) {
      user.isEditing = false;
    }
  }

  openDialog(id: number) {
    const dialog = this.dialog.open(ConfirmDialog);

    dialog.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.updateUser(id);
      }
    });
  }

  toggleActive(id: number) {
    const user = this.dataSource.data.find(
      (user: UserInterface) => user.id === id
    );
    if (user) {
      const dialog = this.activeDialog.open(ActiveDialog);

      dialog.afterClosed().subscribe((result: boolean) => {
        if (result) {
          user.active = !user.active;
          this.updateUser(id);
        }
      });
    }
  }
  resetFilters() {
    this.form.reset({
      myControl: '',
      filter: 'all',
      role: 'all',
      status: 'all',
    });
    this.dataSource.filter = ''; // Restablece el filtro de la tabla
  }
}

export interface UserInterface {
  id: number;
  name: string;
  lastName: string;
  phone: number | null;
  email: string;
  role: string;
  updateURL: string;
  active: boolean;
  phoneConfirmed: boolean;
  emailConfirmed: boolean;
  isEditing: boolean;
}
