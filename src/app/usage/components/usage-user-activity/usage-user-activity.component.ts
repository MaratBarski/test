import { Component, ViewChild } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { ComponentService } from '@app/core-api';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { UsageDownloadService, DownloadData } from '@app/usage/services/usage-download.service';
import { ChartPdfComponent } from '../chart-pdf/chart-pdf.component';

@Component({
  selector: 'md-usage-user-activity',
  templateUrl: './usage-user-activity.component.html',
  styleUrls: ['./usage-user-activity.component.scss']
})
export class UsageUserActivityComponent extends UsageBase {

  pdfChartWidth = '500px';
  pdfChartHeight = '300px'
  @ViewChild('chartPdf1', { static: true }) chartPdf1: ChartPdfComponent;
  @ViewChild('chartPdf2', { static: true }) chartPdf2: ChartPdfComponent;
  
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
    pageName: 'Activity per user',
    fileName: 'Activity-per-User'
  }

  private toPDF(): void {
    this.downloadData.charts = [];
    // const body1 = [];
    // const body2 = [];
    // this.dataSource.newQuery.forEach((item: any) => {
    //   body1.push([item.date, item.count])
    // });
    // this.dataSource.downloads.forEach((item: any) => {
    //   body2.push([item.date, item.origin, item.syntetic])
    // });
    this.downloadData.charts.push(
      {
        //headers: ['Date', 'Count'],
        //body: body1,
        svg: {
          image: this.chartPdf1.getSvg(),
          title: 'NEW QUERIES PER USER'
        }
      },
      {
        //headers: ['Date', 'Original Files', 'Synthetic Files'],
        //body: body2,
        svg: {
          image: this.chartPdf2.getSvg(),
          title: 'DOWNLOADS PER USER'
        }
      },
    );

    this.usageDownloadService.downloadPDF(this.downloadData);
  }

  private toCSV(): void {
    alert('UsageUserActivityComponentcsv');
  }

  createReport(): void {
    super.responseData = this.chartService.getActivityUserUsage();
  }

}
