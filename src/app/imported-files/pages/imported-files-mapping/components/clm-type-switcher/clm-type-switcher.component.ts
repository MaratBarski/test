import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {Icon, SwitchButtonComponent, SwitchButtonModel} from '@appcore';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export enum FieldDataType {
  STRING,
  NUMERIC,
  DATE,
}

@Component({
  selector: 'md-clm-type-switcher',
  templateUrl: './clm-type-switcher.component.html',
  styleUrls: ['./clm-type-switcher.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ClmTypeSwitcherComponent),
    multi: true
  }]
})
export class ClmTypeSwitcherComponent implements OnInit, ControlValueAccessor {
  @Input() type: FieldDataType;
  FieldTypeModel: SwitchButtonModel[];
  selType: FieldDataType;
  onChanged: (_) => {};
  onTouched: () => {}
  constructor() {
    this.FieldTypeModel = [
      {
        disable: false,
        value: false,
        icon: Icon.textual
      },
      {
        disable: false,
        value: false,
        icon: Icon.numeric
      },
      {
        disable: false,
        value: false,
        icon: Icon.date
      }
    ];
  }

  ngOnInit() {
  }

  onTypeChanged($event) {
    this.selType = $event;
    this.onChanged($event);
  }

  registerOnChange(fn: (value: FieldDataType) => {}): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.FieldTypeModel = this.FieldTypeModel.map(item => {
      item.disable = true;
      return item;
    });
  }

  writeValue(type: FieldDataType): void {
    switch (type) {
      case FieldDataType.STRING:
        this.FieldTypeModel[FieldDataType.STRING].value = true;
        this.FieldTypeModel[FieldDataType.STRING].disable = false;
        this.FieldTypeModel[FieldDataType.NUMERIC].value = false;
        this.FieldTypeModel[FieldDataType.NUMERIC].disable = true;
        this.FieldTypeModel[FieldDataType.DATE].value = false;
        this.FieldTypeModel[FieldDataType.DATE].disable = true;
        break;
      case FieldDataType.NUMERIC:
        this.FieldTypeModel[FieldDataType.STRING].value = false;
        this.FieldTypeModel[FieldDataType.STRING].disable = false;
        this.FieldTypeModel[FieldDataType.NUMERIC].value = true;
        this.FieldTypeModel[FieldDataType.NUMERIC].disable = false;
        this.FieldTypeModel[FieldDataType.DATE].value = false;
        this.FieldTypeModel[FieldDataType.DATE].disable = true;
        break;
      case FieldDataType.DATE:
        this.FieldTypeModel[FieldDataType.STRING].value = false;
        this.FieldTypeModel[FieldDataType.STRING].disable = false;
        this.FieldTypeModel[FieldDataType.NUMERIC].value = false;
        this.FieldTypeModel[FieldDataType.NUMERIC].disable = true;
        this.FieldTypeModel[FieldDataType.DATE].value = true;
        this.FieldTypeModel[FieldDataType.DATE].disable = false;
        break;
    }
    this.selType = type;
  }
}
