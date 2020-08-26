import { Component, Input, ViewChild } from '@angular/core';
import { ChartService } from '@app/usage/services/chart.service';
import { ChartLegendComponent } from '../chart-legend/chart-legend.component';

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

  @ViewChild('firstLegend', { static: false }) firstLegend: ChartLegendComponent;
  @ViewChild('secondLegend', { static: false }) secondLegend: ChartLegendComponent;


  constructor(public chartService: ChartService) { }


}
