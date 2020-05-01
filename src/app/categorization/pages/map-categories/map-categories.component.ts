import { Component, OnInit, ViewChild } from '@angular/core';
import { MapCategoryService } from '@app/categorization/services/map-category.service';
import { BaseSibscriber, NavigationService, PageInfo, NotificationStatus } from '@appcore';
import { MapCategoryTableComponent } from '@app/categorization/components/map-category-table/map-category-table.component';
import { map, take } from 'rxjs/operators';
import { Offline } from '@app/shared/decorators/offline.decorator';
import { environment } from '@env/environment';
import { UploadService } from '@app/shared/services/upload.service';

@Component({
  selector: 'md-map-categories',
  templateUrl: './map-categories.component.html',
  styleUrls: ['./map-categories.component.scss']
})
export class MapCategoriesComponent extends BaseSibscriber implements OnInit {

  @ViewChild('mapCategoryTable', { static: false }) mapCategoryTable: MapCategoryTableComponent;
  selectedCategory: any;
  get isValid(): boolean {
    return !!this.formData;
  }

  constructor(
    private mapCategoryService: MapCategoryService,
    private navigationService: NavigationService,
    private uploadService: UploadService
  ) {
    super();
    this.navigationService.currentPageID = undefined;//PageInfo.ManageHierarchies.id;
  }

  ngOnInit(): void {    
    super.add(
      this.mapCategoryService.load().subscribe((res: any) => {
        this.selectedCategory = res;
      }));
  }

  
  @Offline('http://localhost:57858/api/Config/')
  private _uploadUrl = `${environment.serverUrl}${environment.endPoints.uploadHierarchy}`;
  
  save(): void {
    this.formData.set('categoryMap', JSON.stringify(this.mapCategoryTable.categoryMap));
    this.uploadService.add({
      notification: {
        name: 'Categorization',
        comment: 'Uploading',
        progress: 0,
        status: NotificationStatus.uploading,
        showProgress: true,
        showInContainer: true,
        startDate: new Date(),
        progressTitle: this.formData.get('fileName').toString()
      },
      form: this.formData,
      url: this._uploadUrl,
    });
  }

  cancel(): void {
    alert('cancel')
  }

  oldCategories = [];
  formData: FormData;

  onHeadersChanged(event: any): void {
    this.formData = event.formData;
    this.oldCategories = event.categoryHeaders.map((str: any, i: number) => {
      return { hierarchyLevelName: str, sortValue: i };
    });
  }
}
