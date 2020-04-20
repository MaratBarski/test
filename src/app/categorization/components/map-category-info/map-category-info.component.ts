import { Component, OnInit, Input } from '@angular/core';
import { SelectOption } from '@appcore';

@Component({
  selector: 'md-map-category-info',
  templateUrl: './map-category-info.component.html',
  styleUrls: ['./map-category-info.component.scss']
})
export class MapCategoryInfoComponent implements OnInit {

  @Input() set data(data: any) {
    if (!data || !data.data) { return; }
    this._data = data;
    if (!data || !data.data || !this._data.data.hierarchyLevels) { return; }
    this.categories = this._data.data.hierarchyLevels.map((x: any) => {
      return {
        id: x.hierarchyLevelId,
        text: x.hierarchyLevelName
      }
    });
  }
  get data(): any { return this._data; }
  private _data: any;

  @Input() selectedCategory: SelectOption = { id: 0, text: 'Please select...' }
  categories: Array<SelectOption>;

  constructor() { }

  ngOnInit() {
  }

  changeCategory(event: any): void {

  }
}
