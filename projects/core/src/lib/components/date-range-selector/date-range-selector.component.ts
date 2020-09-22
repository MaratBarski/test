import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Calendar } from 'primeng/calendar';
import { DateService } from '../../services/date.service';

export interface FromTo {
  from: Date;
  to: Date;
}
@Component({
  selector: 'mdc-date-range-selector',
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.css']
})
export class DateRangeSelectorComponent {

  @Input() set from(from: Date) {
    this._from = from;
    if (!this._prevFrom) {
      this._prevFrom = new Date(from);
    }
  }
  get from(): Date { return this._from; }

  @Input() set to(to: Date) {
    this._to = to;
    if (!this._prevTo) {
      this._prevTo = new Date(to);
    }
  }
  get to(): Date { return this._to; }

  private _from = new Date();
  private _to = new Date();

  get prevFrom(): Date { return this._prevFrom; }
  get prevTo(): Date { return this._prevTo; }
  private _prevFrom = undefined;
  private _prevTo = undefined;

  @Input() header = 'Select report data range';
  @Input() set dateFormat(dateFormat: string) {
    this.fullDateFormat = dateFormat;
    this._dateFormat = dateFormat.replace('yyyy', 'yy');
  }
  get dateFormat(): string {
    return this._dateFormat;
  }
  private _dateFormat = 'dd/mm/yy';
  fullDateFormat = 'dd/mm/yy';

  @Output() onCancel = new EventEmitter();
  @Output() onApply = new EventEmitter<FromTo>();

  @ViewChild('fromPicker', { static: true }) fromPicker: Calendar;
  @ViewChild('toPicker', { static: true }) toPicker: Calendar;

  constructor(private dateService: DateService) { }

  cancel(): void {
    this._from = new Date(this._prevFrom);
    this._to = new Date(this._prevTo);
    this.resetvalidation();
    this.onCancel.emit();
  }

  isDateRangeValid = true;
  isFromValid = true;
  isToValid = true;
  locale = this.dateService.getCalendarLocale();

  checkToDate(): void {
    // if (this.from > this.to) {
    //   this.to = new Date(this.from);
    // }
  }

  resetvalidation(): void {
    this.isDateRangeValid = true;
    this.isFromValid = true;
    this.isToValid = true;
  }

  validate(): boolean {
    this.resetvalidation();
    if (!this.to) {
      this.isToValid = false;
    }
    if (!this.from) {
      this.isFromValid = false;
    }
    if (!this.isToValid || !this.isFromValid) { return false; }
    if (this.to < this.from) {
      this.isDateRangeValid = false;
      return false;
    }
    return true;
  }

  apply(): void {
    if (!this.validate()) { return; }
    this._prevFrom = new Date(this._from);
    this._prevTo = new Date(this._to);
    this.onApply.emit({
      from: this.from,
      to: this.to
    });
  }
}
