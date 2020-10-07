import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(arr: Array<any>, args: { property: string, dir: 'asc' | 'desc' }): Array<any> {
    if (!arr || !arr.length) { return arr; }
    const dir = args.dir === 'asc' ? -1 : 1;
    return arr.sort((a, b) => {
      if (!a[args.property] && !b[args.property]) { return 0; }
      if (!a[args.property] && b[args.property]) { return dir; }
      if (a[args.property] && !b[args.property]) { return -dir; }
      if (a[args.property].toString().trim().toLowerCase() < b[args.property].toString().trim().toLowerCase()) { return dir; }
      if (a[args.property].toString().trim().toLowerCase() > b[args.property].toString().trim().toLowerCase()) { return -dir; }
      return 0;
    });
  }

}
