import { Component, Input } from '@angular/core';
import { UsageLinks } from '@app/usage/models/usage-links';
import { Router, ActivatedRoute } from '@angular/router';
import { DownloadOption } from '@app/shared/components/download-selector/download-selector.component';
import { UsageDownloadService } from '@app/usage/services/usage-download.service';
import { ChartService } from '@app/usage/services/chart.service';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { BaseSibscriber } from '@appcore';

@Component({
  selector: 'md-usage-dashboard-top',
  templateUrl: './usage-dashboard-top.component.html',
  styleUrls: ['./usage-dashboard-top.component.scss']
})
export class UsageDashboardTopComponent extends BaseSibscriber {

  constructor(
    private usageDownloadService: UsageDownloadService,
    private chrtService: ChartService,
    private router: Router,
    private usageRequestService: UsageRequestService
  ) {
    super();
    super.add(
      this.usageRequestService.onParams.subscribe(p => {
        this.includeAdmin = p.includeAdmin;
      }));
    super.add(
      this.usageRequestService.onIncludeAdmin.subscribe(() => {
        this.includeAdmin = this.usageRequestService.usageRequest.includeAdmin + '';
      })
    );
    super.add(
      this.usageRequestService.onChange.subscribe(() => {
        this.environment = this.usageRequestService.usageRequest.environment;
        this.years = this.usageRequestService.currentDateIndex;
      })
    );
  }

  links = UsageLinks;

  environment: string;
  includeAdmin = 'false';
  years = 0;

  @Input() set selectedUrl(selectedUrl: string) {
    const link = this.links.find(l => l.url === selectedUrl && l.hidden);
    this._selectedUrl = selectedUrl;
    this.selectedText = link ? link.text : undefined;
  }
  get selectedUrl(): string {
    return this._selectedUrl;
  }
  private _selectedUrl: string;
  selectedText: string;

  navigate(url: string): void {
    this.router.navigateByUrl(`/usage-dashboard/${url}`);
  }

  downloadCsv(): void {
    this.chrtService.getCsv();
  }

  download(option: DownloadOption): void {
    if (option === DownloadOption.none) { return; }

    if (option === DownloadOption.csv) {
      //this.usageDownloadService.toCSV();
      this.chrtService.getCsv();
      return;
    }

    this.usageDownloadService.toPDF();
  }


}
