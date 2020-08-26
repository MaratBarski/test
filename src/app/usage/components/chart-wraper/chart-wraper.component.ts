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

  @Input() set firstChartHasData(flag: boolean) {
    setTimeout(() => {
      this._firstChartHasData = flag;
    }, 0);
  }
  @Input() set secondChartHasData(flag: boolean) {
    setTimeout(() => {
      this._secondChartHasData = flag;
    }, 0);
  }
  
  @ViewChild('firstLegend', { static: false }) firstLegend: ChartLegendComponent;
  @ViewChild('secondLegend', { static: false }) secondLegend: ChartLegendComponent;

  get firstChartHasData(): boolean {
    return this._firstChartHasData;
  }
  get secondChartHasData(): boolean {
    return this._secondChartHasData;
  }
  private _firstChartHasData = true;
  private _secondChartHasData = true;

  constructor(public chartService: ChartService) { }


}
