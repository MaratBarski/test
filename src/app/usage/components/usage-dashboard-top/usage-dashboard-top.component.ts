import { Component, Input, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { TabItemModel, BaseSibscriber, DownloadComponent } from '@app/core-api';
import { UsageService, UsageReportState } from '@app/usage/services/usage.service';

@Component({
  selector: 'md-usage-dashboard-top',
  templateUrl: './usage-dashboard-top.component.html',
  styleUrls: ['./usage-dashboard-top.component.scss']
})
export class UsageDashboardTopComponent extends BaseSibscriber implements OnInit {

  @ViewChild('downloader', { static: true }) downloader: DownloadComponent;
  @Input() downloadFileName = 'download.csv';
  
  constructor(private usageService: UsageService) {
    super();
    super.add(
      this.usageService.onStateChanged.subscribe((state: UsageReportState) => {
        this.tabActive = state.tab;
        this.subItemActive = state.subTab;
        if (this.subItemActive !== -1) {
          this.subTab.title = `More ${this.subItems[this.subItemActive].title}`;
        } else {
          this.subTab.title = 'More';
        }
      }));
  }

  showMoreTab = false;
  subTab = {
    title: 'More:', isDropDown: true,
    mouseOver: (index: number, tab: TabItemModel, event: any, target: any) => {
      this.showMoreTab = true;
    }
  };
  tabs: Array<TabItemModel> = [
    { title: 'General Usage' },
    { title: 'Monthly Activity' },
    { title: 'Activity per User' },
    {
      title: 'Top 10 Users',
      mouseOver: (index: number, tab: TabItemModel, event: any) => { this.showMoreTab = false; }
    },
    this.subTab
  ];

  @Input() tabActive = 0;
  @Input() subItemActive = -1;
  @Output() onSelect = new EventEmitter<{ tab: number, subTab: number }>();

  subItems: Array<TabItemModel> = [
    { title: 'Retention' },
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

  ngOnInit(): void {
  }

}
