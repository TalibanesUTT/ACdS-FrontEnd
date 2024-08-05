import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '../../../shared/validation';
import Swal from 'sweetalert2';
import { SweetAlert } from '../../../shared/SweetAlert';
import { ProfileService } from '../../../services/profile.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-formEditPasswordUser',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatFormField, MatInputModule, MatLabel, MatButtonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  templateUrl: './formEditPasswordUser.component.html',
  styleUrls: ['./formEditPasswordUser.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class formEditPasswordUserComponent {
  title = 'acds-frontend';
  registerForm: FormGroup;
  formValid = true;
  @Input() PasswordSwitch: boolean = true;
  @Output() PasswordSwitchChange = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder, private router: Router, private profileService: ProfileService) {
    this.registerForm = this.newFormControls();
  }
  newFormControls(): FormGroup {
    return this.fb.group(
      {
        actualPassword: ['', [Validators.required, CustomValidators.passwordPattern]],
        newPassword: ['', [Validators.required, CustomValidators.passwordPattern]],
        passwordConfirmation: ['', [Validators.required, CustomValidators.passwordPattern]],
      },
      { validators: CustomValidators.validatorMatchPasswordUpdate }
    );
  }

  validForm($event: any): void {
    if (this.registerForm.valid) {
      this.formValid = false;
    } else {
      this.formValid = true;
    }
  }
  PasswordChange(): void {
    const USER = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Usuario', USER);
    console.log('Formulario de cambio de contraseña', this.registerForm.value);

    if (!this.PasswordSwitch) {
      Swal.fire({
        title: 'Aviso',
        text: 'Estás a punto de modificar tu contraseña, a partir de ahora tendrás que utilizarla para iniciar sesión en la aplicación, por ello es importante que no la olvides. ¿Deseas continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.profileService.updatePassword(this.registerForm.value, USER.id).subscribe(
            (response) => {
              console.log(response);
              SweetAlert.success('Éxito', response.message);
              this.registerForm.reset();
              this.PasswordSwitch = !this.PasswordSwitch;
              this.PasswordSwitchChange.emit(this.PasswordSwitch);
            },
            (error) => {
              console.log(error);
              SweetAlert.error('Error', error.error.error.message);
            }
          );
        }
      });
    }
  }
  changeView(): void {
    this.PasswordSwitch = !this.PasswordSwitch;
    this.PasswordSwitchChange.emit(this.PasswordSwitch);
  }
}
