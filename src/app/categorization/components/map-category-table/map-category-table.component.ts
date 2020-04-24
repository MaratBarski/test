import { Component, OnInit, Input, HostListener, Renderer2 } from '@angular/core';
import { ComponentService } from '@appcore';

@Component({
  selector: 'md-map-category-table',
  templateUrl: './map-category-table.component.html',
  styleUrls: ['./map-category-table.component.scss']
})
export class MapCategoryTableComponent implements OnInit {

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

  selectedItem = undefined;

  constructor(
    private renderer2: Renderer2
  ) { }

  selectItem(eventy: any, item: any, index: number): void {
    ComponentService.documentClick(event);
    this.selectedItem = item;
    const div = document.getElementById(`select_${index}`);
    let margin = 0;
    if (div.offsetHeight + ComponentService.getRect(div).top > window.innerHeight - 50) {
      margin = - div.offsetHeight - 26;
    }
    this.renderer2.setStyle(div, 'margin-top', `${margin}px`)
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    this.selectedItem = undefined;
  }

  changeOldCategory(item: any): void {
    this.selectedItem.hierarchyLevelName = item.hierarchyLevelName;
  }

  ngOnInit() {
  }

}
