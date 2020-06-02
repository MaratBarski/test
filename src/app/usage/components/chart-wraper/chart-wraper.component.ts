import { Component, Input } from '@angular/core';
import { ChartService } from '@app/usage/services/chart.service';

@Component({
  selector: 'md-chart-wraper',
  templateUrl: './chart-wraper.component.html',
  styleUrls: ['./chart-wraper.component.scss']
})
export class ChartWraperComponent {

  @Input() firstTitle: string;
  @Input() secondTitle: string;
  @Input() firstChart: any;
  @Input() secondChart: any;
  @Input() firstLegendTemplate: any;
  @Input() secondLegendTemplate: any;
  @Input() isLegend = false;

  constructor(public chartService: ChartService) { }


}
