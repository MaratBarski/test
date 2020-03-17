import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { TableComponent, TranslateService, DateService, TabItemModel, TableModel, MenuLink, PopupComponent } from 'appcore';
import { ImportedFilesService } from '../../services/imported-files.service';
import { Store } from '@ngrx/store';
import { load, deleteFile } from '../../store/actions/imported-files.actions';
import { selectData } from '../../store/selectors/imported-files.selector';
import { FileSource } from '../../models/file-source';
import { TableHeaderModel, CheckBoxListOption, Project, NavigationService, PageInfo, BaseSibscriber } from 'projects/core/src/public-api';
import { CheckBoxListComponent } from 'core/public-api';

@Component({
  selector: 'md-imported-files',
  templateUrl: './imported-files.component.html',
  styleUrls: ['./imported-files.component.scss']
})
export class ImportedFilesComponent extends BaseSibscriber implements OnInit, OnDestroy {

  @ViewChild('popupMenu', { static: true }) popupMenu: PopupComponent;
  @ViewChild('popupFilter', { static: true }) popupFilter: PopupComponent;
  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('checkFilter', { static: true }) checkFilter: CheckBoxListComponent;

  constructor(
    private translateService: TranslateService,
    private dateService: DateService,
    private importedFilesService: ImportedFilesService,
    private store: Store<any>,
    private navigationService: NavigationService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.ImportedFiles.id;
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
    text: 'Edit File Settings',
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
  fileSource: Array<FileSource>;

  searchComplite(text: string): void {
    //this.table.resetPaginator();
    //this.serachText = text;
  }

  selectTab(tab: number): void {
    this.tabActive = tab;
    this.createDataSource();
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
    super.add(
      this.store.select(selectData).subscribe((files: Array<FileSource>) => {
        this.fileSource = files;
        this.dataOrigin = this.dataSource = this.importedFilesService.createDataSource(this.fileSource);
        const proj = files.filter(x => x.projectObj).map(x => x.projectObj);
        const dict = {};
        proj.forEach((value, index) => {
          if (dict[value.projectId]) {
            return;
          }
          dict[value.projectId] = value.projectId;
          this.projects.push({ text: value.projectName, id: value.projectId, isChecked: true });
        })
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
  }

  projects: Array<CheckBoxListOption> = []
  filterOptions: Array<CheckBoxListOption> = [];
  curentFilter: string;

  filterProc = {
    environment: {
      show: () => { this.filterOptions = this.projects; },
      setOptions: () => { this.projects = this.checkFilter.options; },
      apply: (fs: Array<FileSource>): Array<FileSource> => {
        const dict = {};
        this.projects.forEach((option, index) => {
          if (option.isChecked) {
            dict[option.id] = true;
          }
        });
        return fs.filter(fs => fs.projectObj && dict[fs.projectObj.projectId])
      }
    }
  }

  showFilter(source: { header: TableHeaderModel, event: any }): void {
    if (this.curentFilter === source.header.columnId) { return; }
    this.popupFilter.isExpanded = false;
    this.curentFilter = source.header.columnId;
    if (!this.filterProc[this.curentFilter]) { return; }
    this.filterProc[this.curentFilter].show();
    this.popupFilter.target = source.event.target;
    this.popupFilter.show(true, source.event);
  }

  cancelFilter(): void {
    this.popupFilter.isExpanded = false;
    this.filterProc[this.curentFilter].setOptions();
    this.curentFilter = undefined;
  }

  onCloseFilter(): void {
    this.filterProc[this.curentFilter].setOptions();
    this.curentFilter = undefined;
  }

  applyFilter(): void {
    if (!this.filterProc[this.curentFilter]) { return; }
    this.filterProc[this.curentFilter].setOptions();
    this.createDataSource();
    this.popupFilter.isExpanded = false;
    this.curentFilter = undefined;
  }

  createDataSource(): void {
    let result = this.filterProc.environment.apply(this.fileSource);
    this.dataSource = this.importedFilesService.createDataSource(result);
    let rows = this.dataSource.rows;
    if (this.tabActive === 1) {
      rows = this.dateService.lastMonth(rows, 'insertDate');
    } else if (this.tabActive === 2) {
      rows = this.dateService.lastWeek(rows, 'insertDate');
    }
    this.dataSource = { ...this.dataSource, rows: rows };
  }

  searchOptions = ['fileName', 'environment'];

}
