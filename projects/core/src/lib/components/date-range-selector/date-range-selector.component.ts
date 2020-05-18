import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { Calendar } from 'primeng/calendar';

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

  @Input() from = new Date();
  @Input() to = new Date();
  @Input() header = 'Select report data range';

  @Output() onCancel = new EventEmitter();
  @Output() onApply = new EventEmitter<FromTo>();

  @ViewChild('fromPicker', { static: true }) fromPicker: Calendar;
  @ViewChild('toPicker', { static: true }) toPicker: Calendar;

  cancel(): void {
    this.onCancel.emit();
  }

  apply(): void {
    this.onApply.emit({
      from: this.from,
      to: this.to
    });
  }
}
