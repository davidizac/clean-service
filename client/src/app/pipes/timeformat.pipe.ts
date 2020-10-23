import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'time_format',
})
export class TimeFormat implements PipeTransform {
  transform(value: any): any {
    const date = typeof value === 'string' ? moment(value) : value;
    return (
      date.format('HH:00') +
      ' - ' +
      date.clone().add(1, 'hours').format('HH:00')
    );
  }
}
