import { Component, OnInit, Input } from '@angular/core';
import { UsageService, UsageReportParams } from '@app/usage/services/usage.service';
import { BaseSibscriber, DownloadComponent, TableModel } from '@app/core-api';

@Component({
  selector: 'md-usage-table',
  templateUrl: './usage-table.component.html',
  styleUrls: ['./usage-table.component.scss']
})
export class UsageTableComponent extends BaseSibscriber implements OnInit {

  @Input() downloader: DownloadComponent;
  @Input() usageReportParams: UsageReportParams;
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
