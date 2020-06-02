import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { SessionHistory } from '@app/models/session-history';
import { environment } from '@env/environment';

@Component({
  selector: 'md-history-info',
  templateUrl: './history-info.component.html',
  styleUrls: ['./history-info.component.scss']
})
export class HistoryInfoComponent  {

  isOver = false;
  _category: SessionHistory;
  source="";
  queryOrFileName="";
  get downloadUrl(): string { return environment.serverUrl + environment.endPoints.downloadHistoryReport + '/' };

  @Input() set category(value: SessionHistory){
      this._category = value;
      this.source = !!this._category.sessionId ? "Query" : "Imported file" ;
      this.queryOrFileName = !!this._category.fileNameAlias ? this._category.fileNameAlias : this._category.sessionName ;
  }
  @Output() onClose = new EventEmitter();

  
  
  
  
  closeInfo(): void {
    this.onClose.emit();
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    if (this.isOver) { return; }
    this.closeInfo();
  }

}
