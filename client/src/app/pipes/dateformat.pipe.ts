import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'date_format',
})
export class DateFormat implements PipeTransform {
  transform(value: any): any {
    const date = typeof value === 'string' ? moment(value) : value;
    const monthName = date.format('MMMM');
    const dayOfMonth = date.date();
    const dayOfWeek = date.format('dddd');
    const year = date.format('YYYY');
    return `${capitalizeFirstLetter(
      dayOfWeek
    )} ${dayOfMonth} ${capitalizeFirstLetter(monthName)} ${year}`;
  }
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
