import {Pipe, PipeTransform} from '@angular/core';
import {IColumn} from '@app/activate/model/interfaces/IColumn';

@Pipe({
  name: 'filterColumns'
})
export class FilterColumnsPipe implements PipeTransform {
  transform(value: IColumn[], ...args: any[]): any {
    return value.filter(item => item.isShown);
  }
}
