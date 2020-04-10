import { Component } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { ComponentService } from '@app/core-api';
import { UsageRequestService } from '@app/usage/services/usage-request.service';

@Component({
  selector: 'md-usage-monthly',
  templateUrl: './usage-monthly.component.html',
  styleUrls: ['./usage-monthly.component.scss']
})
export class UsageMonthlyComponent extends UsageBase {

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
    protected componentService: ComponentService,
    protected usageService: UsageService,
    protected chartService: ChartService,
    public usageRequestService: UsageRequestService
  ) {
    super();
  }

  createReport(): void {
    super.responseData = this.chartService.getMonthlyUsage();
  }

}
