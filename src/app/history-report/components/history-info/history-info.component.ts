import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { SessionHistory } from '@app/models/session-history';

@Component({
  selector: 'md-history-info',
  templateUrl: './history-info.component.html',
  styleUrls: ['./history-info.component.scss']
})
export class HistoryInfoComponent  {

  isOver = false;

  //todo session history modal 
  @Input() category: SessionHistory;
  @Output() onClose = new EventEmitter();

  closeInfo(): void {
    this.onClose.emit();
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    if (this.isOver) { return; }
    this.closeInfo();
  }

}
