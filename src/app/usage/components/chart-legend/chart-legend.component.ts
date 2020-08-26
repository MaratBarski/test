import { Component, Input, HostListener } from '@angular/core';
import { ComponentService } from '@app/core-api';

@Component({
  selector: 'md-chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['./chart-legend.component.scss']
})
export class ChartLegendComponent {

  @Input() legendTemplate: any;

  isShowLegend = false;
  showLegend(event: any): void {
    ComponentService.documentClick(event);
    this.isShowLegend = true;
  }

  closeLegend(): void {
    this.isShowLegend = false;
  }

  // @HostListener('document:click', ['$event']) onMouseClick(event: any) {
  //   this.isShowLegend = false;
  // }

}
