import { Component } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';

@Component({
  selector: 'md-usage-user-activity',
  templateUrl: './usage-user-activity.component.html',
  styleUrls: ['./usage-user-activity.component.scss']
})
export class UsageUserActivityComponent extends UsageBase  {

  title = 'Angular Charts';

  view: undefined;// any[] = [600, 400];
  
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Sales';
  timeline = true;

  colorScheme = {
    domain: ['#002060']
  };

  
  constructor(protected usageService: UsageService, protected chartService: ChartService) {
    super();
  }

  createReport(): void {
    super.responseData = this.chartService.getGeneralUsage(super.infoPanel);
  }

}
