import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { ComponentService } from '@appcore';

@Component({
  selector: 'md-map-category-header',
  templateUrl: './map-category-header.component.html',
  styleUrls: ['./map-category-header.component.scss']
})
export class MapCategoryHeaderComponent {

  @Output() onChange = new EventEmitter<string>();
  @Output() onHeadersChanged = new EventEmitter<any>();

  @Input() isMap = false;
  @Input() pageTitle = 'Map categories';
  @Input() set data(data: any) {
    this._data = data;
    if (!this._data || !this._data.data) { return; }
    this.hierarchyName = this._data.data.hierarchyName;
    this.resetDescription();
  }
  get data(): any { return this._data; }
  private _data: any;

  description = '';
  hierarchyName = '';

  updateName(event: any): void {
    this.hierarchyName = event.target.innerText;
    this.onChange.emit(this.hierarchyName);
  }

  get isValid(): boolean {
    return !!(this.hierarchyName && this.hierarchyName.trim());
  }

  isShowDescription = false;
  showDescription(event: any): void {
    ComponentService.documentClick(event);
    this.isShowDescription = !this.isShowDescription;
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    this.isShowDescription = false;
  }

  cancelDescription(): void {
    this.isShowDescription = false;
    this.resetDescription();
  }

  apllyDescription(): void {
    this.isShowDescription = false;
    this.updateDescription();
  }

  private resetDescription(): void {
    if (!this._data || !this._data.data || !this._data.data.description) { return; }
    this.description = this._data.data.description;
  }

  private updateDescription(): void {
    if (!this._data || !this._data.data) { return; }
    this._data.data.description = this.description;
  }

  keyDown(event: any): void {
    if (event.keyCode === 13) {
      event.preventDefault();
    }
  }

  showUploadFile = false;
  showFileUpload(): void {
    this.showUploadFile = true;
  }
  cancelUploadFile(): void {
    this.showUploadFile = false;
  }

  onChangeUploadFile(event: any): void {
    this.showUploadFile = false;
    this.onHeadersChanged.emit(event);
  }
}

