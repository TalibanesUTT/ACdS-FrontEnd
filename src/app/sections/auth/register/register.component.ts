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
  FormControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
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
    return this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑs]+$')],
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑs]+$')],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
      phone: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        ],
      ],
      passwordConfirmation: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        ],
      ],
    });
  }

  onSubmit(): void {
    let newPhone = this.DeleteMiddleDash(this.registerForm.value.phone);
    this.registerForm.value.phone = newPhone;
    console.log(this.registerForm.value);
    if (!this.registerForm.valid) {
      SweetAlert.info('Error', 'Por favor, revisa los campos');
      return;
    }
    if (
      this.registerForm.value.password !==
      this.registerForm.value.passwordConfirmation
    ) {
      SweetAlert.error('Error', 'Las contraseñas no coinciden');
      this.passwordNotMatch = true;
      return;
    }
    this.passwordNotMatch = false;
    this.authService.register(this.registerForm.value).subscribe(
      (response) => {
        this.router.navigate(['/login']);
        // console.log(response);
      },
      (error) => {
        // console.error(error);
        SweetAlert.error('Error', error.error.message);
      }
    );
  }
  /**
   * Formats the phone number input value by removing non-digit characters,
   * limiting the length to 10 digits, and adding dashes for better readability.
   * Also updates the value of the 'phone' form control.
   *
   * @param event - The event object representing the input event.
   */
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
