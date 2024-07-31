// validation.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static namePattern: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑs]+$/;
    return pattern.test(control.value) ? null : { invalidName: true };
  };

  static emailPattern: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(control.value) ? null : { invalidEmail: true };
  };

  static phonePattern: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    return pattern.test(control.value) ? null : { invalidPhone: true };
  };

  static passwordPattern: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&()_+\[\]{}])[A-Za-z\d!@#$%^&()_+\[\]{}]{8,}$/;
    // console.log('Password being validated:', control.value);
    return pattern.test(control.value) ? null : { invalidPassword: true };
  };
  static validatorMatchPassword: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('passwordConfirmation')?.value;
    return password && confirmPassword && password === confirmPassword ? null : { passwordsMismatch: true };
  };

  static validatorMatchPasswordUpdate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('passwordConfirmation')?.value;
    return password && confirmPassword && password === confirmPassword ? null : { passwordsMismatchUpdate: true };
  };
}
