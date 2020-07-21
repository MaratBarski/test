import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent, TableModel, CheckBoxListOption, NavigationService, PageInfo, BaseSibscriber, CheckBoxListComponent, SelectOption, EmptyState, DatePeriod, TableActionCommand, DownloadComponent } from '@appcore';
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

  constructor(
    private researchService: ResearchService,
    private navigationService: NavigationService,
    private router: Router,
    public configService: ConfigService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.Researchers.id;
  }

  onAction(action: TableActionCommand): void {
    this.execCommand[action.command](action);
  }

  execCommand = {
    edit: (action: TableActionCommand) => {
      //this.router.navigateByUrl(`/imported-files/${action.item.source.fileId}`);
      console.log('edit command');
    },
    delete: (action: TableActionCommand) => {
      // this.researchSource = this.researchSource.filter(x => x != action.item.source);
      // this.initData();
      // this.table.stayOnCurrentPage = true;
      // this.researchService.deleteFile(action.item.source)
      //   .toPromise()
      //   .then(res => {
      //     console.log('File deleted');
      //   }).catch(e => {
      //     console.error('Error delete file');
      //   })
    }
  };

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
   // this.router.navigateByUrl("/users/edit-permissions")
  }

  get me(): ResearchListComponent { return this; }

  ngOnDestroy(): void {
    this.onComplete = () => { };
    super.ngOnDestroy();
  }

  changeFileName(): void {
    const date = new Date();
    const format = 'yyyyMMdd_hhmmss';
    const locale = 'en-US';
    const formattedDate = formatDate(date, format, locale);
    this.downloader.fileName = formattedDate + "_session_history.csv";
  }

  isActive(src: any): boolean {
    return this.researchService.isActive(src, true, false);
  }
}

