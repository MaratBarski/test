import { Component, ContentChild, TemplateRef, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export class SwitchButtonModel {
  disable: boolean;
  icon: string;
  value?: any;
}

export const SWB_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SwitchButtonComponent),
  multi: true
};

@Component({
  selector: 'mdc-switch-button',
  templateUrl: './switch-button.component.html',
  styleUrls: ['./switch-button.component.css'],
  providers: [SWB_VALUE_ACCESSOR],
})
export class SwitchButtonComponent implements ControlValueAccessor {
  @Input() buttons: Array<SwitchButtonModel>;
  @ContentChild(TemplateRef, { read: TemplateRef, static: true }) template: TemplateRef<any>;
  @Output() onClick = new EventEmitter<number>();
  @Input() activeIndex = 0;

  btnClick(button: SwitchButtonModel, index: number): void {
    if (button.disable) { return; }
    if (this.activeIndex === index) { return; }
    this.activeIndex = index;
    this.value = button.value;
    this.onClick.emit(index);
  }

  onChangeCallback = (value: any) => { };
  onTouchedCallback = () => { };

  private _value: any;

  get value(): any {
    return this._value;
  }

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