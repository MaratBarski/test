import { Component, ViewChild } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { ComponentService } from '@app/core-api';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { UsageDownloadService, DownloadData } from '@app/usage/services/usage-download.service';
import { ChartPdfComponent } from '../chart-pdf/chart-pdf.component';

@Component({
  selector: 'md-usage-created',
  templateUrl: './usage-created.component.html',
  styleUrls: ['./usage-created.component.scss']
})
export class UsageCreatedComponent extends UsageBase  {

  view: undefined;// any[] = [600, 400];
  showXAxis = true;
  showYAxis = false;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = '';
  yAxisLabel = 'Sales';
  showYAxisLabel = true;
  timeline = true;

  colorScheme = {
    domain: ['#5B9BD5']
  };

  pdfChartWidth = '500px';
  pdfChartHeight = '300px'
  @ViewChild('chartPdf', { static: true }) chartPdf: ChartPdfComponent;

  constructor(
    private usageDownloadService: UsageDownloadService,
    protected componentService: ComponentService,
    protected usageService: UsageService, 
    protected chartService: ChartService,
    public usageRequestService: UsageRequestService
    ) {
    super();

    this.usageDownloadService.toCSV = () => this.toCSV();
    this.usageDownloadService.toPDF = () => this.toPDF();
  }

  downloadData: DownloadData = {
    pageName: 'Created',
    fileName: 'Created'
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
          title: 'NEWLY CREATED USER ACCOUNTS'
        }
      }
    );

    this.usageDownloadService.downloadPDF(this.downloadData);
  }
  
  private toCSV(): void {
    alert('created csv');
  }

  createReport(): void {
    super.responseData = this.chartService.getCreatedUsagee();
  }
}
