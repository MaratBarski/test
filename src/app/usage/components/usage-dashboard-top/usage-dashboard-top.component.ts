import { Component, HostListener, Input, OnInit } from '@angular/core';
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
export class UsageDashboardTopComponent extends BaseSibscriber implements OnInit {

  constructor(
    private usageDownloadService: UsageDownloadService,
    private chrtService: ChartService,
    private router: Router,
    private usageRequestService: UsageRequestService,
    private activeRouter: ActivatedRoute
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
    super.add(this.activeRouter.url.subscribe(url => {
      if (url) {
        this.currentUrl = url.join('').toLowerCase();
      }
    }));
  }

  links = UsageLinks;
  currentUrl = '';
  environment: string;
  includeAdmin = 'false';
  years = 0;

  @Input() pdfDisabled = false;

  @Input() set selectedUrl(selectedUrl: string) {
    const link = this.links.find(l => l.url === selectedUrl && l.hidden);
    this._selectedUrl = selectedUrl;
    this.selectedText = link && !link.dynamic ? link.text : undefined;
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

  ngOnInit(): void {
    this.updateLinksPosition(window.innerWidth);
  }

  windowWidth = -1
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.windowWidth = event.target.innerWidth;
    this.updateLinksPosition(event.target.innerWidth);
  }

  updateLinksPosition(width: number): void {
    this.links
      .filter(x => x.minWidth)
      .forEach((l: any) => {
        if (l.minWidth > width) {
          l.hidden = true;
          l.css = undefined;
          l.alt = undefined;
          l.dynamic = true;
          if (l.url === this.currentUrl) {
            this.selectedText = l.text;
          }
        } else {
          l.hidden = false;
          l.css = 'd-none d-lg-inline-block';
          l.alt = 'd-lg-none';
          if (l.url === this.currentUrl) {
            this.selectedText = '';
          }
        }
      })
  }
}
