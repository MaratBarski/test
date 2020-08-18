import { Component, OnInit, ViewChild } from '@angular/core';
import { EditCategoryService } from '@app/categorization/services/edit-category.service';
import { BaseSibscriber, NavigationService, PageInfo, NotificationStatus, ToasterType } from '@appcore';
import { MapCategoryInfoComponent } from '@app/categorization/components/map-category-info/map-category-info.component';
import { EditCategoryTableComponent } from '@app/categorization/components/edit-category-table/edit-category-table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MapCategoryHeaderComponent } from '@app/categorization/components/map-category-header/map-category-header.component';
import { MapCategoryTableComponent } from '@app/categorization/components/map-category-table/map-category-table.component';
import { UploadService, UploadInfo } from '@app/shared/services/upload.service';
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

  showChangesConfirm = false;
  isHasChanges = false;
  redirectUrl = '';

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
    this.navigationService.beforeNavigate = ((url: string) => {
      if (url) {
        this.redirectUrl = url;
      }
      if (this.isHasChanges) {
        this.showChangesConfirm = !!url;
        return true;
      }
      if (url) {
        this.router.navigateByUrl(url);
      }
    });

    super.add(
      this.activatedRoute.paramMap.subscribe(u => {
        const id = u.get('id');
        super.add(
          this.editCategoryService.load(id).subscribe((res: any) => {
            if (!res || !res.data || res.data.status === 'unmapped') {
              this.router.navigateByUrl('/categorization');
            }
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

    const objToSend = {
      hierarchyName: category.data.hierarchyName,
      projectId: category.data.projectId,
      description: category.data.description,
      defaultLevelId: category.data.defaultLevelId,
      message: category.data.notificationMessage,
      hierarchyLevels: []
      //hierarchyLevels: {}
    };

    category.data.hierarchyLevels
      .filter((x: any) => x.sortValue >= 0)
      .forEach((l: any) => {
        objToSend.hierarchyLevels.push({
          hierarchyLevelId: l.hierarchyLevelId,
          hierarchyLevelName: l.hierarchyLevelName
        });
        //objToSend.hierarchyLevels[l.hierarchyLevelId] = l.hierarchyLevelName;
      });

    //document.write(JSON.stringify(objToSend));

    this.isLoading = true;
    this.isSaving = true;
    super.add(
      this.editCategoryService.save(objToSend, category.data.hierarchyRootId).subscribe((res: any) => {
        this.isLoading = false;
        this.isSaving = false;
        this.router.navigateByUrl('/categorization')
      }));
  }

  private _uploadUrl = `${environment.serverUrl}${environment.endPoints.replaceHierarchy}`
  isSaving = false;

  private replaceCategory(): void {
    this.isHasChanges = true;
    if (!this.mapCategoryTable.validate()) { return; }
    //const formData = this.categoryInfo.fileData.formData as FormData;

    const formData = new FormData();
    formData.append('file', (this.categoryInfo.fileData.formData as FormData).get('file'));
    const categorization = {
      levels: {},
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
      message: this.selectedCategory.data.notificationMessage,
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
    this.updateForSave(categorization);

    formData.append('hierarchyName', categorization.hierarchyName);
    formData.append('projectId', categorization.projectId);
    formData.append('description', categorization.description);
    formData.append('defaultLevelId', categorization.defaultLevelId);
    formData.append('message', categorization.message);
    formData.append('hierarchyLevels', JSON.stringify(categorization.levels));


    // const test = {};
    // test['hierarchyName'] = categorization.hierarchyName;
    // test['projectId'] = categorization.projectId;
    // test['description'] = categorization.description;
    // test['defaultLevelId'] = categorization.defaultLevelId;
    // test['message'] = categorization.message;
    // test['hierarchyLevels'] = JSON.stringify(categorization.levels);
    // document.write(JSON.stringify(test));

    this.uploadService.add({
      notification: {
        name: 'Uploading Categorization',
        comment: 'You will be notified when its ready for review.',
        failName: 'Replace Categorization Failed',
        failComment: 'Upload error',
        succName: 'Categorization file uploaded successfully.',
        abortName: 'Categorization UPLOAD ABORTED BY USER',
        progress: 0,
        status: NotificationStatus.uploading,
        showProgress: true,
        showInContainer: true,
        succComment: `Upload of ${categorization.hierarchyName} was successful and it is ready for review.`,
        startDate: new Date(),
        progressTitle: this.categoryInfo.fileData.formData.get('fileName'),
        showInToaster: true,
        type: ToasterType.infoProgressBar
      },
      form: formData,
      url: `${this._uploadUrl}/${categorization.hierarchyRootId}`,
      method: 'put',
      afterUpload: ((response: any, notifiuploadInfo: UploadInfo) => {
      })
      //targetComponent: this.targetComponent
    });
    this.router.navigateByUrl('/categorization')
  }

  private updateForSave(category: any): void {
    category.defaultLevelId = category.defaultCategory.id;
    category.levels = {}
    category.hierarchyLevels.forEach((l: any) => {
      category.levels[l.newCategory.sortValue] = l.oldCategory.hierarchyLevelId;
    });
  }

  cancel(): void {
    this.navigationService.navigate('/categorization');
  }

  onNameChange(name: string): void {
    this.isHasChanges = true;
    this.selectedCategory.data.hierarchyName = name;
  }

  oldCategories = [];
  formData: FormData;

  onHeadersChanged(event: any): void {
    this.isHasChanges = true;
    this.mode = 'replace';
    this.formData = event.formData;
    this.oldCategories = event.categoryHeaders.map((str: any, i: number) => {
      return {
        hierarchyLevelName: str,
        sortValue: i
      };
    });
  }

  onChanges(): void {
    this.isHasChanges = true;
  }

  cancelChanges(): void {
    this.showChangesConfirm = false;
  }

  confirmChanges(): void {
    this.showChangesConfirm = false;
    this.router.navigateByUrl(this.redirectUrl || '/categorization');
  }
}
