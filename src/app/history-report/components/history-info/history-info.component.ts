import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'md-history-info',
  templateUrl: './history-info.component.html',
  styleUrls: ['./history-info.component.scss']
})
export class HistoryInfoComponent  {

  isOver = false;

  //todo session history modal 
  @Input() category: any;
  @Output() onClose = new EventEmitter();

  closeInfo(): void {
    this.onClose.emit();
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    if (this.isOver) { return; }
    this.closeInfo();
  }

}
