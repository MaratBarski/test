import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkValidDate'
})
export class CheckValidDatePipe implements PipeTransform {

  transform(value: any, defaultDate = undefined): any {
    if (!value) { return undefined; }
    return isNaN(new Date(value).getTime()) ? defaultDate : value;
  }

}
