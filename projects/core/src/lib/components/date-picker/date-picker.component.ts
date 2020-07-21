import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { Calendar } from 'primeng/calendar';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'mdc-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent {



  @Output() onCancel = new EventEmitter();
  @Output() onApply = new EventEmitter<Date>();

  @Input() date: Date;
  @Input() isShowDateFormat = false;
  @Input() dateFormat = 'dd/mm/yy';
  @ViewChild('datePicker', { static: true }) fromPdatePickericker: Calendar;

  constructor(private dateService: DateService) { }

  cancel(): void {
    this.onCancel.emit();
  }

  locale = this.dateService.getCalendarLocale();

  apply(): void {
  }



}
