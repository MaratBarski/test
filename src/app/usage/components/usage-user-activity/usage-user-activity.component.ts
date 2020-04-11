import { Component } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { ComponentService } from '@app/core-api';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { UsageDownloadService } from '@app/usage/services/usage-download.service';

@Component({
  selector: 'md-usage-user-activity',
  templateUrl: './usage-user-activity.component.html',
  styleUrls: ['./usage-user-activity.component.scss']
})
export class UsageUserActivityComponent extends UsageBase {

  constructor(
    private usageDownloadService: UsageDownloadService,
    protected componentService: ComponentService,
    protected usageService: UsageService,
    protected chartService: ChartService,
    public usageRequestService: UsageRequestService
  ) {
    super();

    this.usageDownloadService.toCSV = this.toCSV;
    this.usageDownloadService.toPDF = this.toPDF;
  }

  
  private toCSV(): void {
    alert('UsageUserActivityComponentcsv');
  }

  private toPDF(): void {
    alert('UsageUserActivityComponent toPDF');
  }

  createReport(): void {
    super.responseData = this.chartService.getActivityUserUsage();
  }

}
