import { Injectable } from '@angular/core';
import { TableRowModel } from '../components/table/table.component';

export class SearchModel {
  text: string;
  columns?: Array<string>;
}
@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  filterRows(rows: Array<TableRowModel>, searchModel: SearchModel): Array<TableRowModel> {
    if (!!!searchModel || !!!searchModel.columns) { return rows; }
    if (!searchModel.text || searchModel.text.trim() === '') { return rows; }
    return rows.filter(row => {
      for (let i = 0; i < searchModel.columns.length; i++) {
        if (!row.cells[searchModel.columns[i]]) {
          return false;
        }
        if (row.cells[searchModel.columns[i]].toString().trim().toLowerCase().startsWith(searchModel.text.trim().toLowerCase())) {
          return true;
        }
      }
      return false;
    });
  }
}
