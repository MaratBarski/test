import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'md-edit-category-table',
  templateUrl: './edit-category-table.component.html',
  styleUrls: ['./edit-category-table.component.scss']
})
export class EditCategoryTableComponent implements OnInit {

  @Input() set data(data: any) {
    this._data = data;
    if (!this._data || !this._data.data || !this._data.data.hierarchyLevels) { return; }
    this._data.data.hierarchyLevels.forEach((item: any) => {
      item.newHierarchyLevelName = item.hierarchyLevelName;
    });
  }
  get data(): any {
    return this._data;
  }
  private _data: any;
  
  constructor() { }

  ngOnInit() {
  }

}
