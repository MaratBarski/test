import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryVisible'
})
export class CategoryVisiblePipe implements PipeTransform {
  transform(value: Array<any>, ...args: any[]): any {
    return value.filter(x => x.sortValue >= 0);
  }
}
