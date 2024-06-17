import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appFormatCode]',
})
export class FormatCodeDirective {
  private previousValue: string = '';

  constructor(private el: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent): void {
    const input = this.el.nativeElement.value.replace(/\D/g, '');
    if (input.length > 8) {
      this.el.nativeElement.value = this.previousValue;
      return;
    }
    const formattedInput = input
      .substring(0, 8)
      .replace(/(\d{2})(?=\d)/g, '$1-')
      .replace(/-$/, '');
    this.previousValue = formattedInput;
    this.control.control?.setValue(formattedInput, { emitEvent: false });
  }
}
