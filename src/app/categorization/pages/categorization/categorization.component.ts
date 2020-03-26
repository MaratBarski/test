import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BaseSibscriber, TableModel, TableComponent, PopupComponent, MenuLink, PageInfo, NavigationService, ModalWindowComponent, InfoPopupComponent, ComponentService } from '@app/core-api';
import { Store } from '@ngrx/store';
import { load } from '@app/categorization/store/actions/categorization.actions';
import { CategorizationService } from '@app/categorization/services/categorization.service';
import { selectCategorization } from '@app/categorization/store/selectors/categorization.selector';
import { CategoryInfoComponent } from '@app/categorization/components/category-info/category-info.component';

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
  @ViewChild('categorizationInfo', { static: true }) categorizationInfo: CategoryInfoComponent;
  @ViewChild('categorizationInfoModal', { static: true }) categorizationInfoModal: ModalWindowComponent;

  selectedCategory: any;
  showCategoryInfo = false;
  showUploadFile = false;
  dataOrigin: TableModel;
  dataSource: TableModel;
  currentRow = { state: true, source: undefined }

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

  showInfo(event: any, item: any, source: any): void {
    this.currentRow.source = source;
    this.currentRow.state = true;
    this.rowInfo.display(event, item);
  }

  rowStateChange(state: boolean): void {
    if (!this.currentRow.source) { return; }
    this.currentRow.source.hierarchyChange = state;
    this.rowInfo.hide();
    this.categorizationService.updateHierarchyChange(this.currentRow.source,state);
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
      this.categorizationService.load().subscribe((res: any) => {
        this.dataOrigin = this.dataSource = this.categorizationService.createDataSource(res.data);
      }));

    // super.add(
    //   this.store.select(selectCategorization).subscribe((categorization: any) => {
    //     this.dataOrigin = this.dataSource = this.categorizationService.createDataSource(categorization.data);
    //   }));
    // this.store.dispatch(load());
  }

  openCategoryInfo(category: any, event: any): void {
    this.categorizationInfoModal.top = `${event.clientY + ComponentService.scrollTop()}px`;
    this.categorizationInfo.isOver = true;
    this.selectedCategory = category;
    this.showCategoryInfo = true;
    setTimeout(() => {
      this.categorizationInfo.isOver = false;
    }, 100);
  }

  closeCategoryInfo(): void {
    this.showCategoryInfo = false;
  }
}
