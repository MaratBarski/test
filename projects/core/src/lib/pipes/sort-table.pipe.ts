import { Pipe, PipeTransform } from '@angular/core';
import { TableRowModel } from '../components/table/table.component';
import { SortService } from '../services/sort.service';
import { TableHeaderModel } from '../components/table-header/table-header.component';

@Pipe({
  name: 'sortTable'
})
export class SortTablePipe implements PipeTransform {

  constructor(private sortService: SortService) { }
  transform(value: Array<TableRowModel>, sortModel: TableHeaderModel): any {
    return this.sortService.sortRows(value, sortModel);
  }

}
