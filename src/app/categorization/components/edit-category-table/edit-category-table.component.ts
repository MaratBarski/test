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

  validateItem(item: any): void {
    this._isValid = (this._data.data.hierarchyLevels.filter((x: any) => {
      return !!!x.newHierarchyLevelName || !!!x.newHierarchyLevelName.trim();
    }).length === 0);

    // if (!this._isValid) { return; }
    // const dict = {};
    // this._data.data.hierarchyLevels.forEach((x: any) => {
    //   if (dict[x.newHierarchyLevelName.trim().toLowerCase()]) {
    //     this._isValid = false;
    //     return;
    //   }
    //   dict[x.newHierarchyLevelName.trim().toLowerCase()] = true;
    // });
  }

  get isValid(): boolean {
    return this._isValid;
  }
  private _isValid = true;
}
