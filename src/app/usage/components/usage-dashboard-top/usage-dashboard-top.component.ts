import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TabItemModel } from '@app/core-api';

@Component({
  selector: 'md-usage-dashboard-top',
  templateUrl: './usage-dashboard-top.component.html',
  styleUrls: ['./usage-dashboard-top.component.scss']
})
export class UsageDashboardTopComponent {
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
  @Input() subItemActive = -1;
  @Output() onSelect = new EventEmitter<{ tab: number, subTab: number }>();

  subItems: Array<TabItemModel> = [
    { title: 'Created' },
    { title: 'Table' }
  ];

  selectSubItem(i: number): void {
    this.subItemActive = i;
    this.tabActive = this.tabs.length - 1;
    this.showMoreTab = false;
    this.emit();
  }

  selectTab(tab: number): void {
    this.tabActive = tab;
    this.subItemActive = -1;
    this.emit();
  }

  private emit(): void {
    this.onSelect.emit({ tab: this.tabActive, subTab: this.subItemActive });
  }

}
