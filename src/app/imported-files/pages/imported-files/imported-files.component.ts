import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ImportedFilesService } from '../../services/imported-files.service';
import { FileSource, FileSourceResponse } from '../../../models/file-source';
import { TableComponent, TranslateService, DateService, TabItemModel, TableModel, MenuLink, PopupComponent, TableHeaderModel, CheckBoxListOption, Project, NavigationService, PageInfo, BaseSibscriber, CheckBoxListComponent, SelectOption, FromTo } from '@app/core-api';
import { UploadFileComponent } from '@app/imported-files/components/upload-file/upload-file.component';

// import { Store } from '@ngrx/store';
// import { load, deleteFile } from '../../store/actions/imported-files.actions';
// import { selectData } from '../../store/selectors/imported-files.selector';

@Component({
  selector: 'md-imported-files',
  templateUrl: './imported-files.component.html',
  styleUrls: ['./imported-files.component.scss']
})
export class ImportedFilesComponent extends BaseSibscriber implements OnInit, OnDestroy {

  get templates(): Array<SelectOption> {
    if (!this.permissions) { return []; }
    return this.permissions.map(x => ({ text: x.text, id: x.id, value: x.id }));
  }

  constructor(
    private translateService: TranslateService,
    private dateService: DateService,
    private importedFilesService: ImportedFilesService,
    // private store: Store<any>,
    private navigationService: NavigationService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.ImportedFiles.id;
  }

  get isFilter(): boolean {
    if (!this.curentFilter) { return false; }
    if (!this.filterProc[this.curentFilter]) { return false; }
    return true;
  }

  @ViewChild('popupMenu', { static: true }) popupMenu: PopupComponent;
  @ViewChild('popupFilter', { static: true }) popupFilter: PopupComponent;
  @ViewChild('dateRangeSelector', { static: true }) dateRangeSelector: PopupComponent;
  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('checkFilter', { static: true }) checkFilter: CheckBoxListComponent;
  @ViewChild('fileUploader', { static: true }) fileUploader: UploadFileComponent;

  users: Array<CheckBoxListOption> = [];
  projects: Array<CheckBoxListOption> = [];
  permissions: Array<CheckBoxListOption> = [];
  filterOptions: Array<CheckBoxListOption> = [];
  curentFilter: string;

  searchOptions = ['fileName', 'environment'];

  tabs: Array<TabItemModel>;
  tabActive = 0;
  serachText = '';
  showUploadFile = false;
  dataOrigin: TableModel;
  dataSource: TableModel;
  fileSource: Array<FileSource>;

  deleteLink: MenuLink = {
    text: 'Delete',
    disable: false,
    icon: 'ic-delete',
    source: 'test',
    click: (source) => {
      this.fileSource = this.fileSource.filter(x => x !== source);
      this.initData();
      this.importedFilesService.deleteFile(source)
        .toPromise()
        .then(res => {
          console.log('File deleted');
        }).catch(e => {
          console.error('Error delete file');
        });
      // this.store.dispatch(deleteFile(source));
    }
  };

  editLink: MenuLink = {
    text: 'Edit File Settings',
    icon: 'ic-edit',
    click: (source) => { console.log(JSON.stringify(source)); }
  };

  viewLink: MenuLink = {
    text: 'View output summary',
    icon: 'ic-view',
    click: (source) => { console.log(JSON.stringify(source)); }
  };

  sublinks: Array<MenuLink> = [this.deleteLink];
  links: Array<MenuLink> = [
    this.editLink,
    this.viewLink
  ];

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
        return fs.filter(fs => fs.projectObj && dict[fs.projectObj.projectId]);
      }
    },
    user: {
      show: () => { this.filterOptions = this.users; },
      setOptions: () => { this.users = this.checkFilter.options; },
      apply: (fs: Array<FileSource>): Array<FileSource> => {
        const dict = {};
        this.users.forEach((option, index) => {
          if (option.isChecked) {
            dict[option.id] = true;
          }
        });
        return fs.filter(fs => dict[fs.uploadedBy]);
      }
    },
    permission: {
      show: () => { this.filterOptions = this.permissions; },
      setOptions: () => { this.permissions = this.checkFilter.options; },
      apply: (fs: Array<FileSource>): Array<FileSource> => {
        const dict = {};
        this.permissions.forEach((option, index) => {
          if (option.isChecked) {
            dict[option.id] = true;
          }
        });
        return fs.filter(fs => dict[fs.templateId]);
      }
    }
  };

  customTo = new Date();
  customFrom = new Date();

  searchComplete(text: string): void {
    // this.table.resetPaginator();
    // this.serachText = text;
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

  private initData(): void {
    this.dataOrigin = this.dataSource = this.importedFilesService.createDataSource(this.fileSource);
    this.initProjects();
    this.initUsers();
    this.initPermissions();
  }

  ngOnInit() {
    this.initTabs();
    super.add(
      this.importedFilesService.load().subscribe((res: FileSourceResponse) => {
        this.fileSource = res.data;
        this.initData();
      }));
    // super.add(
    //   this.store.select(selectData).subscribe((files: Array<FileSource>) => {
    //     this.fileSource = files;
    //     this.dataOrigin = this.dataSource = this.importedFilesService.createDataSource(this.fileSource);
    //     this.initProjects(files);
    //     this.initUsers(files);
    //     this.initPermissions(files);
    //   }));
    // this.store.dispatch(load());
  }

  initProjects(): void {
    this.projects = this.importedFilesService.getFilter(
      this.fileSource.filter(x => x.projectObj).map(x => ({ id: x.projectObj.projectId, text: x.projectObj.projectName }))
    );
  }

  initUsers(): void {
    this.users = this.importedFilesService.getFilter(
      this.fileSource.filter(x => x.uploadedBy).map(x => ({ id: x.uploadedBy, text: 'user_' + x.uploadedBy }))
    );
  }

  initPermissions(): void {
    this.permissions = this.importedFilesService.getFilter(
      this.fileSource.filter(x => x.template).map(x => ({ id: x.template.templateId, text: x.template.templateName }))
    );
  }

  initTabs(): void {
    this.tabs = [
      { title: this.translateService.translate('All') },
      { title: this.translateService.translate('LastMonth') },
      { title: this.translateService.translate('LastWeek') }
      // , {
      //   title: this.translateService.translate('Specific'), isDropDown: true,
      //   mouseOver: (index: number, tab: TabItemModel, event: any, target: any) => {
      //     if (this.dateRangeSelector.isExpanded) { return; }
      //     this.dateRangeSelector.target = target;
      //     this.dateRangeSelector.show(true, event);
      //   }
      // }
    ];
  }

  cellClick(item: any): void { }

  showFilter(source: { header: TableHeaderModel, event: any }): void {
    this.popupMenu.isExpanded = false;
    if (this.curentFilter === source.header.columnId) { return; }
    this.popupFilter.isExpanded = false;
    this.curentFilter = source.header.columnId;
    if (!this.isFilter) { return; }
    this.filterProc[this.curentFilter].show();
    this.popupFilter.target = source.event.target;
    this.popupFilter.show(true, source.event);
  }

  cancelFilter(): void {
    this.popupFilter.isExpanded = false;
    if (!this.isFilter) { return; }
    this.filterProc[this.curentFilter].setOptions();
    this.curentFilter = undefined;
  }

  onCloseFilter(): void {
    if (!this.isFilter) { return; }
    this.filterProc[this.curentFilter].setOptions();
    this.curentFilter = undefined;
  }

  applyFilter(): void {
    if (!this.isFilter) { return; }
    this.filterProc[this.curentFilter].setOptions();
    this.createDataSource();
    this.popupFilter.isExpanded = false;
    this.curentFilter = undefined;
  }

  createDataSource(): void {
    const result = this.filterProc.permission.apply(
      this.filterProc.user.apply(
        this.filterProc.environment.apply(
          this.fileSource
        )));
    this.dataSource = this.importedFilesService.createDataSource(result);
    let rows = this.dataSource.rows;
    if (this.tabActive === 1) {
      rows = this.dateService.lastMonth(rows, 'insertDate');
    } else if (this.tabActive === 2) {
      rows = this.dateService.lastWeek(rows, 'insertDate');
    } else if (this.tabActive === 3) {
      rows = this.dateService.getRange(rows, 'insertDate', { from: this.customFrom, to: this.customTo });
    }
    this.dataSource = { ...this.dataSource, rows };
  }

  openFileUpload(): void {
    this.showUploadFile = true;
    this.fileUploader.resetTemplate();
  }

  cancelCustomDate(): void {
    this.dateRangeSelector.isExpanded = false;
  }

  applyCustomDate(range: FromTo): void {
    this.tabActive = this.tabs.length - 1;
    this.dateRangeSelector.isExpanded = false;
    this.customFrom = range.from;
    this.customTo = range.to;
    this.createDataSource();
  }
}
