import { Component, Input } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { DownloadComponent, TableModel, ComponentService, DateService, DatePeriod } from '@app/core-api';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';

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
