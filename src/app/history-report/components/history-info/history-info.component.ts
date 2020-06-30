import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { SessionHistory } from '@app/models/session-history';
import { environment } from '@env/environment';
import { DownloadService } from '@app/shared/services/download.service';

@Component({
  selector: 'md-history-info',
  templateUrl: './history-info.component.html',
  styleUrls: ['./history-info.component.scss']
})
export class HistoryInfoComponent {

  isOver = false;
  private _category: SessionHistory;
  source = "";
  queryOrFileName = "";
  get downloadUrl(): string { return `${environment.serverUrl}${environment.endPoints.downloadHistoryReport}`; }

  @Input() set category(value: SessionHistory) {
    this._category = value;
    this.source = !!this._category.sessionId ? "Query" : "Imported file";
    this.queryOrFileName = !!this._category.fileNameAlias ? this._category.fileNameAlias : this._category.sessionName;
  }
  get category(): SessionHistory {
    return this._category;
  }
  @Output() onClose = new EventEmitter();

  constructor(private downloadService: DownloadService) { }

  download(): void {
    this.downloadService.download(`${this.downloadUrl}/${this.category.sessionHistoryId}`);
  }

  closeInfo(): void {
    this.onClose.emit();
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    if (this.isOver) { return; }
    this.closeInfo();
  }

}
