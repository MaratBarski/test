import { Component, OnInit, Input } from '@angular/core';
import { TabItemModel } from '@app/core-api';

@Component({
  selector: 'md-usage-dashboard-top',
  templateUrl: './usage-dashboard-top.component.html',
  styleUrls: ['./usage-dashboard-top.component.scss']
})
export class UsageDashboardTopComponent implements OnInit {

  showMoreTab = false;
  tabs: Array<TabItemModel> = [
    { title: 'General Usage' },
    { title: 'Monthly Activity' },
    { title: 'Activity per User' },
    {
      title: 'Top 10 Users',
      mouseOver: (index: number, tab: TabItemModel, event: any) => { this.showMoreTab = false; }
    },
    {
      title: 'More: Retention', isDropDown: true,
      mouseOver: (index: number, tab: TabItemModel, event: any, target: any) => {
        this.showMoreTab = true;
      }
    }
  ];
  @Input() tabActive = 0;


  selectTab(tab: number): void {
    this.tabActive = tab;
  }

  constructor() { }

  ngOnInit() {
  }

}
