import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { animation, SlideInOutState } from '../../animations/animations';
import { ComponentService } from '../../services/component.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export class SelectOption {
  id: string | number;
  text: string;
  icon?: string;
  value?: any;
}

export const SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent),
  multi: true
};

@Component({
  selector: 'mdc-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [SELECT_VALUE_ACCESSOR],
  animations: [
    animation.slideUpDown
  ]
})
export class SelectComponent implements ControlValueAccessor {

  @ViewChild('combo', { static: true }) combo: ElementRef;

  @Input() options: Array<SelectOption>;
  @Input() selected: SelectOption;
  @Input() selectUp = false;
  @Input() maxHeight = '';
  @Input() closeOnselect = true;
  @Input() expandHandler: 'click' | 'hover' = 'click';

  @Output() changed = new EventEmitter<SelectOption>();

  isExpanded = false;
  isOver = false;

  select(option: SelectOption): void {
    if (this.closeOnselect) {
      this.isExpanded = false;
    }
    this.selected = option;
    this.value = option.value;
    this.changed.emit(this.selected);
  }

  mouseClick(event: any): void {
    this.isExpanded = !this.isExpanded;
  }

  blur() {
    this.isExpanded = false;
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
