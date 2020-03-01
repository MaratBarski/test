import { Injectable } from '@angular/core';
import { TableRowModel } from '../components/table/table.component';
import { TableHeaderModel } from '../components/table-header/table-header.component';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  private sort(a: any, b: any, sortModel: TableHeaderModel): number {
    if (a === b) { return 0; }
    if (sortModel.sortDir === 'asc') {
      return a > b ? 1 : -1;
    }
    return a > b ? -1 : 1;
  }

  sortRows(rows: Array<TableRowModel>, sortModel: TableHeaderModel): Array<TableRowModel> {
    if (!!!sortModel) { return rows; }
    const arr = rows.sort((a, b) => {
      return this.sort(a.cells[sortModel.columnId], b.cells[sortModel.columnId], sortModel);
    });
    return [...arr];
  }
}
