import { Component, Input } from '@angular/core';

@Component({
  selector: 'md-chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['./chart-legend.component.scss']
})
export class ChartLegendComponent {

  @Input() legendTemplate: any;


}
