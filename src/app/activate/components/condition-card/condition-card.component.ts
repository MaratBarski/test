import {Component, Input, OnInit} from '@angular/core';
import {IColumn} from '@app/activate/model/interfaces/IColumn';
import {SelectOption} from '@appcore';

@Component({
  selector: 'md-condition-card',
  templateUrl: './condition-card.component.html',
  styleUrls: ['./condition-card.component.scss']
})
export class ConditionCardComponent implements OnInit {
  @Input() set item(val: IColumn) {
    this.column = val;
  }

  column: IColumn;
  selectOptions: Array<SelectOption> = [];

  // @Input() selectOption: Array<SelectOption>;
  @Input() set collection(val: Array<IColumn>) {
    val.forEach(col => {
      this.selectOptions.push({
        id: col.physicalName,
        text: col.aliasName,
        value: col.aliasName
      });
    });
  }

  constructor() {
  }

  ngOnInit() {
  }

}
