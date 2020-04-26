import {Component, Input, OnInit} from '@angular/core';
import {Icon, SwitchButtonModel} from '@appcore';

export enum FieldDataType {
  STRING,
  NUMERIC,
  DATE,
}

@Component({
  selector: 'md-clm-type-switcher',
  templateUrl: './clm-type-switcher.component.html',
  styleUrls: ['./clm-type-switcher.component.scss']
})
export class ClmTypeSwitcherComponent implements OnInit {
  @Input() type: FieldDataType;
  FieldTypeModel: SwitchButtonModel[]
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

}
