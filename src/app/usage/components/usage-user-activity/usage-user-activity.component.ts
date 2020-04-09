import { Component } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { ComponentService } from '@app/core-api';

@Component({
  selector: 'md-usage-user-activity',
  templateUrl: './usage-user-activity.component.html',
  styleUrls: ['./usage-user-activity.component.scss']
})
export class UsageUserActivityComponent extends UsageBase {

  constructor(
    protected componentService: ComponentService,
    protected usageService: UsageService,
    protected chartService: ChartService
  ) {
    super();
  }

  createReport(): void {
    super.responseData = this.chartService.getActivityUserUsage(super.infoPanel);
  }

}
