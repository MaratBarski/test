import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'md-map-category-header',
  templateUrl: './map-category-header.component.html',
  styleUrls: ['./map-category-header.component.scss']
})
export class MapCategoryHeaderComponent {

  @Output() onChange = new EventEmitter<string>();
  @Input() pageTitle = 'Map categories';
  @Input() set data(data: any) {
    this._data = data;
    if (!this._data || !this._data.data) { return; }
    this.hierarchyName = this._data.data.hierarchyName;
  }
  get data(): any { return this._data; }
  private _data: any;
  
  hierarchyName = '';

  updateName(event: any): void {
    this.hierarchyName = event.target.innerText;
    this.onChange.emit(this.hierarchyName);
  }

  get isValid(): boolean {
    return !!(this.hierarchyName && this.hierarchyName.trim());
  }

}

