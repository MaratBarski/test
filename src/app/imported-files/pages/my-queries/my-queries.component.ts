import { Component, OnInit, ViewChild } from '@angular/core';
import { TableModel, PopupComponent, TableComponent, SwitchButtonModel } from '@appcore';

@Component({
  selector: 'md-my-queries',
  templateUrl: './my-queries.component.html',
  styleUrls: ['./my-queries.component.scss']
})
export class MyQueriesComponent implements OnInit {

  @ViewChild('popupMenu', { static: true }) popupMenu: PopupComponent;
  @ViewChild('table', { static: true }) table: TableComponent;

  isMainExpanded = true;
  isSharedExpanded = true;
  isMyApprovalExpanded = true;
  data: TableModel;
  dataSource: TableModel;

  constructor() { }

  ngOnInit() {

  }

  suggestions = [];
  _suggestions = [
    { name: 'test1 test1 test1' },
    { name: 'test2' },
    { name: 'test3' },
    { name: 'test4' },
    { name: 'test5' },
    { name: 'test6' },
    { name: 'test7' },
    { name: 'test12' },
    { name: 'test13' },
    { name: 'test14' },
    { name: 'test15' },
    { name: 'test5' },
    { name: 'test6' },
    { name: 'test7' },
    { name: 'test8' },
    { name: 'test9' },
    { name: 'value1value1value1value1value1value1value1' },
    { name: 'value2' },
    { name: 'value3' },
    { name: 'value4' },
    { name: 'value5' },
  ]
  completeMethod(text: string): void {
    this.suggestions = this._suggestions.filter(x => x.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
    this.searchText = text;
  }
  selectedItem: any;
  searchText: string;

}
