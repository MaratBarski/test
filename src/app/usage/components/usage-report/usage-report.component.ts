import { Component, ViewChild } from '@angular/core';
import { ComponentService } from '@app/core-api';
import { UsageService, } from '@app/usage/services/usage.service';
import { ChartService } from '@app/usage/services/chart.service';
import { UsageBase } from '../UsageBase';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { UsageDownloadService, DownloadData } from '@app/usage/services/usage-download.service';
import { ChartPdfComponent } from '../chart-pdf/chart-pdf.component';

@Component({
  selector: 'md-usage-report',
  templateUrl: './usage-report.component.html',
  styleUrls: ['./usage-report.component.scss']
})
export class UsageReportComponent extends UsageBase {

  view: undefined;// any[] = [600, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = '';
  yAxisLabel = 'Sales';
  showYAxisLabel = true;
  timeline = true;

  colorScheme = {
    domain: ['#5303A8']
  };

  pdfChartWidth = '500px';
  pdfChartHeight = '300px'
  @ViewChild('chartPdf', { static: true }) chartPdf: ChartPdfComponent;

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
      this.hasData = false;
      this.dataSource.forEach(item => {
        if (item.count) {
          this.hasData = true;
          return;
        }
      });
    }
  }

  hasData = true;

  downloadData: DownloadData = {
    pageName: 'General Usage',
    fileName: 'General-Usage'
  }

  private toPDF(): void {
    this.downloadData.charts = [];
    const body = [];
    this.dataSource.forEach((item: any) => {
      body.push([item.date, item.count])
    });
    this.downloadData.charts.push(
      {
        headers: ['Date', 'Count'],
        body: body,
        svg: {
          image: this.chartPdf.getSvg(),
          title: 'MONTHLY GENERAL USAGE'
        }
      }
    );

    this.usageDownloadService.downloadPDF(this.downloadData);
  }

  private toCSV(): void {
  }

  createReport(): void {
    super.responseData = this.chartService.getGeneralUsage();
  }
}

//https://swimlane.gitbook.io/ngx-charts/v/docs-test/examples/bar-charts/horizontal-bar-chart
