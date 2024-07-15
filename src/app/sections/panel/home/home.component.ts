import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SweetAlert } from '../../../shared/SweetAlert';
import { AuthService } from '../../../services/auth.service';
import { headerComponent } from '../../../components/header/header.component';
import { sideBarComponent } from '../../../components/sidebar/sideBar.component';
import { UsersTableComponent } from '../../users-table/users-table.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatFormField,
    MatInputModule,
    MatLabel,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
    headerComponent,
    sideBarComponent,
    UsersTableComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {
  title = 'acds-frontend';
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.newFormControls();
  }

  newFormControls(): FormGroup {
    return this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        ],
      ],
    });
  }
  login(): void {
    if (!this.loginForm.valid) {
      SweetAlert.info('Error', 'Por favor, revisa los campos');
      return;
    }
    this.authService.login(this.loginForm.value).subscribe(
      (res) => {
        SweetAlert.success('Exito', 'Inicio de sesion exitoso');
        this.router.navigate(['/home']);
      },
      (err) => {
        SweetAlert.error('Error', err.error.message);
      }
    );
  }
}
