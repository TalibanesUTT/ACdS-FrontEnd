import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
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

@Component({
  selector: 'app-formEditPasswordUser',
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
  templateUrl: './formEditPasswordUser.component.html',
  styleUrls: ['./formEditPasswordUser.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class formEditPasswordUserComponent {
  title = 'acds-frontend';
  registerForm: FormGroup;
  @Input() PasswordSwitch: boolean = true;
  @Output() PasswordSwitchChange = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.newFormControls();
  }
  newFormControls(): FormGroup {
    return this.fb.group({
      passwordOld: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+])[A-Za-z\\d!@#$%^&*()_+]{8,}$'
          ),
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
    });
  }
  PasswordChange(): void {
    this.PasswordSwitch = !this.PasswordSwitch;
    this.PasswordSwitchChange.emit(this.PasswordSwitch);
  }
}
