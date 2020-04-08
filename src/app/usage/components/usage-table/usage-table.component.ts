import { Component, OnInit, Input } from '@angular/core';
import { UsageService, UsageReportParams } from '@app/usage/services/usage.service';
import { BaseSibscriber, DownloadComponent, TableModel } from '@app/core-api';
import { InfoPanel } from '../usage-dashboard-info-panel/usage-dashboard-info-panel.component';

@Component({
  selector: 'md-usage-table',
  templateUrl: './usage-table.component.html',
  styleUrls: ['./usage-table.component.scss']
})
export class UsageTableComponent extends BaseSibscriber implements OnInit {

  @Input() downloader: DownloadComponent;
  @Input() usageReportParams: UsageReportParams = {};
  @Input() set infoPanel(infoPanel: InfoPanel) {
    this._infoPanel = infoPanel;
    this.createReport();
  }
  get infoPanel(): InfoPanel { return this._infoPanel; }
  private _infoPanel: InfoPanel;
  report: any;
  dataSource: TableModel;
  searchOptions = ['login', 'daysSinceLastLogin', 'environment'];

  constructor(
    public usageService: UsageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.createReport();
  }

  createReport(): void {
    super.add(
      this.usageService.getUsageReport(this.usageReportParams).subscribe(res => {
        this.report = res;
        this.dataSource = this.usageService.createDataSource(this.report.data);
      }));
  }
}
