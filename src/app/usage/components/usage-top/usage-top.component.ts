import { Component } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { TabItemModel, ComponentService, DateService, DatePeriod } from '@app/core-api';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { UsageDownloadService } from '@app/usage/services/usage-download.service';

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
    domain: ['#5B9BD5']
  };

  colorSchemeDownload = {
    domain: ['#6725B7', '#FFC852']
  };

  constructor(
    private usageDownloadService: UsageDownloadService,
    private dateService: DateService,
    protected componentService: ComponentService,
    protected usageService: UsageService,
    protected chartService: ChartService,
    public usageRequestService: UsageRequestService
  ) {
    super();
    this.usageRequestService.usageRequest.fromDate =
      this.dateService.formatDate(this.dateService.fromDate[DatePeriod.Month](1));

    this.usageDownloadService.toCSV = this.toCSV;
    this.usageDownloadService.toPDF = this.toPDF;
  }

  private toCSV(): void {
    alert('UsageTopComponent csv');
  }

  private toPDF(): void {
    alert('UsageTopComponent toPDF');
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
    const month = this.activityButtons[i].source;
    this.usageRequestService.usageRequest.fromDate =
      this.dateService.formatDate(this.dateService.fromDate[DatePeriod.Month](month));
    this.createReport();
  }
}
