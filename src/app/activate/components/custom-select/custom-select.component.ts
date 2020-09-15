import {AfterViewInit, Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {animation, RotatedState, SelectComponent, SelectOption} from '@appcore';

export const SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent),
  multi: true
};

@Component({
  selector: 'md-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  providers: [SELECT_VALUE_ACCESSOR],
  animations: [
    animation.slideUpDown,
    animation.rotateRight90
  ]
})
export class CustomSelectComponent implements ControlValueAccessor {
  rotatedState: RotatedState = RotatedState.default;
  isExpanded = false;
  isOver = false;

  @Input() disabled = false;
  @Input() isSmall = false;
  @Input() options: Array<SelectOption>;
  @Input() selected: SelectOption;
  @Input() placeholder = '';
  @Input() selectUp = false;
  @Input() maxHeight = '';
  @Input() closeOnselect = true;
  @Input() applyWidth = true;
  @Input() isInvalid = false;
  @Output() changed = new EventEmitter<SelectOption>();
  constructor() { }

  select(option: SelectOption): void {
    if (this.closeOnselect) {
      this.isExpanded = false;
    }
    this.rotatedState = RotatedState.default;
    this.selected = option;
    this.value = option.value;
    this.changed.emit(this.selected);
    this.onChangeCallback(this.selected.id);
  }

  mouseClick(event: any): void {
    if (!this.options || !this.options.length) { return; }
    if (!this.disabled) {
      this.isExpanded = !this.isExpanded;
      this.rotatedState = this.isExpanded ? RotatedState.rotated : RotatedState.default;
    }
  }

  blur() {
    this.isExpanded = false;
    this.rotatedState = RotatedState.default;
  }

  onChangeCallback = (value: any) => {
  };
  onTouchedCallback = () => {
  };

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
    // for id type number only
    if (!isNaN(value)) {
      value = Number(value);
      if (this.options) {
        this.selected = this.options.find((option: SelectOption) => Number(option.id) === value);
      }
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
