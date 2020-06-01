import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mdc-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent {

  @Input() fileName: string = 'download';
  @Input() text = 'Download';
  @Output() onDownload = new EventEmitter<void>();
  @Output() onBeforeDownload = new EventEmitter<void>();

  download(): void {
    this.beforeDownload();
    this.onDownload.emit();
  }

  beforeDownload():void{
    this.onBeforeDownload.emit();
  }
}
