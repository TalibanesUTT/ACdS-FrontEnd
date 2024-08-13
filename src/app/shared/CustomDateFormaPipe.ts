import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'customDateFormat',
})
export class CustomDateFormatPipe implements PipeTransform {
  transform(value: Date | moment.Moment, format: string): string {
    if (!value) return '';
    return moment(value).format(format);
  }
}
