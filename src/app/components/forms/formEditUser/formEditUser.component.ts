import { Component, Input, ViewEncapsulation, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '../../../shared/validation';

@Component({
  selector: 'app-formEditUser',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  templateUrl: './formEditUser.component.html',
  styleUrls: ['./formEditUser.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class formEditUserComponent implements OnChanges {
  @Input() PasswordSwitch: boolean = true;
  @Output() PasswordSwitchChange = new EventEmitter<boolean>();
  @Input() editProfile: boolean = false;
  @Output() editProfileChange = new EventEmitter<boolean>();
  @Input() userData: any = {
    name: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
  };
  @Output() userDataChange = new EventEmitter<any>();
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.newFormControls();
    this.updateFormValues(this.userData);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editProfile']) {
      this.setFormState(changes['editProfile'].currentValue);
    }
    if (changes['userData']) {
      this.updateFormValues(changes['userData'].currentValue);
    }
  }

  newFormControls(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, CustomValidators.namePattern]],
      lastName: ['', [Validators.required, CustomValidators.namePattern]],
      email: ['', [Validators.required, CustomValidators.emailPattern]],
      phoneNumber: ['', [Validators.required, CustomValidators.phonePattern]],
      role: ['', [Validators.required, CustomValidators.namePattern]],
    });
  }

  setFormState(editable: boolean) {
    if (editable) {
      this.registerForm.enable();
    } else {
      this.registerForm.disable();
      this.registerForm.get('name')?.enable();
      this.registerForm.get('lastName')?.enable();
      this.registerForm.get('email')?.enable();
      this.registerForm.get('phoneNumber')?.enable();
      this.registerForm.get('role')?.enable();
    }
  }

  updateFormValues(data: any) {
    this.registerForm.patchValue({
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      role: data.role,
    });
  }

  onPhoneFormat(event: any): void {
    let input = event.target.value.replace(/\D/g, '');
    if (input.length > 10) {
      input = input.slice(0, 10);
    }
    input = input.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    event.target.value = input;
    this.registerForm.get('phoneNumber')?.setValue(input, { emitEvent: false });
  }

  PasswordChange(): void {
    this.PasswordSwitch = !this.PasswordSwitch;
    this.PasswordSwitchChange.emit(this.PasswordSwitch);
  }

  ProfileChange(): void {
    this.editProfile = !this.editProfile;
    this.editProfileChange.emit(this.editProfile);
  }

  userChange(): void {
    let data = {
      name: this.registerForm.get('name')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value,
      phoneNumber: this.registerForm.get('phoneNumber')?.value,
      role: this.registerForm.get('role')?.value,
    };
    this.userDataChange.emit(data);
  }
}
