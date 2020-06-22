import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { animation, RotatedState } from '../../animations/animations';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
    animation.slideUpDown,
    animation.rotateRight90
  ]
})
export class SelectComponent implements ControlValueAccessor, AfterViewInit {
  rotatedState: RotatedState = RotatedState.default;

  constructor(private renderer2: Renderer2) {
  }

  @ViewChild('combo', { static: true }) combo: ElementRef;
  @ViewChild('optionsContainer', { static: true }) optionsContainer: ElementRef;
  @ViewChild('comboTextContainer', { static: true }) comboTextContainer: ElementRef;

  @Input() disabled = false;
  @Input() isSmall = false;
  @Input() options: Array<SelectOption>;
  @Input() selected: SelectOption;
  @Input() placeholder = '';
  @Input() selectUp = false;
  @Input() maxHeight = '';
  @Input() closeOnselect = true;
  @Input() expandHandler: 'click' | 'hover' = 'click';
  @Input() applyWidth = true;
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

  ngAfterViewInit(): void {
    this.setWidth();
  }

  private setWidth(): void {
    if (!this.applyWidth) {
      return;
    }
    let width = this.optionsContainer ? this.optionsContainer.nativeElement.offsetWidth : 0;
    if (width <= 0) {
      return;
    }
    this.renderer2.setStyle(this.comboTextContainer.nativeElement, 'width', `${this.optionsContainer.nativeElement.offsetWidth}px`);
  }
}
