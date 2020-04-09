import { Component } from '@angular/core';
import { ComponentService } from '@app/core-api';
import { UsageService, } from '@app/usage/services/usage.service';
import { ChartService } from '@app/usage/services/chart.service';
import { UsageBase } from '../UsageBase';

@Component({
  selector: 'md-usage-report',
  templateUrl: './usage-report.component.html',
  styleUrls: ['./usage-report.component.scss']
})
export class UsageReportComponent extends UsageBase {

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
    domain: ['#002060']
  };


  constructor(
    protected componentService: ComponentService,
    protected usageService: UsageService,
    protected chartService: ChartService
  ) {
    super();
  }

  createReport(): void {
    super.responseData = this.chartService.getGeneralUsage(super.infoPanel);
  }
}

//https://swimlane.gitbook.io/ngx-charts/v/docs-test/examples/bar-charts/horizontal-bar-chart
