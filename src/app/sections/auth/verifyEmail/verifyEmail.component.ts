import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlert } from '../../../shared/SweetAlert';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatFormField, MatInputModule, MatLabel, MatButtonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './verifyEmail.component.html',
  styleUrl: './verifyEmail.component.css',
})
export class verifyEmailComponent {
  title = 'acds-frontend';
  verifyEmailForm: FormGroup;
  sendCode: string = '';
  user = JSON.parse(localStorage.getItem('user') || '{}');
  resendCodeDisabled = true;
  role = this.user.role;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.verifyEmailForm = this.newFormControls();
  }

  newFormControls(): FormGroup {
    return this.fb.group({
      code: ['', [Validators.required]],
    });
  }

  verify(): void {
    const url = localStorage.getItem('url') || '';
    this.sendCode = this.verifyEmailForm.value.code.replace(/-/g, '');
    console.log(this.sendCode);
    this.authService.verifyEmail(url, this.sendCode).subscribe(
      (res) => {
        console.log(res);
        SweetAlert.success('Éxito', res.message);
        localStorage.clear();
        this.router.navigate(['/login']);
      },
      (err) => {
        console.log(err);
        SweetAlert.error('Error', err.error.error.message ? err.error.error.message : 'Error al verificar el código');
      }
    );
  }

  /**
   * Formats the code input by removing non-digit characters and adding dashes for better readability.
   * Limits the input to a maximum of 8 characters.
   * @param event - The event object triggered by the input event.
   */
  onFormatCode(event: any): void {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 6) {
      input = input.slice(0, 6);
    }
    input = input.replace(/(\d{2})(\d{2})?(\d{2})?/, (match: string, p1: string, p2: string, p3: string) => {
      let result = p1;
      if (p2) result += '-' + p2;
      if (p3) result += '-' + p3;
      return result;
    });
    event.target.value = input;
    this.verifyEmailForm.get('code')?.setValue(input, { emitEvent: false });
    this.sendCode = input.replace(/-/g, '');
  }
  resendCode(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const url = localStorage.getItem('url') || '';
    this.authService.resendCode(user.id).subscribe(
      (res) => {
        SweetAlert.success('Éxito', res.message);
        localStorage.setItem('url', res.url);
      },
      (err) => {
        SweetAlert.error('Error', 'El código ingresado es incorrecto');
      }
    );
  }
}
