import { Component, OnInit } from '@angular/core';
import { BaseChartBar } from '../../common/chart/BaseChartBar';

@Component({
  selector: 'mdc-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.css']
})

export class ChartBarComponent extends BaseChartBar implements OnInit {

  constructor() {
    super();
  }

  afterInit(): void {

  }
}
