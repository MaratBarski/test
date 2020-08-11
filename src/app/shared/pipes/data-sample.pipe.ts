import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'DataSample'})
export class DataSamplePipe implements PipeTransform {
  transform(value: string, arg: any): string {
    const tmp = value ? value.split('%sep%').filter(item => item.length > 0) : [];
    if (arg.html) {
      return '<span>' + tmp.join(',</span> <span>') + '</span>';
    } else {
      return tmp.join(', ');
    }
  }
}
