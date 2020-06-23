import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export const SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ShareFileComponent),
  multi: true
};

@Component({
  selector: 'md-share-file',
  templateUrl: './share-file.component.html',
  providers: [SELECT_VALUE_ACCESSOR],
})
export class ShareFileComponent implements ControlValueAccessor, OnInit {
  opened = false;
  startValue = false;
  value: boolean;
  isDisabled = false;
  private onTouchedCallback: () => void;
  private onChangeCallback: (_: any) => void;

  constructor() {
  }

  ngOnInit() {
  }

  onValueChanged($event) {
    this.value = $event;
  }

  toggleShare() {
    this.opened = !this.opened;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(obj: number): void {
    this.startValue = obj === 1 ? true : false;
  }

  cancel() {
    this.opened = false;
    this.value = this.startValue;
  }

  save() {
    this.startValue = this.value;
    this.onChangeCallback(this.value ? 1 : 0);
    this.opened = false;
  }
}
