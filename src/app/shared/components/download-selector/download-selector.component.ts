import { Component, OnInit, EventEmitter, Output, HostListener, Input } from '@angular/core';
import { ComponentService } from '@app/core-api';


export enum DownloadOption {
  none = 'none',
  csv = 'csv',
  pdf = 'pdf'
}

@Component({
  selector: 'md-download-selector',
  templateUrl: './download-selector.component.html',
  styleUrls: ['./download-selector.component.scss']
})
export class DownloadSelectorComponent {

  isExpanded = false;
  downloadOption: DownloadOption = DownloadOption.none;
  @Output() onSelect = new EventEmitter<DownloadOption>();
  @Output() onDownloadDefault = new EventEmitter<void>();
  @Input() pdfDisabled = false;

  readonly csv = DownloadOption.csv;
  readonly pdf = DownloadOption.pdf;
  readonly none = DownloadOption.none;

  download(ext: DownloadOption): void {
    this.downloadOption = ext;
    if (this.downloadOption === DownloadOption.none) { return; }
    this.onSelect.emit(this.downloadOption);
    setTimeout(() => {
      this.downloadOption = DownloadOption.none;
    }, 100);
  }
  expand(event: any): void {
    if (this.pdfDisabled) {
      this.downloadDefault();
      return;
    }
    if (this.isExpanded) {
      this.isExpanded = false;
      return;
    }
    ComponentService.documentClick();
    event.stopPropagation();
    this.isExpanded = true;
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    this.isExpanded = false;
  }

  downloadDefault(): void {
    this.onDownloadDefault.emit();
  }
}
