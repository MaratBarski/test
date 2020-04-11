import { Component, OnInit, EventEmitter, Output } from '@angular/core';

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

  downloadOption: DownloadOption = DownloadOption.none;
  @Output() onSelect = new EventEmitter<DownloadOption>();

  download(): void {
    if (this.downloadOption === DownloadOption.none) { return; }
    this.onSelect.emit(this.downloadOption);
    setTimeout(() => {
      this.downloadOption = DownloadOption.none;
    }, 100);
  }
}
