import { Component, OnInit, ViewChild } from '@angular/core';
import { EditCategoryService } from '@app/categorization/services/edit-category.service';
import { BaseSibscriber, NavigationService, PageInfo, NotificationStatus, ToasterType } from '@appcore';
import { MapCategoryInfoComponent } from '@app/categorization/components/map-category-info/map-category-info.component';
import { EditCategoryTableComponent } from '@app/categorization/components/edit-category-table/edit-category-table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MapCategoryHeaderComponent } from '@app/categorization/components/map-category-header/map-category-header.component';
import { MapCategoryTableComponent } from '@app/categorization/components/map-category-table/map-category-table.component';
import { UploadService } from '@app/shared/services/upload.service';
import { environment } from '@env/environment';

@Component({
  selector: 'md-edit-categories',
  templateUrl: './edit-categories.component.html',
  styleUrls: ['./edit-categories.component.scss']
})
export class EditCategoriesComponent extends BaseSibscriber implements OnInit {

  get isValid(): boolean {
    return true;
    // return this.categoryHeader && this.categoryHeader.isValid
    //   && this.categoryInfo && this.categoryInfo.isValid
    //   && this.categoryTable && this.categoryTable.isValid;
  }
  selectedCategory: any;
  isLoading = false;
  mode: 'edit' | 'replace' = 'edit';

  @ViewChild('categoryHeader', { static: true }) categoryHeader: MapCategoryHeaderComponent;
  @ViewChild('categoryInfo', { static: true }) categoryInfo: MapCategoryInfoComponent;
  @ViewChild('categoryTable', { static: false }) categoryTable: EditCategoryTableComponent;
  @ViewChild('mapCategoryTable', { static: false }) mapCategoryTable: MapCategoryTableComponent;

  constructor(
    private editCategoryService: EditCategoryService,
    private navigationService: NavigationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private uploadService: UploadService
  ) {
    super();
    this.navigationService.currentPageID = undefined;//PageInfo.ManageHierarchies.id;
  }

  ngOnInit(): void {
    super.add(
      this.activatedRoute.paramMap.subscribe(u => {
        const id = u.get('id');
        super.add(
          this.editCategoryService.load(id).subscribe((res: any) => {
            this.selectedCategory = res;
            if (!res || !res.data || !res.data.hierarchyLevels) { return; }
            this.selectedCategory.data.hierarchyLevels = this.editCategoryService.sortHierarchyLevels(this.selectedCategory.data.hierarchyLevels);
          }));
      }));
  }

  save(): void {
    if (!this.selectedCategory) { return; }
    if (!this.selectedCategory.data) { return; }
    if (!this.selectedCategory.data.hierarchyLevels) { return; }
    if (this.mode === 'edit') {
      this.updateCategory();
      return;
    }
    this.replaceCategory();
  }

  private updateCategory(): void {
    const category = JSON.parse(JSON.stringify(this.selectedCategory));
    //alert(this.selectedCategory.data.notificationMessage);
    //alert(this.selectedCategory.data.description);
    //alert(this.selectedCategory.data.defaultLevelId);
    //alert(this.selectedCategory.data.hierarchyName);
    //alert(this.selectedCategory.data.hierarchyLevels[0].newHierarchyLevelName);
    category.data.hierarchyLevels.forEach((item: any) => {
      item.hierarchyLevelName = item.newHierarchyLevelName
      delete item.newHierarchyLevelName;
    });
    this.isLoading = true;
    super.add(
      this.editCategoryService.save(category).subscribe((res: any) => {
        this.isLoading = false;
        this.router.navigateByUrl('/categorization')
      }));
  }

  private _uploadUrl = `${environment.serverUrl}${environment.endPoints.replaceHierarchy}`

  private replaceCategory(): void {
    if (!this.mapCategoryTable.validate()) { return; }
    const formData = this.categoryInfo.fileData.formData as FormData;
    const categorization = {
      hierarchyRootId: this.selectedCategory.data.hierarchyRootId,
      description: this.categoryHeader.description,
      domain: this.selectedCategory.data.domain,
      hierarchyFile: this.selectedCategory.data.hierarchyFile,
      hierarchyName: this.categoryHeader.hierarchyName,
      projectId: this.selectedCategory.data.projectId,
      hierarchyFilePath: this.selectedCategory.data.hierarchyFilePath,
      insertDate: this.selectedCategory.data.insertDate,
      defaultLevelId: this.selectedCategory.data.defaultLevelId,//this.categoryInfo.selectedCategory.id
      hierarchyLoadingType: this.selectedCategory.data.hierarchyLoadingType,
      notificationMessage: this.selectedCategory.data.notificationMessage,
      defaultCategory: {
        name: this.categoryInfo.selectedCategory.text,
        id: this.categoryInfo.selectedCategory.id
      },
      hierarchyLevels: this.mapCategoryTable.oldCategories.map((c: any, index: number) => {
        return {
          newCategory: {
            hierarchyLevelName: c.hierarchyLevelName,
            hierarchyLevelId: 0,
            sortValue: index,
            dataSample: '',
            hierarchyRootId: this.selectedCategory.data.hierarchyRootId
          },
          oldCategory: {
            hierarchyLevelId: c.oldCategory.hierarchyLevelId || 0,
            hierarchyLevelName: c.oldCategory.hierarchyLevelName,
            sortValue: c.oldCategory.sortValue,
            dataSample: c.oldCategory.dataSample || '',
          }
        };
      })
    };
    formData.append('categorization', JSON.stringify(categorization));

    //document.write(JSON.stringify(categorization));

    this.uploadService.add({
      notification: {
        name: 'Categorization',
        comment: 'Uploading',
        progress: 0,
        status: NotificationStatus.uploading,
        showProgress: true,
        showInContainer: true,
        startDate: new Date(),
        progressTitle: this.categoryInfo.fileData.formData.get('fileName'),
        showInToaster: true,
        type: ToasterType.infoProgressBar
      },
      form: formData,
      url: this._uploadUrl,
      //targetComponent: this.targetComponent
    });
    this.router.navigateByUrl('/categorization')
  }

  cancel(): void {
    this.router.navigateByUrl('/categorization');
  }

  onNameChange(name: string): void {
    this.selectedCategory.data.hierarchyName = name;
  }

  oldCategories = [];
  formData: FormData;

  onHeadersChanged(event: any): void {
    this.mode = 'replace';
    this.formData = event.formData;
    this.oldCategories = event.categoryHeaders.map((str: any, i: number) => {
      return {
        hierarchyLevelName: str,
        sortValue: i
      };
    });
  }
}
