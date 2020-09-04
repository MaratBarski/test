import { Component, forwardRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Calendar } from 'primeng/calendar';
import { DateService } from '../../services/date.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'mdc-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true
  }]
})
export class DatePickerComponent implements ControlValueAccessor {

  private _value: Date;
  get value(): Date {
    return this._value;
  };
  set value(v: Date) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  onChange: (_: any) => void = (_: any) => { };
  onTouched: () => void = () => { };

  updateChanges() {
    this.onChange(this.value);
  }

  writeValue(value: Date): void {
    if (value !== this._value) {
      this._value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @Input() isShowDateFormat = false;
  @Input() dateFormat = 'dd/mm/yy';
  @ViewChild('datePicker', { static: true }) fromPdatePickericker: Calendar;

  @Output() onSelect = new EventEmitter<void>();

  disabled = false;

  constructor(private dateService: DateService) { }

  locale = this.dateService.getCalendarLocale();

  changeDate($event: any): void {
    this.onSelect.emit();
  }
}
