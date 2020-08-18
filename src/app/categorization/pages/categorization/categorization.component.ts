import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationsService, BaseSibscriber, TableModel, TableComponent, PageInfo, NavigationService, TableActionCommand, EmptyState, ToasterType } from '@appcore';
import { CategorizationService } from '@app/categorization/services/categorization.service';
import { CategoryInfoComponent } from '@app/categorization/components/category-info/category-info.component';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { DownloadService } from '@app/shared/services/download.service';

@Component({
  selector: 'md-categorization',
  templateUrl: './categorization.component.html',
  styleUrls: ['./categorization.component.scss']
})
export class CategorizationComponent extends BaseSibscriber implements OnInit {

  emptyState: EmptyState = {
    title: 'Categorization makes the data accessible. Start by clicking the button above.',
    subTitle: 'Your categorization will be listed here.',
    image: 'categoryEmpty.png'
  }

  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('categorizationInfo', { static: true }) categorizationInfo: CategoryInfoComponent;

  showUploadFile = false;
  dataOrigin: TableModel;
  dataSource: TableModel;
  categorySource: Array<any>;
  currentRow = { state: true, source: undefined };
  currentSource: any = undefined;

  constructor(
    private categorizationService: CategorizationService,
    private navigationService: NavigationService,
    private router: Router,
    private downloadService: DownloadService,
    private notificationService: NotificationsService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.ManageHierarchies.id;
  }

  searchOptions = ['hierarchyName', 'hierarchyFile', 'insertDate', 'domain'];

  isDataExists = true;
  isLoaded = false;

  showInfo(event: any, item: any, source: any): void {
    this.currentRow.state = true;
    this.currentRow.source = source;
    item.showWarning = true;
  }

  rowStateChange(state: boolean): void {
    if (!this.currentRow.source) { return; }
    this.currentRow.source.hierarchyLoadingType = 'etl';
    this.currentRow.source.hierarchyChange = state;
    this.categorizationService.updateHierarchyChange(this.currentRow.source, state);
  }

  onAction(action: TableActionCommand): void {
    this.execCommand[action.command](action);
  }

  showDeleteConfirm = false;
  currentItemForDelete: any;
  deleteSubTitle = '';

  execCommand = {
    edit: (action: TableActionCommand) => {
      this.router.navigate(['/categorization/edit-categories', { id: action.item.source.hierarchyRootId }]);
    },
    map: (action: TableActionCommand) => {
      this.router.navigate(['/categorization/map-categories', { id: action.item.source.hierarchyRootId }]);
    },
    download: (action: TableActionCommand) => {
      this.downloadService.download(`${environment.serverUrl}${environment.endPoints.downloadCategory}/${action.item.source.hierarchyRootId}`);
    },
    delete: (action: TableActionCommand) => {
      this.showDeleteConfirm = true;
      this.currentItemForDelete = action.item;
      this.deleteSubTitle = `This action will delete the categorization '${this.currentItemForDelete.source.hierarchyName}'.`;
    }
  };

  confirmDelete(): void {
    if (!this.currentItemForDelete) { return; }
    this.showDeleteConfirm = false;
    this.currentItemForDelete.isInactive = true;
    const tempItem = this.currentItemForDelete;
    setTimeout(() => {
      this.categorizationService.deleteCategory(this.currentItemForDelete.source)
        .toPromise()
        .then(res => {
          this.notificationService.addNotification({
            showInToaster: true,
            name: 'Categorization deleted successfully.',
            comment: 'The categorization is deleted.',
            type: ToasterType.success
          });
          this.categorySource = this.categorySource.filter(x => x != this.currentItemForDelete.item.source);
          this.initData();
          this.table.stayOnCurrentPage = true;
        }).catch(e => {
          tempItem.isInactive = false;
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

  private initData(): void {
    this.isDataExists = !!(this.categorySource && this.categorySource.length);
    this.dataOrigin = this.dataSource = this.categorizationService.createDataSource(this.categorySource);
    this.isLoaded = true;
  }

  ngOnInit() {
    this.isLoaded = false;
    super.add(
      this.categorizationService.load().subscribe((res: any) => {
        this.categorySource = res.data;
        this.initData();
      }));
    this.onComplete = (): void => {
      super.add(
        this.categorizationService.load().subscribe((res: any) => {
          this.categorySource = res.data || [];
          this.initData();
          this.table.stayOnCurrentPage = true;
        }));
    }
  }

  closeCategoryInfo(): void {
    this.table.closeRowInfo();
  }

  openUploadNew(): void {
    this.currentSource = undefined;
    this.showUploadFile = true;
  }

  get me(): CategorizationComponent { return this; }

  onComplete: any;

  ngOnDestroy(): void {
    this.onComplete = () => { };
    super.ngOnDestroy();
  }
}
