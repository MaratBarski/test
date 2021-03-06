import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HistoryReportService } from '../../services/history-repost.service';
import { DownloadComponent, TableComponent, TableModel, NavigationService, PageInfo, BaseSibscriber, EmptyState, DateRangeButton, DatePeriod } from '@appcore';
import { SessionHistory } from '@app/models/session-history';
import { environment } from '@env/environment';
import { formatDate } from '@angular/common';
import { DownloadService } from '@app/shared/services/download.service';
import { ConfigService } from '@app/shared/services/config.service';


@Component({
  selector: 'md-output-history-report',
  templateUrl: './output-history-report.component.html',
  styleUrls: ['./output-history-report.component.scss']
})
export class OutputHistoryReportComponent extends BaseSibscriber implements OnInit, OnDestroy {

  get downloadUrl(): string { return `${environment.serverUrl}${environment.endPoints.downloadHistoryReport}`; }
  @ViewChild('table', { static: true }) table: TableComponent;
  @ViewChild('downloader', { static: true }) downloader: DownloadComponent;
  emptyState: EmptyState = {
    title: 'Looks like everyone is resting. Wait until the users will start working.',
    subTitle: 'Users’ output activity will be listed here.',
    image: 'output-history-2-x.png'
  }

  searchText = '';
  downloadFileName = 'history.csv';
  searchOptions = ['source', 'fullName', 'environment', 'approvalKey', 'name', 'research', 'data', 'sessionId'];

  dataOrigin: TableModel;
  dataSource: TableModel;
  reports: Array<any>;
  selectedCategory: any;
  dateRanges: Array<DateRangeButton> = [
    { text: 'All', range: { all: true } },
    { text: 'Last 30 Days', range: { value: 30, period: DatePeriod.Day } },
    { text: 'Last 7 Days', range: { value: 7, period: DatePeriod.Day } },
    { text: 'Specific', custom: true }
  ];

  constructor(
    private historyReportService: HistoryReportService,
    private navigationService: NavigationService,
    private downloadService: DownloadService,
    public configService: ConfigService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.MonitorReports.id;
  }

  ngOnInit() {
    super.add(
      this.historyReportService.load().subscribe((res: any) => {
        this.reports = res.data;
        this.dataOrigin = this.dataSource = this.historyReportService.createDataSource(this.reports);
      }, (error) => {
        this.reports = [];
        this.dataOrigin = this.dataSource = this.historyReportService.createDataSource(this.reports);
      }));
  }

  downloadClick(item: SessionHistory, source: SessionHistory, event: any): void {
    //this.downloadService.download("http://10.0.2.18:4000/mdclone/api/v1/session-history/download/2768");
    //this.downloadService.download("http://10.0.2.18:4000/mdclone/api/v1/session-history/download/2762");   
    event.stopPropagation();
    this.downloadService.download(`${this.downloadUrl}/${source.sessionHistoryId}`);
  }

  stopEvent(event: any): void {
    event.stopPropagation();
  }

  dateFilterData(data: Array<any>): void {
    this.dataSource = { ...this.historyReportService.createDataSource(data), resetFilter: true };
  }

  closeCategoryInfo(): void {
    this.table.closeRowInfo();
  }

  changeFileName(): void {
    const date = new Date();
    const format = 'yyyyMMdd_hhmmss';
    const locale = 'en-US';
    const formattedDate = formatDate(date, format, locale);
    this.downloader.fileName = formattedDate + "_session_history.csv";
  }

  onSearchComplete(text: string): void {
    this.searchText = text;
  }
}

