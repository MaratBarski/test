import { Component, ViewChild } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { ComponentService, user } from '@app/core-api';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { UsageDownloadService, DownloadData } from '@app/usage/services/usage-download.service';
import { ChartPdfComponent } from '../chart-pdf/chart-pdf.component';
import { CHART_COLORS } from '@app/usage/models/chart-colors';
import { ChartWraperComponent } from '../chart-wraper/chart-wraper.component';

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
  @ViewChild('wraper', { static: true }) wraper: ChartWraperComponent;

  constructor(
    private usageDownloadService: UsageDownloadService,
    protected componentService: ComponentService,
    protected usageService: UsageService,
    public chartService: ChartService,
    public usageRequestService: UsageRequestService
  ) {
    super();

    super.add(this.usageRequestService.onSelectUserChange.subscribe(() => { this.initUsers(); }));
    super.add(this.usageRequestService.onUsersFirstTimeSelected.subscribe(() => { this.initUsers(); }));
    super.add(this.usageRequestService.onSelectUserChange.subscribe(() => { this.data = { ...this.data }; }));

    super.add(this.componentService.onSideBarToggle.subscribe((flag: boolean) => {
      this.createReport();
    }));

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
          if (item.count) {
            this.hasData2 = true;
            return;
          }
        });
      }
    }
  }

  hasData1 = true;
  hasData2 = true;

  private currentColor = 0;
  private getColor(): string {
    if (this.currentColor >= CHART_COLORS.length) {
      this.currentColor = 0;
    }
    return CHART_COLORS[this.currentColor++];
  }

  private initUsers(): void {
    this.currentColor = 0;
    this.users = this.usageRequestService
      .users.filter((user: any) => {
        return user.isChecked;
      })
      .map((x: any) => {
        return { name: x.login, value: this.getColor() }
      });
  }

  users: Array<{ name: string, value: string }> = [];

  downloadData: DownloadData = {
    pageName: 'Activity per user',
    fileName: 'Activity-per-User',
    printUsers: true
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

  data: any;
  createReport(): void {
    super.responseData = this.chartService.getActivityUserUsage(
      (res: any) => {
        this.data = this.usageRequestService.createData(res.data);
      }
    );
  }

  closeFirstLegend(event: any): void {
    this.wraper.firstLegend.closeLegend();
  }

  closeSecondLegend(event: any): void {
    this.wraper.secondLegend.closeLegend();
  }

}

//projects\swimlane\ngx-charts\src\lib\line-chart\line.component.ts
