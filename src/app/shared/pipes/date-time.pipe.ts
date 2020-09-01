import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTime'
})
export class DateTimePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) { return ''; }
    let time = value.split('T');
    if (!time || time.length < 2) { return ''; }
    time = time[1].split(':');
    if (!time || time.length < 2) { return ''; }
    return `${time[0]} ${time[1]}`;
  }

}
