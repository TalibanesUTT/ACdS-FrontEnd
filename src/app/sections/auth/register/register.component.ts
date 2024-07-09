import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SweetAlert } from '../../../shared/SweetAlert';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class registerComponent {
  title = 'acds-frontend';
  registerForm: FormGroup;
  passwordNotMatch = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.newFormControls();
  }

  newFormControls(): FormGroup {
    return this.fb.group(
      {
        name: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑs]+$'),
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑs]+$'),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$'
            ),
          ],
        ],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]{3}-[0-9]{3}-[0-9]{4}$'),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d!@#$%^&*()_+]{8,}$'
            ),
          ],
        ],
        passwordConfirmation: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d!@#$%^&*()_+]{8,}$'
            ),
          ],
        ],
      },
      { validators: this.validatorMatchPassword } // Aplica el validador personalizado aquí
    );
  }

  validatorMatchPassword: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('passwordConfirmation');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordsMismatch: true };
  };

  onSubmit(): void {
    let newPhone = this.DeleteMiddleDash(this.registerForm.value.phone);
    this.registerForm.value.phone = newPhone;
    console.log(this.registerForm.value);
    if (!this.registerForm.valid) {
      SweetAlert.info('Error', 'Por favor, revisa los campos');
      return;
    }
    if (this.registerForm.hasError('passwordsMismatch')) {
      SweetAlert.error('Error', 'Las contraseñas no coinciden');
      this.passwordNotMatch = true;
      return;
    }
    this.passwordNotMatch = false;
    this.authService.register(this.registerForm.value).subscribe(
      (response) => {
        console.log(response);
        localStorage.setItem('url', response.url);
        localStorage.setItem('user', JSON.stringify(response.data));
        this.router.navigate(['/verifyEmail']);
        // console.log(response);
      },
      (error) => {
        // console.error(error);
        SweetAlert.error('Error', error.error.message);
      }
    );
  }

  onPhoneFormat(event: any): void {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 10) {
      input = input.slice(0, 10);
    }
    input = input.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    event.target.value = input;
    this.registerForm.get('phone')?.setValue(input, { emitWidget: false });
  }

  DeleteMiddleDash(text: string): string {
    return text.replace(/-/g, '');
  }
}
