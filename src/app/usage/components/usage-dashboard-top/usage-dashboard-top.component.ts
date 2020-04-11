import { Component, Input } from '@angular/core';
import { UsageLinks } from '@app/usage/models/usage-links';
import { Router } from '@angular/router';
import { DownloadOption } from '@app/shared/components/download-selector/download-selector.component';
import { UsageDownloadService } from '@app/usage/services/usage-download.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'md-usage-dashboard-top',
  templateUrl: './usage-dashboard-top.component.html',
  styleUrls: ['./usage-dashboard-top.component.scss']
})
export class UsageDashboardTopComponent {

  constructor(
    private usageDownloadService: UsageDownloadService,
    private router: Router
  ) { }

  links = UsageLinks;
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

  download(option: DownloadOption): void {
    if (option === DownloadOption.none) { return; }

    if (option === DownloadOption.csv) {
      this.downloadCsv(this.usageDownloadService.toCSV());
      return;
    }

    this.downloadPdf(this.usageDownloadService.toPDF());
  }

  private downloadCsv(data: any): void {

  }

  private downloadPdf(data: any): void {
    pdfMake.createPdf(data).download();
  }
}
