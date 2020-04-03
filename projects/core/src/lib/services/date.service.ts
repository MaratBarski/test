import { Injectable } from '@angular/core';
import { TableRowModel } from '../components/table/table.component';
import { FromTo } from '../components/date-range-selector/date-range-selector.component';
import { parseHostBindings } from '@angular/compiler';

export enum DatePeriod {
  Hour = 1,
  Day = 2,
  Week = 3,
  Month = 4,
  Year = 5
}
export interface DateRange {
  value?: number;
  period?: DatePeriod;
  fromDate?: Date;
  toDate?: Date;
  all?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DateService {

  fromDate = {
    [DatePeriod.Hour]: (value: number) => {
      const date = new Date();
      date.setHours(date.getHours() - value);
      return date;
    },
    [DatePeriod.Day]: (value: number) => {
      const date = new Date();
      date.setDate(date.getDate() - value);
      return date;
    },
    [DatePeriod.Week]: (value: number) => {
      const date = new Date();
      date.setDate(date.getDate() - value * 7);
      return date;
    },
    [DatePeriod.Month]: (value: number) => {
      const date = new Date();
      date.setMonth(date.getMonth() - value);
      return date;
    },
    [DatePeriod.Year]: (value: number) => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - value);
      return date;
    },
  }

  filter(fromDate: Date, toDate: Date, data: Array<any>, propertyName: string): Array<any> {
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

  getFilteredData(fromDate: Date, toDate: Date, data: Array<any>, propertyName: string): Array<any> {
    return [...data.filter(item => {
      return new Date(item[propertyName]) >= new Date(fromDate) && new Date(item[propertyName]) <= new Date(toDate);
    })];
  }

  getData(data: Array<any>, range: DateRange, dateField: string): Array<any> {
    if (!range || range.all) {
      return data;
    }
    if (range.period) {
      return this.getFilteredData(this.fromDate[range.period](range.value), new Date(), data, dateField);
    }
    if (range.fromDate && range.toDate) {
      return this.getFilteredData(range.fromDate, range.toDate, data, dateField);
    }
    if (range.fromDate) {
      return this.getFilteredData(range.fromDate, new Date(), data, dateField);
    }
    return [];
  }

}
