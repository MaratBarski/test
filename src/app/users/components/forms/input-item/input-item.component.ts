import { Component, Input, forwardRef, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'md-input-item',
  templateUrl: './input-item.component.html',
  styleUrls: ['./input-item.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputItemComponent),
    multi: true
  }]

})
export class InputItemComponent implements ControlValueAccessor {

  @Input() label = '';
  @Input() missingText = '';
  @Input() isError = false;
  @Input() isMissing = false;
  @Input() type = 'text';
  @Input() isOptional = false;
  @Input() placeHolder = '';
  @Input() isDisabled = false;

  @Output() onChangeValue = new EventEmitter<any>();

  private _value: any;
  get value(): any {
    return this._value;
  };
  set value(v: any) {
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

  chengeInput(): void {
    this.onChangeValue.emit(this.value);
  }
}
