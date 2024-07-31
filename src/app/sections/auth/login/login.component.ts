import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SweetAlert } from '../../../shared/SweetAlert';
import { AuthService } from '../../../services/auth.service';
import { CustomValidators } from '../../../shared/validation';

@Component({
  selector: 'app-login',
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
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
      email: ['', [Validators.required, CustomValidators.emailPattern]],
      password: ['', [Validators.required, CustomValidators.passwordPattern]],
    });
  }
  login(): void {
    if (!this.loginForm.valid) {
      SweetAlert.info('Error', 'Por favor, revisa los campos');
      return;
    }
    this.authService.login(this.loginForm.value).subscribe(
      (res) => {
        console.log('login', res);
        localStorage.setItem('user', JSON.stringify(res.data) || '');
        if (res.data.role === 'admin' || res.data.role === 'root') {
          localStorage.setItem('url', res.url || '');
          this.router.navigate(['/secondFactor']);
          return;
        }
        localStorage.setItem('token', res.data || '');
        this.router.navigate(['/home/dashboard']);
      },
      (err) => {
        SweetAlert.error('Error', err.error.error.message);
      }
    );
  }
}
