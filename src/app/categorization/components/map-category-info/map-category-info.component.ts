import { Component, Input, EventEmitter, Output } from '@angular/core';
import { SelectOption } from '@appcore';
import { CategorizationService } from '@app/categorization/services/categorization.service';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'md-map-category-info',
  templateUrl: './map-category-info.component.html',
  styleUrls: ['./map-category-info.component.scss']
})
export class MapCategoryInfoComponent {

  constructor(
    private categorizationService: CategorizationService,
    private router: Router
  ) { }

  @Output() onHeadersChanged = new EventEmitter<any>();

  @Input() set data(data: any) {
    if (!data || !data.data) { return; }
    this._data = data;
    if (!data || !data.data || !this._data.data.hierarchyLevels) { return; }
    const selected = this._data.data.hierarchyLevels.find((x: any) => x.hierarchyLevelId === this._data.data.defaultLevelId);
    if (selected) {
      this.selectedCategory = { id: selected.hierarchyLevelId, text: selected.hierarchyLevelName };
    }
    this.categories = this._data.data.hierarchyLevels
      .filter((x:any) => x.sortValue >= 0)
      .map((x: any) => {
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
  showUploadFile = false;

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

  fileData: any;

  onChangeUploadFile(event: any): void {
    this.showUploadFile = false;
    this.categories = [];
    if (event.categoryHeaders && event.categoryHeaders.length) {
      this.categories = event.categoryHeaders.map((x: any, i: number) => { return { id: i, text: x } });
      let defaultCategory = parseInt(event.defaultCategory);
      if (isNaN(defaultCategory)) { defaultCategory = 0; }
      this.selectedCategory = this.categories[defaultCategory];
    }
    this.fileData = event;
    this.onHeadersChanged.emit(event);
  }

  replace(): void {
    this.showUploadFile = true;
  }

  download(): void {
    window.open(`${environment.serverUrl}${environment.endPoints.downloadCategory}/${this.data.data.hierarchyRootId}`)
  }

  delete(): void {
    this.categorizationService.deleteCategory(this.data.data)
      .toPromise()
      .then(() => {
        this.router.navigateByUrl('/categorization');
      }).catch((e: any) => {
        alert(e.message);
      });
  }
}
