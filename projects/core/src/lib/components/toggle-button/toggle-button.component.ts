import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ComponentService } from '../../services/component.service';

const noop = () => { };

export const CUSTOM_TOGGLE_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ToggleButtonComponent),
  multi: true
};

@Component({
  selector: 'mdc-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.css'],
  providers: [CUSTOM_TOGGLE_CONTROL_VALUE_ACCESSOR]
})
export class ToggleButtonComponent implements ControlValueAccessor {

  @Input() text: string;
  @Input() yes = "Yes";
  @Input() no = "No";
  @Input() id = ComponentService.createID('toggle');
  @Output() change = new EventEmitter<void>();

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
}
