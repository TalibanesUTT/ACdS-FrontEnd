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
import { CustomValidators } from '../../../shared/validation';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-recoverPassword',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatFormField, MatInputModule, MatLabel, MatButtonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './recoverPassword.component.html',
  styleUrl: './recoverPassword.component.css',
})
export class recoverPasswordComponent {
  title = 'acds-frontend';
  verifyEmailForm: FormGroup;
  sendCode: string = '';
  resendCodeDisabled = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private profileService: ProfileService) {
    this.verifyEmailForm = this.newFormControls();
  }

  newFormControls(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, CustomValidators.emailPattern]],
    });
  }

  verify(): void {
    this.profileService.recoverPassword(this.verifyEmailForm.value.email).subscribe(
      (res) => {
        console.log(res);
        SweetAlert.success('success', res.message);
        this.router.navigate(['/login']);
      },
      (err) => {
        console.log(err);
        SweetAlert.error('error', err.error.error.message);
      }
    );
  }
  /**
   *
   * @param event
   */
  validEmail(event: any): void {
    const EMAIL = event.target.value;
    //valid email /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    if (EMAIL.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      this.resendCodeDisabled = false;
    } else {
      this.resendCodeDisabled = true;
    }
  }
}
