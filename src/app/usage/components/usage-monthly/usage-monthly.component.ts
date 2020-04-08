import { Component } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';

@Component({
  selector: 'md-usage-monthly',
  templateUrl: './usage-monthly.component.html',
  styleUrls: ['./usage-monthly.component.scss']
})
export class UsageMonthlyComponent extends UsageBase  {

  constructor(protected usageService: UsageService, protected chartService: ChartService) {
    super();
  }

  createReport(): void {
    super.responseData = this.chartService.getGeneralUsage(super.infoPanel);
  }

}
