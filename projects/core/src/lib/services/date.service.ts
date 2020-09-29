import { Injectable } from '@angular/core';
import { TableRowModel } from '../components/table/table.component';
import { FromTo } from '../components/date-range-selector/date-range-selector.component';
import { LOCALE_ID, Inject } from '@angular/core';
import { CALENDAR_EN, CALENDAR_HE } from '../models/calendar-format';

export const DEFAULT_CULTURE = 'en-US';

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
export const Month = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12
}

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(
    @Inject(LOCALE_ID) private locale: string
  ) {
  }

  getUsersLocale(): string {
    return this.locale;
    // if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
    //   return DEFAULT_CULTURE;
    // }
    // const wn = window.navigator as any;
    // let lang = wn.languages ? wn.languages[0] : DEFAULT_CULTURE;
    // lang = lang || wn.language || wn.browserLanguage || wn.userLanguage;
    // return lang;
  }

  getCalendarLocale(): any {
    return this.getUsersLocale() === DEFAULT_CULTURE ? CALENDAR_EN : CALENDAR_HE
  }

  fromDate = {
    [DatePeriod.Hour]: (value: number) => {
      const date = new Date();
      date.setHours(date.getHours() - value);
      return date;
    },
    [DatePeriod.Day]: (value: number) => {
      const date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setDate(date.getDate() - value);
      return date;
    },
    [DatePeriod.Week]: (value: number) => {
      const date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setDate(date.getDate() - value * 7);
      return date;
    },
    [DatePeriod.Month]: (value: number) => {
      const date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setMonth(date.getMonth() - value);
      return date;
    },
    [DatePeriod.Year]: (value: number) => {
      const date = new Date();
      date.setHours(0);
      date.setMinutes(0);
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

  formatDateToSend(date: string | Date): string {
    const res = new Date(date);
    return `${res.getFullYear()}-${this.formatNumber(res.getMonth() + 1)}-${this.formatNumber(res.getDate())}`;
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

  getDaysDiff(from: string | Date, to: string | Date): number {
    const date1 = new Date(from);
    const date2 = new Date(to);
    const days1 = Math.floor(date1.getTime() / (3600 * 24 * 1000));
    const days2 = Math.floor(date2.getTime() / (3600 * 24 * 1000));
    return days2 - days1;
  }

  private formatNumber(i: number): string { return i > 9 ? `${i}` : `0${i}`; }

  formatDate(date: string | Date, separator: string = '-'): string {
    const res = new Date(date);
    return `${this.formatNumber(res.getDate())}${separator}${this.formatNumber(res.getMonth() + 1)}${separator}${res.getFullYear()}`;
  }


  toExcel(date: string | Date): string {
    const res = new Date(date);
    return `${res.getFullYear()}-${this.formatNumber(res.getMonth() + 1)}-${this.formatNumber(res.getDate())} ${this.formatNumber(res.getHours())}:${this.formatNumber(res.getMinutes())}`;
  }

  formatDateUS(date: string | Date): string {
    const res = new Date(date);
    return `${res.getFullYear()}-${this.formatNumber(res.getMonth() + 1)}-${this.formatNumber(res.getDate())}`;
  }

  getYear(year: number): number {
    const date = new Date();
    return date.getFullYear() + year;
  }

  getLastMonths(options: { months: number, isFromFirst: boolean, date: Date }): { fromDate: Date, toDate: Date } {
    const toDate = new Date(options.date);
    this.resetTime(toDate);
    if (options.isFromFirst) {
      toDate.setDate(1);
    }
    const fromDate = new Date(toDate);
    fromDate.setMonth(fromDate.getMonth() - options.months);
    fromDate.setDate(1);
    return { fromDate: fromDate, toDate: toDate };
  }

  getFromMonth2Current(months: number): { fromDate: Date, toDate: Date } {
    return this.getLastMonths({
      months: months, isFromFirst: true, date: new Date()
    });
  }

  getLastYears(options: { toYearDiff: number, years: number, isFromFirst: boolean, date: Date }): { fromDate: Date, toDate: Date } {
    const toDate = new Date(options.date);
    this.resetTime(toDate);
    if (options.isFromFirst) {
      toDate.setDate(1);
      toDate.setMonth(0);
    }
    toDate.setFullYear(toDate.getFullYear() - options.toYearDiff);
    const fromDate = new Date(toDate);
    fromDate.setDate(1);
    fromDate.setMonth(0);
    fromDate.setFullYear(fromDate.getFullYear() - options.years);
    return { fromDate: fromDate, toDate: toDate };
  }

  getFromYear2Now(years: number): { fromDate: Date, toDate: Date } {
    return this.getLastYears({
      toYearDiff: 0, years: years, isFromFirst: false, date: new Date()
    });
  }

  getFromYear2Current(years: number): { fromDate: Date, toDate: Date } {
    return this.getLastYears({
      toYearDiff: 0, years: years, isFromFirst: true, date: new Date()
    });
  }

  getFromYear(years: number): { fromDate: Date, toDate: Date } {
    return this.getLastYears({
      toYearDiff: years, years: 1, isFromFirst: true, date: new Date()
    });
  }

  resetTime(date: Date): void {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
  }

  fromYear(year: number): Date {
    let date = new Date();
    date.setMonth(0);
    date.setDate(1);
    date.setFullYear(date.getFullYear() - year);
    return date;
  }

  sortByMonthYear(arr: Array<any>, dateField: string, separator = '-'): Array<any> {
    return arr.sort((a, b) => {
      const dp1 = a[dateField].split(separator);
      const dp2 = b[dateField].split(separator);
      const y1 = parseInt(dp1[1]);
      const y2 = parseInt(dp2[1]);
      if (y1 < y2) { return -1; }
      if (y1 > y2) { return 1; }
      if (Month[dp1[0]] < Month[dp2[0]]) { return -1; }
      if (Month[dp1[0]] > Month[dp2[0]]) { return 1; }
      return 0;
    })
  }

  addDay(date: string | Date, days = -1): string {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return this.formatDateUS(d);
  }
}
