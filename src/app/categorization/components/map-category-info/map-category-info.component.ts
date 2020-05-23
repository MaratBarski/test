import { Component, Input, EventEmitter, Output } from '@angular/core';
import { SelectOption } from '@appcore';

@Component({
  selector: 'md-map-category-info',
  templateUrl: './map-category-info.component.html',
  styleUrls: ['./map-category-info.component.scss']
})
export class MapCategoryInfoComponent {

  @Output() onHeadersChanged = new EventEmitter<any>();
  
  @Input() set data(data: any) {
    if (!data || !data.data) { return; }
    this._data = data;
    if (!data || !data.data || !this._data.data.hierarchyLevels) { return; }
    const selected = this._data.data.hierarchyLevels.find((x: any) => x.hierarchyLevelId === this._data.data.defaultLevelId);
    if (selected) {
      this.selectedCategory = { id: selected.hierarchyLevelId, text: selected.hierarchyLevelName };
    }
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

  changeCategory(event: any): void {
    this.selectedCategory = event;
    this.data.data.defaultLevelId = event.id;
  }

  get isValid(): boolean {
    return true;
  }

  cancelUploadFile(): void {
    this.showUploadFile = false;
  }

  onChangeUploadFile(event: any): void {
    this.showUploadFile = false;
    this.onHeadersChanged.emit(event);
  }

  showUploadFile = false;

  replace(): void {
    this.showUploadFile = true;
  }

  download(): void {
  }

  delete(): void {
  }
}
