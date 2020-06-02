import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ViewChild,
  ElementRef,
  forwardRef,
  AfterContentInit,
  AfterViewInit,
  Renderer2
} from '@angular/core';
import {animation} from '../../animations/animations';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

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
export class SelectComponent implements ControlValueAccessor, AfterViewInit {

  constructor(private renderer2: Renderer2) {
  }

  @ViewChild('combo', {static: true}) combo: ElementRef;
  @ViewChild('optionsContainer', {static: true}) optionsContainer: ElementRef;
  @ViewChild('comboTextContainer', {static: true}) comboTextContainer: ElementRef;

  @Input() disabled = false;
  @Input() isSmall = false;
  @Input() options: Array<SelectOption>;
  @Input() selected: SelectOption;
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
    if (!this.disabled) {
      this.isExpanded = !this.isExpanded;
    }
  }

  blur() {
    this.isExpanded = false;
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
      this.selected = this.options.find((option: SelectOption) => Number(option.id) === value);
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
