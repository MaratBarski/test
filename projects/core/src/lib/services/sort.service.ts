import { Injectable } from '@angular/core';
import { TableRowModel } from '../components/table/table.component';
import { TableHeaderModel } from '../components/table-header/table-header.component';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  compare(a: any, b: any, sortDir: string): number {
    if (a === b) { return 0; }
    if (sortDir === 'asc') {
      return a > b ? 1 : -1;
    }
    return a > b ? -1 : 1;
  }

  compareString(a: string, b: string, sortDir: string): number {
    if (a.trim().toLowerCase() === b.trim().toLowerCase()) {
      return this.compare(a.trim(), b.trim(), sortDir);
    }
    return this.compare(a.trim().toLowerCase(), b.trim().toLowerCase(), sortDir);
  }

  sort(a: any, b: any, sortModel: TableHeaderModel): number {
    if (!typeof (a) && !typeof (b)) { return 0; }
    if (!a && !b) { return 0; }
    if (typeof (a) === 'number' && typeof (b) === 'number') {
      return this.compare(a, b, sortModel.sortDir);
    }
    if ((!typeof (a) || !a) && b) { return 1; }
    if ((!typeof (b) || !b) && a) { return -1; }
    if (a === b) { return 0; }
    if (typeof (a) === 'string' && typeof (b) === 'string') {
      return this.compareString(a, b, sortModel.sortDir);
    }
    return this.compare(a, b, sortModel.sortDir);
  }

  sortRows(rows: Array<TableRowModel>, sortModel: TableHeaderModel): Array<TableRowModel> {
    if (!!!sortModel) { return rows; }
    const arr = rows.sort((a, b) => {
      return this.sort(a.cells[sortModel.columnId], b.cells[sortModel.columnId], sortModel);
    });
    return [...arr];
  }
}
