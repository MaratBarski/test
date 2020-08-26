import { Component, ViewChild } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { TabItemModel, ComponentService, DateService, DatePeriod } from '@app/core-api';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { UsageDownloadService, DownloadData } from '@app/usage/services/usage-download.service';
import { ChartPdfComponent } from '../chart-pdf/chart-pdf.component';

@Component({
  selector: 'md-usage-top',
  templateUrl: './usage-top.component.html',
  styleUrls: ['./usage-top.component.scss']
})
export class UsageTopComponent extends UsageBase {

  view = undefined;//  [600, 400];
  showXAxis = true;
  showYAxis = false;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  showYAxisLabel = true;
  xAxisLabel = '';
  yAxisLabel = '';
  timeline = false;

  colorScheme = {
    domain: ['#0596FF']
  };

  colorSchemeDownload = {
    domain: ['#03CFA3', '#5303A8']
  };

  pdfChartWidth = '500px';
  pdfChartHeight = '300px'
  @ViewChild('chartPdfQueries', { static: true }) chartPdfQueries: ChartPdfComponent;
  @ViewChild('chartPdfDownloads', { static: true }) chartPdfDownloads: ChartPdfComponent;

  constructor(
    private usageDownloadService: UsageDownloadService,
    private dateService: DateService,
    protected componentService: ComponentService,
    protected usageService: UsageService,
    public chartService: ChartService,
    public usageRequestService: UsageRequestService
  ) {
    super();
    const range = this.dateService.getFromMonth2Current(1);
    this.usageRequestService.usageRequest.fromDate = this.dateService.formatDateUS(range.fromDate);
    this.usageRequestService.usageRequest.toDate = this.dateService.formatDateUS(range.toDate);

    this.usageDownloadService.toCSV = () => this.toCSV();
    this.usageDownloadService.toPDF = () => this.toPDF();

    super.dataSourceReady = () => {
      this.hasData1 = false;
      this.hasData2 = false;
      if (!this.dataSource) { return; }
      // document.write(JSON.stringify(this.dataSource))
      if (this.dataSource.newQuery) {
        this.dataSource.newQuery.forEach(item => {
          if (item.count) {
            this.hasData1 = true;
            return;
          }
        });
      }
      if (this.dataSource.downloads) {
        this.dataSource.downloads.forEach(item => {
          if (item.syntetic || item.origin) {
            this.hasData2 = true;
            return;
          }
        });
      }
    }
  }

  hasData1 = true;
  hasData2 = true;

  downloadData: DownloadData = {
    pageName: 'Top 10 Users',
    fileName: 'Top-10-Users'
  }

  private toPDF(): void {
    this.downloadData.charts = [];
    const body1 = [];
    const body2 = [];
    this.dataSource.newQuery.forEach((item: any) => {
      body1.push([item.date, item.count])
    });
    this.dataSource.downloads.forEach((item: any) => {
      body2.push([item.date, item.origin, item.syntetic])
    });
    this.downloadData.charts.push(
      {
        headers: ['Date', 'Count'],
        body: body1,
        svg: {
          image: this.chartPdfQueries.getSvg(),
          title: 'NEW QUERIES'
        }
      },
      {
        headers: ['Date', 'Original Files', 'Synthetic Files'],
        body: body2,
        svg: {
          image: this.chartPdfDownloads.getSvg(),
          title: 'FILE DOWNLOADS'
        }
      },
    );

    this.usageDownloadService.downloadPDF(this.downloadData);
  }

  private toCSV(): void {
    alert('UsageTopComponent csv');
  }

  createReport(): void {
    super.responseData = this.chartService.getTop10Usage();
  }

  activityButtons: Array<TabItemModel> = [
    { title: 'Month', source: 1 },
    { title: '3 Months', source: 3 },
    { title: '6 Months', source: 6 }
  ];

  currentActivity = 0;
  changeCurrentAcitity(i: number): void {
    this.currentActivity = i;
    const range = this.dateService.getFromMonth2Current(this.activityButtons[i].source);
    this.usageRequestService.usageRequest.fromDate = this.dateService.formatDateUS(range.fromDate);
    this.usageRequestService.usageRequest.toDate = this.dateService.formatDateUS(range.toDate);
    this.createReport();
  }
}
