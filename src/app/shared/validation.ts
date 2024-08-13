// validation.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static namePattern: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
    return pattern.test(control.value) ? null : { invalidName: true };
  };
  //only numbers
  static onlyNumbers: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^[0-9]*$/;
    return pattern.test(control.value) ? null : { invalidNumber: true };
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
    const pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&()_+\[\]{}*])[A-Za-z\d!@#$%^&()_+\[\]{}*]{8,}$/;
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
  // Nueva validación para Placas
  static platePattern: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^.{6,15}$/;
    return pattern.test(control.value) ? null : { invalidPlate: true };
  };

  // Nueva validación para Número de Serie (VIN)
  static numberSeriePattern: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^\d{17,25}$/;
    return pattern.test(control.value) ? null : { invalidVin: true };
  };

  // Nueva validación para Año
  static yearPattern: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^\d{1,4}$/;
    return pattern.test(control.value) ? null : { invalidYear: true };
  };

  //Alphanumeric cuanlquier signo, numero, letra, permite guiones y espacios
  static alphanumeric: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const pattern = /^[a-zA-Z0-9\s-]+$/;
    return pattern.test(control.value) ? null : { invalidAlphanumeric: true };
  };
  static optionalEmail: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.trim() !== '') {
      const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return pattern.test(control.value) ? null : { invalidEmail: true };
    }
    return null; // Si el campo está vacío, no se aplica la validación
  };
}
