import { Component, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { animation } from '../../animations/animations';

const noop = () => { };

export const ACCORDION_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AccordionComponent),
  multi: true
};

export enum RotateAnimationState {
  initState = 'default',
  rotate = 'rotated'
}

@Component({
  selector: 'mdc-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css'],
  providers: [ACCORDION_VALUE_ACCESSOR],
  animations: [
    animation.rotateRight90,
    animation.slideUpDown
  ],
})
export class AccordionComponent implements ControlValueAccessor {

  @Output() onStateChange = new EventEmitter<boolean>();

  changeState(): void {
    this.value = !this.value;
    this.rotateState = !this.value ? RotateAnimationState.rotate : RotateAnimationState.initState;
    this.onStateChange.emit(this.value);
  }
  public rotateState;
  private _value: boolean;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this.rotateState = !this.value ? 'rotated' : 'default';
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
