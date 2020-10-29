import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent, TableModel, CheckBoxListOption, NavigationService, PageInfo, BaseSibscriber, CheckBoxListComponent, SelectOption, EmptyState, DatePeriod, TableActionCommand, DownloadComponent, NotificationsService, ToasterType, INotification } from '@appcore';
import { Router } from '@angular/router';
import { ConfigService } from '@app/shared/services/config.service';
import { ResearchService } from '@app/users/services/research.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'md-research-list',
  templateUrl: './research-list.component.html',
  styleUrls: ['./research-list.component.scss']
})
export class ResearchListComponent extends BaseSibscriber implements OnInit {

  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('checkFilter', { static: true }) checkFilter: CheckBoxListComponent;
  @ViewChild('downloader', { static: true }) downloader: DownloadComponent;

  permissions: Array<CheckBoxListOption> = [];
  searchOptions = ['PermissionSetName', 'User', 'Modified', 'Environment', 'ApprovalKey'];

  emptyState: EmptyState = {
    title: 'No permission set exists yet. Start by clicking on the button above.',
    subTitle: 'The sets will be listed here.',
    image: 'output-history-2-x.png'
  }

  isDataExists = true;
  isLoaded = false;

  dataOrigin: TableModel;
  dataSource: TableModel;
  researchSource: Array<any>;
  onComplete: any;
  downloadFileName = 'research.csv';
  showDeleteConfirm = false;

  constructor(
    private researchService: ResearchService,
    private navigationService: NavigationService,
    private router: Router,
    public configService: ConfigService,
    private notificationService: NotificationsService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.Researchers.id;
  }

  sourceForDelete: any;
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

  onAction(action: TableActionCommand): void {
    this.execCommand[action.command](action);
  }

  execCommand = {
    edit: (action: TableActionCommand) => {
      this.router.navigate(['/users/edit-permissions', { id: action.item.source.researchId }]);
    },
    delete: (action: TableActionCommand) => {
      this.showDeleteConfirm = true;
      this.sourceForDelete = action.item.source;
      //this.deleteSubTitle = `This action will delete the research '${this.sourceForDelete.researchName}'.`
      this.deleteSubTitle = 'This action will delete the permission set. It will deny the user from querying the allowed events. It cannot be undone.'
    }
  };

  deleteFile(source: any): void {
    this.researchSource = this.researchSource.filter(x => x != source);
    this.initData();
    this.table.stayOnCurrentPage = true;
    const notice: INotification = {
      showInToaster: true,
      name: 'Deliting permission set',
      type: ToasterType.info,
      isClientOnly: true,
      displayPeriod: 4
    }
    this.notificationService.addNotification(notice);
    this.researchService.deleteFile(source)
      .toPromise()
      .then(res => {
        notice.name = 'Permission set deleted successfully';
        notice.type = ToasterType.success;
        notice.comment = 'The user\'s permission set is deleted from the system.';
      }).catch(e => {
        console.log(e);
        notice.name = 'Failed to delete permission set';
        notice.type = ToasterType.error;
        notice.comment = e.message;
      })
  }

  private initData(): void {
    this.isDataExists = !!(this.researchSource && this.researchSource.length);
    this.dataOrigin = this.dataSource = this.researchService.createDataSource(this.researchSource);
    this.isLoaded = true;
  }

  ngOnInit() {
    this.isLoaded = false;
    super.add(
      this.researchService.load().subscribe((res: any) => {
        this.researchSource = res.data || [];
        this.initData();
      }));
    this.onComplete = (): void => {
      super.add(
        this.researchService.load().subscribe((res: any) => {
          this.researchSource = res.data || [];
          this.initData();
          this.table.stayOnCurrentPage = true;
        }));
    }
  }

  createNew(): void {
    this.router.navigateByUrl("/users/edit-permissions");
  }

  get me(): ResearchListComponent { return this; }

  ngOnDestroy(): void {
    this.onComplete = () => { };
    super.ngOnDestroy();
  }

  changeFileName(): void {
    const date = new Date();
    const format = 'yyyy-MM-dd-HH-mm-ss';
    const locale = 'en-US';
    const formattedDate = formatDate(date, format, locale);
    this.downloader.fileName = formattedDate + "_Permission_Sets.csv";
  }

  isActive(src: any): boolean {
    return this.researchService.isActive(src, true, false);
  }
}

