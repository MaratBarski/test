import { Component, OnInit, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, ElementRef, Inject } from '@angular/core';
import { ChartBarComponent, Bar, BaseSibscriber } from '@app/core-api';
import { UsageService, UsageReportParams } from '@app/usage/services/usage.service';
import { ChartService } from '@app/usage/services/chart.service';
import { InfoPanel } from '../usage-dashboard-info-panel/usage-dashboard-info-panel.component';
import { UsageBase } from '../UsageBase';

@Component({
  selector: 'md-usage-report',
  templateUrl: './usage-report.component.html',
  styleUrls: ['./usage-report.component.scss']
})
export class UsageReportComponent extends UsageBase {

  title = 'Angular Charts';

  view: undefined;// any[] = [600, 400];

  // options for the chart
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
