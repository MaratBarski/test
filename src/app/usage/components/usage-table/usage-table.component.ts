import { Component, Input } from '@angular/core';
import { UsageService } from '@app/usage/services/usage.service';
import { DownloadComponent, TableModel, ComponentService, DateService, EmptyState } from '@appcore';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { UsageBase } from '../UsageBase';
import { ChartService } from '@app/usage/services/chart.service';
import { UsageDownloadService, DownloadData } from '@app/usage/services/usage-download.service';

@Component({
  selector: 'md-usage-table',
  templateUrl: './usage-table.component.html',
  styleUrls: ['./usage-table.component.scss']
})
export class UsageTableComponent extends UsageBase {

  @Input() downloader: DownloadComponent;
  data: TableModel;
  searchOptions = ['login', 'permission'];

  constructor(
    private usageDownloadService: UsageDownloadService,
    private dateService: DateService,
    protected componentService: ComponentService,
    protected usageService: UsageService,
    protected chartService: ChartService,
    public usageRequestService: UsageRequestService
  ) {
    super();
    super.dataSourceReady = () => {
      this.data = this.usageService.createSummaryDataSource(this.dataSource);
    }

    super.add(
      this.usageRequestService.onSelectUserChange.subscribe(() => {
        this.data = this.usageService.createSummaryDataSource(this.dataSource);
      }));

    this.usageDownloadService.toCSV = () => this.toCSV();
    this.usageDownloadService.toPDF = () => this.toPDF();
  }

  emptyState: EmptyState = {
    title: 'Nothing matches your search.',
    subTitle: 'Try using the filters or search different keywords',
    image: 'nodata.png'
  }


  downloadData: DownloadData = {
    pageName: 'Table',
    fileName: 'Table'
  }

  private toPDF(): void {
    this.downloadData.charts = [];
    const body = [];
    this.dataSource.forEach((item: any) => {
      body.push([
        item.userName,
        this.dateService.toExcel(item.lastLogin),
        item.permission,
        item.loginDays,
        item.origin,
        item.syntetic
      ]);
    });
    this.downloadData.charts.push({
      headers: [
        'User Name',
        'Last Login',
        'Permission',
        'Login Days',
        'Original',
        'Synthetic'
      ],
      body: body
    });

    this.usageDownloadService.downloadPDF(this.downloadData);
  }

  private toCSV(): void {
    alert('TableModel csv');
  }

  createReport(): void {
    super.responseData = this.chartService.getSummaryTable();
    // super.add(
    //   super.responseData.subscribe(res => {
    //     this.data = this.usageRequestService.createData(res.data);
    //   }));
  }
}
