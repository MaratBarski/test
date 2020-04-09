import { Component } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { ComponentService } from '@app/core-api';

@Component({
  selector: 'md-usage-created',
  templateUrl: './usage-created.component.html',
  styleUrls: ['./usage-created.component.scss']
})
export class UsageCreatedComponent extends UsageBase  {

  view: undefined;// any[] = [600, 400];
  showXAxis = true;
  showYAxis = false;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = '';
  yAxisLabel = 'Sales';
  showYAxisLabel = true;
  timeline = true;

  colorScheme = {
    domain: ['#5B9BD5']
  };

  constructor(
    protected componentService: ComponentService,
    protected usageService: UsageService, 
    protected chartService: ChartService
    ) {
    super();
  }

  createReport(): void {
    super.responseData = this.chartService.getCreatedUsagee(super.infoPanel);
  }
}
