import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'DataSample'})
export class DataSamplePipe implements PipeTransform {
  transform(value: string): string {
    const tmp = value ? value.split('%sep%').filter(item => item.length > 0) : [];
    return tmp.join(', ');
  }
}
