import { Component, Output, Input, EventEmitter } from '@angular/core';
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

  @Input() set from(date: Date) {
    this._from = date;
    try { this.fromStr = date.toISOString().split('T')[0]; }
    catch (e) { this.fromStr = ''; }
  }

  @Input() set to(date: Date) {
    this._to = date;
    try { this.toStr = date.toISOString().split('T')[0]; }
    catch (e) { this.toStr = ''; }
  }

  get from(): Date { return this._from }
  get to(): Date { return this._to }

  private _from: Date;
  private _to: Date;

  @Input() header = 'Select report data range';
  @Output() onCancel = new EventEmitter();
  @Output() onApply = new EventEmitter<FromTo>();

  fromStr: string;
  toStr: string;

  constructor(private dateService: DateService) { }

  cancel(): void {
    this.onCancel.emit();
  }

  apply(): void {
    const from = new Date(this.fromStr);
    const to = new Date(this.toStr);
    if (!this.dateService.isDateValid(from)) { return; }
    if (!this.dateService.isDateValid(to)) { return; }
    this._from = from;
    this._to = to;
    this.onApply.emit({
      from: this.from,
      to: this.to
    });

  }
}
