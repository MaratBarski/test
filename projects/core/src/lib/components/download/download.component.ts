import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mdc-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent {
  
  @Input() text = 'Download';
  @Output() onDownload = new EventEmitter<void>();

  download(): void {
    this.onDownload.emit();
  }
}
