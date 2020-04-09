import { Component } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { TabItemModel, ComponentService } from '@app/core-api';

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
    protected componentService: ComponentService,
    protected usageService: UsageService,
    protected chartService: ChartService
  ) {
    super();
  }

  createReport(): void {
    super.responseData = this.chartService.getTop10Usage(super.infoPanel);
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
