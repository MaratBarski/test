import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HistoryReportService } from '../../services/history-repost.service';
import { TableComponent, TableModel, NavigationService, PageInfo, BaseSibscriber, EmptyState, DateRangeButton, DatePeriod } from '@app/core-api';
import { SessionHistory } from '@app/models/session-history';
import { environment } from '@env/environment';

@Component({
  selector: 'md-output-history-report',
  templateUrl: './output-history-report.component.html',
  styleUrls: ['./output-history-report.component.scss']
})
export class OutputHistoryReportComponent extends BaseSibscriber implements OnInit, OnDestroy {

  get downloadUrl(): string { return environment.serverUrl + environment.endPoints.downloadHistoryReport + '/' };
  @ViewChild('table', { static: true }) table: TableComponent;
  emptyState: EmptyState = {
    title: 'No history here',
    subTitle: '',
    image: 'filesEmpty.png'
  }
  downloadFileName = 'history.csv';
  searchOptions = ['source', 'fullName', 'environment', 'source'];
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
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.MonitorReports.id;
  }

  ngOnInit() {
    super.add(
      this.historyReportService.load().subscribe((res: any) => {
        this.reports = res.data;
        this.dataOrigin = this.dataSource = this.historyReportService.createDataSource(this.reports);
      }));
  }

  downloadClick(item: SessionHistory, source: SessionHistory, event: any): void {
    console.log(source);
    console.log(item);
  }

  dateFilterData(data: Array<any>): void {
    this.dataSource = { ...this.historyReportService.createDataSource(data), resetFilter: true };
  }
}

