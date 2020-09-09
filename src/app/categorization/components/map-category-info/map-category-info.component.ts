import { Component, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { ComponentService, SelectOption, NotificationsService, ToasterType } from '@appcore';
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
    private router: Router,
    private notificationService: NotificationsService
  ) { }

  @Output() onHeadersChanged = new EventEmitter<any>();
  @Output() onChanges = new EventEmitter();

  @Input() set data(data: any) {
    if (!data || !data.data) { return; }
    this._data = data;
    if (!data || !data.data || !this._data.data.hierarchyLevels) { return; }
    const selected = this._data.data.hierarchyLevels.find((x: any) => x.hierarchyLevelId === this._data.data.defaultLevelId);
    if (selected) {
      this.selectedCategory = { id: selected.hierarchyLevelId, text: selected.hierarchyLevelName };
    }
    this.categories = [].concat(this._data.data.hierarchyLevels)
      .sort((a, b) => {
        return a.sortValue > b.sortValue ? -1 : a.sortValue < b.sortValue ? -1 : 0;
      })
      .filter((x: any) => x.sortValue >= 0)
      .map((x: any) => {
        return {
          id: x.hierarchyLevelId,
          text: x.hierarchyLevelName
        }
      });
    //this.categories = [{ id: 0, text: 'Please select...' }].concat(this.categories as any);
  }
  
  get data(): any { return this._data; }
  private _data: any;

  @Input() selectedCategory: SelectOption = { id: 0, text: 'Please select...' }
  categories: Array<SelectOption>;
  showUploadFile = false;

  changeCategory(event: any): void {
    this.selectedCategory = event;
    this.data.data.defaultLevelId = event.id;
    this.onChanges.emit();
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    this.isShowPopup = false;
  }

  isShowPopup = false;
  showPopup(event: any): void {
    const isOpen = this.isShowPopup;
    ComponentService.documentClick(event);
    this.isShowPopup = !isOpen;
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

  showDeleteConfirm = false;

  delete(): void {
    this.showDeleteConfirm = true;
    this.deleteSubTitle = `This action will delete the categorization '${this.data.data.hierarchyName}'.`;
  }

  deleteSubTitle = '';

  confirmDelete(): void {
    this.showDeleteConfirm = false;
    setTimeout(() => {

      this.categorizationService.deleteCategory(this.data.data)
        .toPromise()
        .then(() => {
          this.notificationService.addNotification({
            showInToaster: true,
            name: 'Categorization deleted successfully.',
            comment: 'The categorization is deleted.',
            type: ToasterType.success
          });
          this.router.navigateByUrl('/categorization');
        }).catch((e: any) => {
          this.notificationService.addNotification({
            showInToaster: true,
            name: 'Failed to delete Categorization.',
            comment: '',
            type: ToasterType.error
          });
        });
    }, 1);
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }
}
