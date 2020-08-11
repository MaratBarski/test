import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { ImportedFilesService, EMPTY_TEMPLATE } from '../../services/imported-files.service';
import { FileSource, FileSourceResponse } from '../../models/file-source';
import { DateRangeButton, TableComponent, TranslateService, DateFilterComponent, TableModel, CheckBoxListOption, NavigationService, PageInfo, BaseSibscriber, CheckBoxListComponent, SelectOption, EmptyState, DatePeriod, TableActionCommand, NotificationsService, ToasterType } from '@appcore';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '@app/shared/services/config.service';

@Component({
  selector: 'md-imported-files',
  templateUrl: './imported-files.component.html',
  styleUrls: ['./imported-files.component.scss']
})
export class ImportedFilesComponent extends BaseSibscriber implements OnInit, AfterContentInit {

  @ViewChild('dateFilter', { static: true }) dateFilter: DateFilterComponent;
  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('checkFilter', { static: true }) checkFilter: CheckBoxListComponent;

  permissions: Array<CheckBoxListOption> = [];
  searchOptions = ['fileName', 'environment', 'permission', 'user'];

  get EmptyTemplate():string{
    return EMPTY_TEMPLATE;
  }
  
  emptyState: EmptyState = {
    title: 'You can synthesize or manipulate your own data. Start by clicking the button above.',
    subTitle: 'Your files will be listed here.',
    image: 'filesEmpty.png'
  }

  isDataExists = true;
  isLoaded = false;

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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public configService: ConfigService,
    private notificationsService: NotificationsService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.ImportedFiles.id;
  }

  ngAfterContentInit(): void {
    super.add(
      this.activatedRoute.paramMap.subscribe(p => {
        let tab = parseInt(p.get('tab') || '0');
        if (isNaN(tab)) { tab = 0; }
        tab = Math.max(0, Math.min(tab, 2));
        this.dateFilter.navigate(tab);
      }));
  }

  onSelectTab(index: number): void {
    //this.router.navigate(['/imported-files', { tab: index }]);
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
      if (action.item.source.fileType) {
        this.showDeleteConfirm = true;
        this.sourceForDelete = action.item.source;
        this.deleteSubTitle = `This action will delete the file '${this.sourceForDelete.fileName}'.`
        return;
      }
      this.deleteFile(action.item.source);
    }
  };

  sourceForDelete = undefined;
  showDeleteConfirm = false;
  deleteSubTitle = '';

  confirmDelete(): void {
    this.showDeleteConfirm = false;
    this.deleteFile(this.sourceForDelete);
    this.sourceForDelete = undefined;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.sourceForDelete = undefined;
  }

  deleteFile(source: any): void {
    this.fileSource = this.fileSource.filter(x => x != source);
    this.initData();
    this.table.stayOnCurrentPage = true;
    this.importedFilesService.deleteFile(source)
      .toPromise()
      .then(res => {
        this.notificationsService.addNotification({
          name: 'File deleted successfully',
          type: ToasterType.info,
          showInToaster: true,
          comment: 'File deleted from the system.'
        });
      }).catch(e => {
        this.notificationsService.addNotification({
          name: 'Error delete file',
          type: ToasterType.error,
          showInToaster: true,
          comment: 'File delete error.'
        });
      });
  }

  private initData(): void {
    this.isDataExists = !!(this.fileSource && this.fileSource.length);
    this.dataOrigin = this.dataSource = this.importedFilesService.createDataSource(this.fileSource);
    this.initPermissions();
    this.isLoaded = true;
  }

  ngOnInit() {
    this.isLoaded = false;
    super.add(
      this.importedFilesService.load().subscribe((res: FileSourceResponse) => {
        this.fileSource = res.data || [];
        this.initData();
      }));
    this.onComplete = (): void => {
      super.add(
        this.importedFilesService.load().subscribe((res: FileSourceResponse) => {
          this.fileSource = res.data || [];
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

  get me(): ImportedFilesComponent { return this; }

  ngOnDestroy(): void {
    this.onComplete = () => { };
    super.ngOnDestroy();
  }
}
