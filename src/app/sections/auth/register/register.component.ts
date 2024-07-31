import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SweetAlert } from '../../../shared/SweetAlert';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CustomValidators } from '../../../shared/validation';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class registerComponent {
  title = 'acds-frontend';
  registerForm: FormGroup;
  passwordNotMatch = false;
  userTemporaly: any;
  userTemporalyExist = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private profileService: ProfileService, private router: Router) {
    const userString = localStorage.getItem('userTemporaly');
    this.userTemporaly = userString ? JSON.parse(userString) : null;
    if (this.userTemporaly) {
      console.log('hay usuario temporal');
      this.userTemporalyExist = true;
      this.userTemporaly.phoneNumber = this.formatPhoneNumber(this.userTemporaly.phoneNumber);
      this.registerForm = this.userTemporalyForm(this.userTemporaly);
      return;
    }
    console.log('no hay usuario temporal');
    this.userTemporalyExist = false;
    this.registerForm = this.newFormControls();
  }

  newFormControls(): FormGroup {
    return this.fb.group(
      {
        name: ['', [Validators.required, CustomValidators.namePattern]],
        lastName: ['', [Validators.required, CustomValidators.namePattern]],
        email: ['', [Validators.required, CustomValidators.emailPattern]],
        phone: ['', [Validators.required, CustomValidators.phonePattern]],
        password: ['', [Validators.required, CustomValidators.passwordPattern]],
        passwordConfirmation: ['', [Validators.required, CustomValidators.passwordPattern]],
      },
      { validators: CustomValidators.validatorMatchPassword } // Aplica el validador personalizado aquí
    );
  }

  userTemporalyForm(user: any): FormGroup {
    return this.fb.group(
      {
        name: [user.name, [Validators.required, CustomValidators.namePattern]],
        lastName: [user.lastName, [Validators.required, CustomValidators.namePattern]],
        email: [user.email, [Validators.required, CustomValidators.emailPattern]],
        phone: [user.phoneNumber, [Validators.required, CustomValidators.phonePattern]],
        password: ['', [Validators.required, CustomValidators.passwordPattern]],
        passwordConfirmation: ['', [Validators.required, CustomValidators.passwordPattern]],
      },
      { validators: CustomValidators.validatorMatchPassword } // Aplica el validador personalizado aquí
    );
  }

  formatPhoneNumber(phone: string): string {
    let cleaned = ('' + phone).replace(/\D/g, '');
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3];
    }
    return phone;
  }

  onSubmit(): void {
    let newPhone = this.DeleteMiddleDash(this.registerForm.value.phone);
    this.registerForm.value.phone = newPhone;
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
        localStorage.setItem('userTemporaly', JSON.stringify(response.data));
        this.router.navigate(['/verifyEmail']);
        SweetAlert.success('Éxito', response.message);
      },
      (error) => {
        console.log(error);
        SweetAlert.error('Error', error.error.error.message);
      }
    );
  }

  updateData(): void {
    let newPhone = this.DeleteMiddleDash(this.registerForm.value.phone);
    this.registerForm.value.phone = newPhone;
    delete this.registerForm.value.phone;
    delete this.registerForm.value.passwordConfirmation;
    this.profileService.putUserTemporaly(this.registerForm.value, this.userTemporaly.id).subscribe(
      (response) => {
        console.log(response);
        delete response.data.role;
        localStorage.setItem('url', response.url);
        localStorage.setItem('user', JSON.stringify(response.data));
        this.router.navigate(['/verifyEmail']);
        SweetAlert.success('Éxito', response.message);
      },
      (error) => {
        console.log(error);
        SweetAlert.error('Error', error.error.error.message);
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
