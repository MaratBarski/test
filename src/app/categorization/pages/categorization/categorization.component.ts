import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseSibscriber, TableModel, TableComponent, PageInfo, NavigationService, TableActionCommand } from '@app/core-api';
import { CategorizationService } from '@app/categorization/services/categorization.service';
import { CategoryInfoComponent } from '@app/categorization/components/category-info/category-info.component';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'md-categorization',
  templateUrl: './categorization.component.html',
  styleUrls: ['./categorization.component.scss']
})
export class CategorizationComponent extends BaseSibscriber implements OnInit {

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
    private router: Router
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.ManageHierarchies.id;
  }

  searchOptions = ['hierarchyName', 'hierarchyFile', 'insertDate', 'domain'];

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

  execCommand = {
    edit: (action: TableActionCommand) => {
      this.router.navigate(['/categorization/edit-categories', { id: action.item.source.hierarchyRootId }]);
    },
    map: (action: TableActionCommand) => {
      this.router.navigate(['/categorization/map-categories', { id: action.item.source.hierarchyRootId }]);
    },
    replace: (action: TableActionCommand) => {
      this.currentSource = action.item.source;
      this.showUploadFile = true;
    },
    download: (action: TableActionCommand) => {
      //alert(`${environment.serverUrl}${environment.endPoints.downloadCategory}/${action.item.source.hierarchyRootId}`)
      window.open(`${environment.serverUrl}${environment.endPoints.downloadCategory}/${action.item.source.hierarchyRootId}`)
    },
    delete: (action: TableActionCommand) => {
      this.categorySource = this.categorySource.filter(x => x != action.item.source);
      this.initData();
      this.table.stayOnCurrentPage = true;
      this.categorizationService.deleteCategory(action.item.source)
        .toPromise()
        .then(res => {
          console.log('Category deleted');
        }).catch(e => {
          console.error('Error delete category');
        })
    }
  };

  private initData(): void {
    this.dataOrigin = this.dataSource = this.categorizationService.createDataSource(this.categorySource);
  }

  ngOnInit() {
    super.add(
      this.categorizationService.load().subscribe((res: any) => {
        this.categorySource = res.data;
        this.initData();
      }));
  }

  closeCategoryInfo(): void {
    this.table.closeRowInfo();
  }

  openUploadNew(): void {
    this.currentSource = undefined;
    this.showUploadFile = true;
  }
}
