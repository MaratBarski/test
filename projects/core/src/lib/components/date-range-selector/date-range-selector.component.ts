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
export class DateRangeSelectorComponent  {

  @Input() from = new Date();
  @Input() to = new Date();
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

  constructor(private dateService: DateService) {}
  
  cancel(): void {
    this.onCancel.emit();
  }

  locale = this.dateService.getCalendarLocale();

  checkToDate():void{
    if(this.from > this.to){
      this.to = new Date(this.from);
    }
  }

  apply(): void {
    if (this.to < this.from) {
      const t = this.to;
      this.to = this.from;
      this.from = t;
    }
    this.onApply.emit({
      from: this.from,
      to: this.to
    });
  }
}
