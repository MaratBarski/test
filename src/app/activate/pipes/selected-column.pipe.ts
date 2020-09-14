import {Pipe, PipeTransform} from '@angular/core';
import {IColumn} from '@app/activate/model/interfaces/IColumn';

@Pipe({
  name: 'selectedColumn'
})
export class SelectedColumnPipe implements PipeTransform {

  transform(value: Array<IColumn>, ...args: any[]): any {
    let count = 0;
    value.forEach(item => {
      count += item.include ? 1 : 0;
    });
    return count;
  }

}
