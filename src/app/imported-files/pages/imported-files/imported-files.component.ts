import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportedFilesService } from '../../services/imported-files.service';
import { FileSource, FileSourceResponse } from '../../models/file-source';
import { TableComponent, TranslateService, DateFilterComponent, TableModel, PopupComponent, CheckBoxListOption, NavigationService, PageInfo, BaseSibscriber, CheckBoxListComponent, SelectOption, EmptyState, DatePeriod, TableActionCommand } from '@app/core-api';
import { DateRangeButton } from '@app/core-api';
import { Router } from '@angular/router';
import { UploadFileComponent } from '@app/imported-files/components/upload-file/upload-file.component';

@Component({
  selector: 'md-imported-files',
  templateUrl: './imported-files.component.html',
  styleUrls: ['./imported-files.component.scss']
})
export class ImportedFilesComponent extends BaseSibscriber implements OnInit {

  @ViewChild('dateFilter', { static: true }) dateFilter: DateFilterComponent;
  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('checkFilter', { static: true }) checkFilter: CheckBoxListComponent;

  permissions: Array<CheckBoxListOption> = [];
  searchOptions = ['fileName', 'environment', 'permission', 'user'];

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
  ];

  showUploadFile = false;
  dataOrigin: TableModel;
  dataSource: TableModel;
  fileSource: Array<FileSource>;
  onComplete: any;

  constructor(
    private translateService: TranslateService,
    private importedFilesService: ImportedFilesService,
    private navigationService: NavigationService,
    private router: Router
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.ImportedFiles.id;
  }

  onAction(action: TableActionCommand): void {
    this.execCommand[action.command](action);
  }

  execCommand = {
    edit: (action: TableActionCommand) => {
      this.router.navigateByUrl(`/imported-files/${action.item.source.fileId}`);
      console.log('edit command');
    },
    view: (action: TableActionCommand) => {
      console.log('view command');
    },
    delete: (action: TableActionCommand) => {
      this.fileSource = this.fileSource.filter(x => x != action.item.source);
      this.initData();
      this.table.stayOnCurrentPage = true;
      this.importedFilesService.deleteFile(action.item.source)
        .toPromise()
        .then(res => {
          console.log('File deleted');
        }).catch(e => {
          console.error('Error delete file');
        })
    }
  };

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
    this.onComplete = (): void => {
      super.add(
        this.importedFilesService.load().subscribe((res: FileSourceResponse) => {
          this.fileSource = res.data;
          this.initData();
          this.table.stayOnCurrentPage = true;
        }));
    }
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
  }

  onLoadFileUpload(upload: UploadFileComponent): void {
    upload.templates = this.templates;
  }

  get me(): ImportedFilesComponent { return this; }

  ngOnDestroy(): void {
    this.onComplete = () => { };
    super.ngOnDestroy();
  }
}
