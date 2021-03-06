import { Component, Input } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { DownloadComponent, TableModel, ComponentService, DateService, DatePeriod, EmptyState } from '@app/core-api';
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
  searchOptions = ['login', 'environment'];

  constructor(
    private usageDownloadService: UsageDownloadService,
    private dateService: DateService,
    protected componentService: ComponentService,
    protected usageService: UsageService,
    public chartService: ChartService,
    public usageRequestService: UsageRequestService
  ) {
    super();
    super.dataSourceReady = () => {
      this.data = this.usageService.createRetentionDataSource(this.dataSource);
    }

    this.usageDownloadService.toCSV = () => this.toCSV();
    this.usageDownloadService.toPDF = () => this.toPDF();
  }

  emptyState: EmptyState = {
    title: 'Nothing matches your search.',
    subTitle: 'Try using the filters or search different keywords',
    image: 'nodata.png'
  }

  downloadData: DownloadData = {
    pageName: 'Retention',
    fileName: 'Retention'
  }

  private toPDF(): void {
    this.downloadData.charts = [];
    const body = [];
    this.dataSource.forEach((item: any) => {
      body.push([
        item.userName,
        this.dateService.toExcel(item.lastActivity),
        item.days,
        item.environmentName
      ]);
    });
    this.downloadData.charts.push({
      headers: [
        'User Name',
        'Last Activity',
        'Days Since Last Activity',
        'Environment'
      ],
      body: body
    });

    this.usageDownloadService.downloadPDF(this.downloadData, 1);
  }

  private toCSV(): void {
  }


  checkValidDays(): void {
    this.lastDays = Math.max(0, this.lastDays);
  }

  createReport(): void {
    super.responseData = this.chartService.getUsageRetention();
  }
}
