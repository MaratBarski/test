import { Component, ViewChild } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { ComponentService } from '@app/core-api';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { UsageDownloadService, DownloadData } from '@app/usage/services/usage-download.service';
import { ChartPdfComponent } from '../chart-pdf/chart-pdf.component';

@Component({
  selector: 'md-usage-monthly',
  templateUrl: './usage-monthly.component.html',
  styleUrls: ['./usage-monthly.component.scss']
})
export class UsageMonthlyComponent extends UsageBase {

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
    domain: ['#5303A8', '#03CFA3']
  };

  pdfChartWidth = '500px';
  pdfChartHeight = '300px'
  @ViewChild('chartPdfQueries', { static: true }) chartPdfQueries: ChartPdfComponent;
  @ViewChild('chartPdfDownloads', { static: true }) chartPdfDownloads: ChartPdfComponent;

  constructor(
    private usageDownloadService: UsageDownloadService,
    protected componentService: ComponentService,
    protected usageService: UsageService,
    public chartService: ChartService,
    public usageRequestService: UsageRequestService
  ) {
    super();

    this.usageDownloadService.toCSV = () => this.toCSV();
    this.usageDownloadService.toPDF = () => this.toPDF();

    super.dataSourceReady = () => {
      this.hasData1 = false;
      this.hasData2 = false;
      if (!this.dataSource) { return; }
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
    pageName: 'Monthly Activity',
    fileName: 'Monthly-Activity'
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
          title: 'ACTIVITY: NEW QUERIES COUNT'
        }
      },
      {
        headers: ['Date', 'Original Files', 'Synthetic Files'],
        body: body2,
        svg: {
          image: this.chartPdfDownloads.getSvg(),
          title: 'ACTIVITY: FILE DOWNLOADS COUNT'
        }
      },
    );

    this.usageDownloadService.downloadPDF(this.downloadData);
  }

  private toCSV(): void {
    alert('monthly-activity csv');
  }

  createReport(): void {
    super.responseData = this.chartService.getMonthlyUsage();
  }

}
