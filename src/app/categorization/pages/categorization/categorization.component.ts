import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BaseSibscriber, TableModel, TableComponent, PopupComponent, MenuLink, PageInfo, NavigationService } from '@app/core-api';
import { Store } from '@ngrx/store';
import { load } from '@app/categorization/store/actions/categorization.actions';
import { CategorizationService } from '@app/categorization/services/categorization.service';
import { selectCategorization } from '@app/categorization/store/selectors/categorization.selector';
import { InfoPopupComponent } from 'core/public-api';

@Component({
  selector: 'md-categorization',
  templateUrl: './categorization.component.html',
  styleUrls: ['./categorization.component.scss']
})
export class CategorizationComponent extends BaseSibscriber implements OnInit {

  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('rowInfo', { static: true }) rowInfo: InfoPopupComponent;
  @ViewChild('rowUse', { static: true }) rowUse: InfoPopupComponent;
  @ViewChild('popupMenu', { static: true }) popupMenu: PopupComponent;

  selectedCategory: any;
  showCategoryInfo = false;
  showUploadFile = false;
  dataOrigin: TableModel;
  dataSource: TableModel;
  currentRow = { state: true }

  constructor(
    private categorizationService: CategorizationService,
    private store: Store<any>,
    private navigationService: NavigationService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.ManageHierarchies.id;
  }

  searchOptions = ['hierarchyName'];

  searchComplete(text: string): void {
  }

  showInfo(event: any, item: any): void {
    this.rowInfo.display(event, item);
  }

  showUse(event: any, item: any): void {
    this.rowUse.display(event, item);
  }

  hideInfo(event: any, item: any): void {
    this.rowInfo.startClose();
  }

  hideUse(event: any, item: any): void {
    this.rowUse.startClose();
  }

  deleteLink: MenuLink = {
    text: 'Delete',
    disable: false,
    icon: 'ic-delete',
    source: 'test',
    click: (source) => {
      this.dataSource = {
        ...this.dataSource, ...{
          rows: this.dataSource.rows.filter(r => r.cells.No !== source.No)
        }
      };
    }
  }

  editLink: MenuLink = {
    text: 'Edit',
    icon: 'ic-edit',
    click: (source) => { console.log(JSON.stringify(source)); }
  }

  viewLink: MenuLink = {
    text: 'View output summary',
    icon: 'ic-view',
    click: (source) => { console.log(JSON.stringify(source)); }
  }

  sublinks: Array<MenuLink> = [this.deleteLink];
  links: Array<MenuLink> = [
    this.editLink,
    this.viewLink
  ];

  editClick(item: any, event: any): void {
    this.deleteLink.source = item;
    this.editLink.source = item;
    this.viewLink.source = item;
    this.popupMenu.target = event.target;
    this.popupMenu.show(true, event);
  }

  ngOnInit() {
    super.add(
      this.store.select(selectCategorization).subscribe((categorization: any) => {
        this.dataOrigin = this.dataSource = this.categorizationService.createDataSource(categorization.data);
      }));
    this.store.dispatch(load());
  }

  openCategoryInfo(category: any): void {
    this.selectedCategory = category;
    this.showCategoryInfo = true;

    //alert(JSON.stringify(item));
  }

  closeCategoryInfo():void{
    this.showCategoryInfo = false;
  }
}
