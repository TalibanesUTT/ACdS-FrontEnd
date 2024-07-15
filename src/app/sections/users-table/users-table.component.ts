import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsersService } from '../../services/users.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from './confirm-dialog.component';
import { ActiveDialog } from './active-dialog.component';

@Component({
  selector: 'app-users-table',
  styleUrl: 'users-table.component.css',
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
  ],
})
export class UsersTableComponent implements AfterViewInit {
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
    {
      value: 3,
      viewValue: 'admin',
    },
    {
      value: 1,
      viewValue: 'customer',
    },
    {
      value: 4,
      viewValue: 'mechanic',
    },
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
    this.usersService.getAllUsers().subscribe((data: UserInterface[]) => {
      data.map((user: UserInterface) => {
        user.isEditing = false;
      });
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
}

export interface UserInterface {
  id: number;
  name: string;
  lastName: string;
  phone: number;
  email: string;
  role: string;
  updateURL: string;
  active: boolean;
  phoneConfirmed: boolean;
  emailConfirmed: boolean;
  isEditing: boolean;
}
