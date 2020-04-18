import { Component, Input } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { DownloadComponent, TableModel, ComponentService, DateService, DatePeriod } from '@app/core-api';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { UsageDownloadService, DownloadData } from '@app/usage/services/usage-download.service';

@Component({
  selector: 'md-usage-retention',
  templateUrl: './usage-retention.component.html',
  styleUrls: ['./usage-retention.component.scss']
})
export class UsageRetentionComponent extends UsageBase {

  @Input() downloader: DownloadComponent;
  data: TableModel;
  lastDays = 60;

  constructor(
    private usageDownloadService: UsageDownloadService,
    private dateService: DateService,
    protected componentService: ComponentService,
    protected usageService: UsageService,
    protected chartService: ChartService,
    public usageRequestService: UsageRequestService
  ) {
    super();
    this.initDate();
    super.dataSourceReady = () => {
      this.data = this.usageService.createDataSource(this.dataSource.data);
    }

    this.usageDownloadService.toCSV = () => this.toCSV();
    this.usageDownloadService.toPDF = () => this.toPDF();
  }

  downloadData: DownloadData = {
    pageName: 'Retention',
    fileName: 'Retention'
  }

  private toPDF(): void {
    this.downloadData.charts = [];
    const body = [];
    this.dataSource.data.forEach((item: any) => {
      body.push([item.login, this.dateService.getDaysDiff(item.lastlogin, new Date()), item.lastlogin, 'environment']);
    });
    this.downloadData.charts.push({
      headers: ['User Name', 'Days Since Last Login', 'Last Login', 'Environment'],
      body: body
    });

    this.usageDownloadService.downloadPDF(this.downloadData);
  }

  private toCSV(): void {
    alert('restriction csv');
  }

  private initDate(): void {
    this.usageRequestService.usageRequest.fromDate =
      this.dateService.formatDate(this.dateService.fromDate[DatePeriod.Day](this.lastDays));
  }


  checkValidDays(): void {
    this.lastDays = Math.max(0, this.lastDays);
    this.initDate();
    this.usageRequestService.emit();
  }

  createReport(): void {
    super.responseData = this.usageService.getUsageReport();
  }
}
