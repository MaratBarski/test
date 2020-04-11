import { Component, Input } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { DownloadComponent, TableModel, ComponentService, DateService, DatePeriod } from '@app/core-api';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { UsageDownloadService } from '@app/usage/services/usage-download.service';

@Component({
  selector: 'md-usage-table',
  templateUrl: './usage-table.component.html',
  styleUrls: ['./usage-table.component.scss']
})
export class UsageTableComponent extends UsageBase {

  @Input() downloader: DownloadComponent;
  data: TableModel;
  searchOptions = ['login', 'daysSinceLastLogin', 'environment'];

  constructor(
    private usageDownloadService: UsageDownloadService,
    protected componentService: ComponentService,
    protected usageService: UsageService,
    protected chartService: ChartService,
    public usageRequestService: UsageRequestService
  ) {
    super();
    super.dataSourceReady = () => {
      this.data = this.usageService.createDataSource(this.dataSource.data);
    }

    this.usageDownloadService.toCSV = this.toCSV;
    this.usageDownloadService.toPDF = this.toPDF;
  }

  private toCSV(): void {
    alert('TableModel csv');
  }

  private toPDF(): void {
    alert('TableModel toPDF');
  }

  createReport(): void {
    super.responseData = this.usageService.getUsageReport();
  }
}
