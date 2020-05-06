import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryDistinct'
})
export class CategoryDistinctPipe implements PipeTransform {

  transform(value: Array<any>, ...args: any[]): any {
    alert('')
    return value.filter(x => !x.inUse);
    //|| (i === newCategoryDefault && newCategoryDefault !== item.oldCategory)
  }

}
