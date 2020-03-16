import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TableComponent, TranslateService, DateService, TabItemModel, TableModel, MenuLink, PopupComponent } from 'appcore';
import { ImportedFilesService } from '../../services/imported-files.service';
import { Store } from '@ngrx/store';
import { load, deleteFile } from '../../store/actions/imported-files.actions';
import { selectData } from '../../store/selectors/imported-files.selector';
import { FileSource } from '../../models/file-source';
import { Subscription } from 'rxjs';
import { UploadService } from '@app/shared/services/upload.service';

@Component({
  selector: 'md-imported-files',
  templateUrl: './imported-files.component.html',
  styleUrls: ['./imported-files.component.scss']
})
export class ImportedFilesComponent implements OnInit, OnDestroy {

  @ViewChild('popupMenu', { static: true }) popupMenu: PopupComponent;
  @ViewChild('table', { static: true }) table: TableComponent;
  constructor(
    private translateService: TranslateService,
    private dateService: DateService,
    private importedFilesService: ImportedFilesService,
    private store: Store<any>
  ) {
  }

  deleteLink: MenuLink = {
    text: 'Delete',
    disable: false,
    icon: 'ic-delete',
    source: 'test',
    click: (source) => {
      this.store.dispatch(deleteFile(source))
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

  tabs: Array<TabItemModel>;
  tabActive = 0;
  serachText = '';
  showUploadFile = false;
  dataOrigin: TableModel;
  dataSource: TableModel;
  subscriptions: Array<Subscription> = [];

  searchComplite(text: string): void {
    //this.table.resetPaginator();
    //this.serachText = text;
  }

  selectTab(tab: number): void {
    this.tabActive = tab;
    let rows = this.dataOrigin.rows;
    if (this.tabActive === 1) {
      rows = this.dateService.lastMonth(rows, 'insertDate');
    } else if (this.tabActive === 2) {
      rows = this.dateService.lastWeek(rows, 'insertDate');
    }
    this.dataSource = { ...this.dataOrigin, rows: rows };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  editClick(item: any, source: any, event: any): void {
    this.deleteLink.source = source;
    this.editLink.source = source;
    this.viewLink.source = source;
    this.popupMenu.target = event.target;
    this.popupMenu.show(true, event);
  }

  ngOnInit() {
    this.initTabs();
    this.subscriptions.push(
      this.store.select(selectData).subscribe((files: Array<FileSource>) => {
        this.dataOrigin = this.dataSource = this.importedFilesService.createDataSource(files);
      }));

    this.store.dispatch(load());
  }

  initTabs(): void {
    this.tabs = [
      { title: this.translateService.translate('All') },
      { title: this.translateService.translate('LastMonth') },
      { title: this.translateService.translate('LastWeek') }
    ];
  }

  cellClick(item: any): void {
    alert(JSON.stringify(item));
  }

  searchOptions = ['fileName'];

}
