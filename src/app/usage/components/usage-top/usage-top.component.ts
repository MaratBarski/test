import { Component } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { TabItemModel } from '@app/core-api';

@Component({
  selector: 'md-usage-top',
  templateUrl: './usage-top.component.html',
  styleUrls: ['./usage-top.component.scss']
})
export class UsageTopComponent extends UsageBase {

  constructor(protected usageService: UsageService, protected chartService: ChartService) {
    super();
  }

  createReport(): void {
    super.responseData = this.chartService.getGeneralUsage(super.infoPanel);
  }

  activityButtons: Array<TabItemModel> = [
    { title: 'Month', source: 1 },
    { title: '3 Months', source: 3 },
    { title: '6 Months', source: 6 }
  ];

  currentActivity = 0;
  changeCurrentAcitity(i: number): void {
    this.currentActivity = i;
    this.createReport();
  }

}
