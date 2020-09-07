import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ComponentService } from '../../services/component.service';

@Component({
  selector: 'mdc-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputNumberComponent),
    multi: true
  }]
})

export class InputNumberComponent implements ControlValueAccessor {

  isDisabled = false;

  @Output() onValueChanged = new EventEmitter<number>();

  @Input() min = 0;
  @Input() max = 100000;
  @Input() defaultValue = 100000;
  @Input() emptyEnable = false;
  @Input() isValid = true;
  @Input() errorMessage = 'missing number';

  private _value: number;
  get value(): number {
    return this._value;
  };
  set value(v: number) {
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

  writeValue(value: number): void {
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
    this.isDisabled = isDisabled;
  }

  chengeNumber(): void {
    if (this._value === undefined || this._value.toString().trim() === '' || isNaN(this._value)) {
      this._value = this.defaultValue;
      this.onChange(this._value);
      this.onValueChanged.emit(this.value);
      return
    }
    this._value = parseInt('' + this._value);
    if (this._value > this.max) {
      this._value = this.max;
      this.onChange(this._value);
    } else if (this._value < this.min) {
      this._value = this.min;
      this.onChange(this._value);
    }
    this.onValueChanged.emit(this.value);
  }

  add(i: number): void {
    if (isNaN(this._value)) {
      this._value = this.defaultValue;
    }
    this._value = parseInt('' + this._value);
    if (this._value + i > this.max) { return; }
    if (this._value + i < this.min) { return; }
    this._value += i;
    this.onChange(this._value);
    this.onValueChanged.emit(this.value);
  }
}

