import { Pipe, PipeTransform } from '@angular/core';
import { TableHeaderModel } from '../components/table-header/table-header.component';

@Pipe({
  name: 'visibleHeaders'
})
export class VisibleHeadersPipe implements PipeTransform {

  transform(value: Array<TableHeaderModel>, ...args: any[]): any {
    return value.filter(x => !x.hidden);
  }

}
