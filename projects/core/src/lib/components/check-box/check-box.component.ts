import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ComponentService } from '../../services/component.service';


const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckBoxComponent),
  multi: true
};

@Component({
  selector: 'mdc-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.css'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class CheckBoxComponent implements ControlValueAccessor {

  @Input() isDisabled = false;
  @Input() text: string;
  @Input() whiteSpace = 'normal';
  @Input() id = ComponentService.createID('checkbox');

  @Output() change = new EventEmitter<boolean>();

  private _value: boolean;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  get value(): any {
    return this._value;
  };

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChangeCallback(v);
    }
  }

  writeValue(value: any) {
    if (value !== this._value) {
      this._value = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  changeSelect(): void {
    if (this.isDisabled) { return; }
    this.value = !this.value;
    this.change.emit(this.value);
  }
}
