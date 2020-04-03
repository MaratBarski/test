import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ImportedFilesService } from '../../services/imported-files.service';
import { FileSource, FileSourceResponse } from '../../models/file-source';
import { TableComponent, TranslateService, DateService, TabItemModel, TableModel, MenuLink, PopupComponent, TableHeaderModel, CheckBoxListOption, Project, NavigationService, PageInfo, BaseSibscriber, CheckBoxListComponent, SelectOption, FromTo, EmptyState, DatePeriod } from '@app/core-api';
import { UploadFileComponent } from '@app/imported-files/components/upload-file/upload-file.component';
import { DateRangeButton } from '@app/core-api';

// import { Store } from '@ngrx/store';
// import { load, deleteFile } from '../../store/actions/imported-files.actions';
// import { selectData } from '../../store/selectors/imported-files.selector';

@Component({
  selector: 'md-imported-files',
  templateUrl: './imported-files.component.html',
  styleUrls: ['./imported-files.component.scss']
})
export class ImportedFilesComponent extends BaseSibscriber implements OnInit, OnDestroy {

  @ViewChild('popupMenu', { static: true }) popupMenu: PopupComponent;
  @ViewChild('dateRangeSelector', { static: true }) dateRangeSelector: PopupComponent;
  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('checkFilter', { static: true }) checkFilter: CheckBoxListComponent;
  @ViewChild('fileUploader', { static: true }) fileUploader: UploadFileComponent;

  permissions: Array<CheckBoxListOption> = [];
  searchOptions = ['fileName', 'environment', 'permission'];

  emptyState: EmptyState = {
    title: 'You can synthesize or manipulate your own data. Start by clicking the button above.',
    subTitle: 'Your files will be listed here.',
    image: 'filesEmpty.png'
  }

  get templates(): Array<SelectOption> {
    if (!this.permissions) { return []; }
    return this.permissions.map(x => { return { text: x.text, id: x.id, value: x.id } });
  }

  dateRanges: Array<DateRangeButton> = [
    { text: this.translateService.translate('All'), range: { all: true } },
    { text: this.translateService.translate('LastMonth'), range: { value: 1, period: DatePeriod.Month } },
    { text: this.translateService.translate('LastWeek'), range: { value: 1, period: DatePeriod.Week } }
    //,{ text: 'Specific', custom: true }
  ];

  serachText = '';
  showUploadFile = false;
  dataOrigin: TableModel;
  dataSource: TableModel;
  fileSource: Array<FileSource>;
  resetFilter = true;

  constructor(
    private translateService: TranslateService,
    private importedFilesService: ImportedFilesService,
    //private store: Store<any>,
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
      this.fileSource = this.fileSource.filter(x => x != source);
      this.initData();
      this.importedFilesService.deleteFile(source)
        .toPromise()
        .then(res => {
          console.log('File deleted');
        }).catch(e => {
          console.error('Error delete file');
        })
      //this.store.dispatch(deleteFile(source));
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

  editClick(item: any, source: any, event: any): void {
    this.deleteLink.source = source;
    this.editLink.source = source;
    this.viewLink.source = source;
    this.popupMenu.target = event.target;
    this.popupMenu.show(true, event);
  }

  private initData(): void {
    this.dataOrigin = this.dataSource = this.importedFilesService.createDataSource(this.fileSource);
    this.initPermissions();
  }

  ngOnInit() {
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

  initPermissions(): void {
    this.permissions = this.importedFilesService.getFilter(
      this.fileSource.filter(x => x.template).map(x => { return { id: x.template.templateId, text: x.template.templateName } })
    );
  }

  dateFilterData(data: Array<any>): void {
    this.dataSource = { ...this.importedFilesService.createDataSource(data), resetFilter: true };
  }

  openFileUpload(): void {
    this.showUploadFile = true;
    this.fileUploader.resetTemplate();
  }
}
