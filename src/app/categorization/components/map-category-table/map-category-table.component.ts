import { Component, Input, HostListener, Renderer2 } from '@angular/core';
import { ComponentService } from '@appcore';

@Component({
  selector: 'md-map-category-table',
  templateUrl: './map-category-table.component.html',
  styleUrls: ['./map-category-table.component.scss']
})
export class MapCategoryTableComponent {

  @Input() set oldCategories(oldCategories: any) {
    this._oldCategories = [this.newCategoryDefault].concat(oldCategories);
    this.initMap();
  }
  get oldCategories(): any {
    return this._oldCategories;
  }
  private _oldCategories: any;

  newCategoryDefault = { hierarchyLevelName: '---new---', sortValue: -1, inUse: true };

  @Input() set data(data: any) {
    this._data = data;
    if (!this._data || !this._data.data || !this._data.data.hierarchyLevels) { return; }
    this.categoryMap = [];
    this._data.data.hierarchyLevels.forEach((item: any) => {
      item.newHierarchyLevelName = item.hierarchyLevelName;
      this.categoryMap.push({ newCategory: item, oldCategory: this.newCategoryDefault });
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

  selectItem(event: any, item: any, index: number): void {
    if (this.selectedItem === item) {
      ComponentService.documentClick(event);
      return;
    }
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

  changeOldCategory(oldCategoryItem: any, newCategoryItem: any): void {
    if (this.newCategoryDefault !== newCategoryItem.oldCategory) {
      newCategoryItem.oldCategory.inUse = false;
    }
    newCategoryItem.oldCategory = oldCategoryItem;
    newCategoryItem.oldCategory.inUse = true;
  }

  categoryMap = [];
  initMap(): void {
    if (!this._data || !this._data.data || !this._data.data.hierarchyLevels) { return; }
    this.categoryMap.forEach((level: any, index: number) => {
      const oldCategory = this.findOldcategory(level.newCategory);
      if (oldCategory) {
        level.oldCategory = oldCategory;
        level.oldCategory.inUse = true;
      } else {
        level.oldCategory = this.newCategoryDefault;
      }
    });
  }

  findOldcategory(level: any): any {
    return this.oldCategories.find((x: any) => x.hierarchyLevelName === level.hierarchyLevelName);
  }
}
