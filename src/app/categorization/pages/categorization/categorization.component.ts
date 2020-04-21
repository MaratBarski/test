import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseSibscriber, TableModel, TableComponent, PageInfo, NavigationService, TableActionCommand } from '@app/core-api';
import { CategorizationService } from '@app/categorization/services/categorization.service';
import { CategoryInfoComponent } from '@app/categorization/components/category-info/category-info.component';
import { Router } from '@angular/router';

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
  currentRow = { state: true, source: undefined }

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
      alert('map');
    },
    replace: (action: TableActionCommand) => {
      alert('replace');
    },
    download: (action: TableActionCommand) => {
      alert('view');
    },
    delete: (action: TableActionCommand) => {
      alert('delete');
    }
  };

  ngOnInit() {
    super.add(
      this.categorizationService.load().subscribe((res: any) => {
        this.dataOrigin = this.dataSource = this.categorizationService.createDataSource(res.data);
      }));
  }

  closeCategoryInfo(): void {
    this.table.closeRowInfo();
  }

}
