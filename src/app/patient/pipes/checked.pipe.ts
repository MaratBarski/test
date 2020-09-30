import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checked'
})
export class CheckedPipe implements PipeTransform {

  transform(arr: Array<any>, ...args: any[]): any {
    if (!arr || !arr.length) { return []; }
    return arr.filter(x => x.isChecked);
  }

}
