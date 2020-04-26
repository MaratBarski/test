import { Component, OnInit } from '@angular/core';
import {SwitchButtonModel} from '@appcore';

export enum FieldType{

}

@Component({
  selector: 'md-clm-type-switcher',
  templateUrl: './clm-type-switcher.component.html',
  styleUrls: ['./clm-type-switcher.component.scss']
})
export class ClmTypeSwitcherComponent implements OnInit {
  FieldTypeModel: SwitchButtonModel[]
  constructor() {
    this.FieldTypeModel = [
      {
        disable: false,
        value: false,
        icon: ''
      },
      {
        disable: false,
        value: false,
        icon: ''
      },
      {
        disable: false,
        value: false,
        icon: ''
      }
    ];
  }

  ngOnInit() {
  }

}
