import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { ImportedFilesService, EMPTY_TEMPLATE } from '../../services/imported-files.service';
import { FileSource, FileSourceResponse } from '../../models/file-source';
import { DateRangeButton, TableComponent, TranslateService, DateFilterComponent, TableModel, CheckBoxListOption, NavigationService, PageInfo, BaseSibscriber, CheckBoxListComponent, SelectOption, EmptyState, DatePeriod, TableActionCommand, NotificationsService, ToasterType, NotificationStatus } from '@appcore';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigService } from '@app/shared/services/config.service';
import { ImportedFilesMappingService } from '@app/imported-files/services/imported-files-mapping.service';

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

  get EmptyTemplate(): string {
    return EMPTY_TEMPLATE;
  }

  emptyState: EmptyState = {
    title: 'You can synthesize or manipulate your own data. Start by clicking the button above.',
    subTitle: 'Your files will be listed here.',
    image: 'filesEmpty.png'
  }

  searchEmptyState: EmptyState = {
    title: 'Nothing matches your search.',
    subTitle: 'Try using the filters or search different keywords.',
    image: 'nodata.png'
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
    private notificationsService: NotificationsService,
    private importedFilesMappingService: ImportedFilesMappingService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.ImportedFiles.id;
    super.add(this.importedFilesMappingService.onMapFinish.subscribe((state: any) => {
      if (!this.fileSource) { return; }
      const fl = this.fileSource.find(x => x.fileId === state.fileID);
      if (!fl) { return; }
      fl.fileStatus = 'loaded_to_table';
    }));
    super.add(
      this.importedFilesMappingService.onLoadFailed.subscribe(() => {
        this.isLoaded = true;
      })
    );
    super.add(this.navigationService.onReload.subscribe(() => {
      this.load();
    }));

    //this.notificationsTests();
  }


  private notificationsTests(): void {
    this.notificationsService.addNotification({
      key: "ee0e3204-0a84-4042-b3e9-4affb5566a78",
      comment: "Comments",
      showInToaster: true,
      name: "File mapping saved successfully↵",
      succLinkText: "link to page",
      type: ToasterType.success,
      status: NotificationStatus.completed,
      progress: 50,
      containerEnable: true,
      responseDisplayPeriod: 4,
      onComplete: () => {
        //alert(this.fileSource.length)
      }
    });

    // this.notificationsService.addServerNotification({
    //   key: "ee0e3204-0a84-4042-b3e9-4affb5566a78",
    //   message: "Comments",
    //   showInToaster: true,
    //   status: "Failed",
    //   subject: "File mapping saved successfully↵",
    //   succLinkText: "link to page",
    //   type: 3
    // });

    setTimeout(() => {
      this.notificationsService.serverUpdate({
        key: "ee0e3204-0a84-4042-b3e9-4affb5566a78",
        message: "updating",
        showInToaster: true,
        status: "Completed",
        subject: "File mapping saved successfully↵",
        succLinkText: "link to page",
        type: ToasterType.success
      })
    }, 2000);

    // setTimeout(() => {
    //   this.notificationsService.serverUpdate({
    //     key: "ee0e3204-0a84-4042-b3e9-4affb5566a78",
    //     message: "1111111111111111",
    //     showInToaster: true,
    //     status: "Completed",
    //     subject: "File mapping saved successfully↵",
    //     succLinkText: "link to page",
    //     type: ToasterType.success
    //   })
    // }, 10000);
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
      this.isLoaded = false;
      this.router.navigateByUrl(`/imported-files/${action.item.source.fileId}`);
    },
    view: (action: TableActionCommand) => {
      this.isLoaded = false;
      this.router.navigateByUrl(`/activate/${action.item.source.fileId}`);
    },
    delete: (action: TableActionCommand) => {
      if (action.item.source.fileType || true) {
        this.showDeleteConfirm = true;
        this.sourceForDelete = action.item.source;
        this.deleteSubTitle = `This action will delete the file '${this.sourceForDelete.fileName}'.`
        return;
      }
      //this.deleteFile(action.item.source);
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
          type: ToasterType.success,
          showInToaster: true,
          comment: 'File deleted from the system.',
          isClientOnly: true,
          displayPeriod: 4
        });
      }).catch(e => {
        this.notificationsService.addNotification({
          name: 'File cannot be deleted',
          type: ToasterType.error,
          showInToaster: true,
          comment: 'A shared file cannot be deleted. Contact your admin to delete it for you.',
          isClientOnly: true,
          displayPeriod: 4
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
    this.load();
  }

  private load(): void {
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
