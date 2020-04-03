import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ImportedFilesService } from '../../services/imported-files.service';
import { FileSource, FileSourceResponse } from '../../models/file-source';
import { TableComponent, TranslateService, TableModel, PopupComponent, CheckBoxListOption, NavigationService, PageInfo, BaseSibscriber, CheckBoxListComponent, SelectOption, EmptyState, DatePeriod, TableActionCommand } from '@app/core-api';
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

  onAction(action: TableActionCommand): void {
    switch (action.command) {
      case ('edit'):
        console.log('edit command');
        break;
      case ('view'):
        console.log('view command');
        break;
      case ('delete'):
        this.fileSource = this.fileSource.filter(x => x != action.item.source);
        this.initData();
        this.importedFilesService.deleteFile(action.item.source)
          .toPromise()
          .then(res => {
            console.log('File deleted');
          }).catch(e => {
            console.error('Error delete file');
          })
        break;
      default: break;
    }
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
