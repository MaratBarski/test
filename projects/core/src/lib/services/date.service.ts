import { Injectable } from '@angular/core';
import { TableRowModel } from '../components/table/table.component';
import { FromTo } from '../components/date-range-selector/date-range-selector.component';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  filter(fromDate: Date, toDate: Date, data: Array<TableRowModel>, propertyName: string): Array<TableRowModel> {
    return [...data.filter(item => {
      return new Date(item.cells[propertyName]) >= new Date(fromDate) && new Date(item.cells[propertyName]) <= new Date(toDate);
    })];
  }

  lastWeek(data: Array<TableRowModel>, propertyName: string): Array<TableRowModel> {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return this.filter(date, new Date(), data, propertyName);
  }

  lastMonth(data: Array<TableRowModel>, propertyName: string): Array<TableRowModel> {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return this.filter(date, new Date(), data, propertyName);
  }

  getRange(data: Array<TableRowModel>, propertyName: string, range: FromTo): Array<TableRowModel> {
    return this.filter(range.from, range.to, data, propertyName);
  }

  isDateValid(date: any): boolean {
    if (!date) { return false; }
    //if (isNaN(date.getTime())) { return false; }
    return date.toString().toLowerCase() !== 'invalid date';
  }

}
