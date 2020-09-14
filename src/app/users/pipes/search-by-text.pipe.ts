import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchByText'
})
export class SearchByTextPipe implements PipeTransform {

  transform(arr: Array<any>, ...args: any[]): Array<any> {
    if (!args[1] || args[1].trim() === '') { return [...arr]; }
    if (args[2]) { return [...arr]; }
    return arr.filter(x => x[args[0]].toLowerCase().indexOf(args[1].toLowerCase()) !== -1);
  }

}
