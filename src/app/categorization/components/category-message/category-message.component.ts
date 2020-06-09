import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ComponentService } from '@appcore';

@Component({
  selector: 'md-category-message',
  templateUrl: './category-message.component.html',
  styleUrls: ['./category-message.component.scss']
})
export class CategoryMessageComponent {

  showMessageBox = false;
  message = '';

  @Output() onUpdateMessage = new EventEmitter<string>();
  @Input() oldNewDifCount = 0;
  oldNotMapedTitle = '';

  _notInUse = [];
  @Input() set notInUse(notInUse: Array<string>) {
    this._notInUse = notInUse;
    this.oldNotMapedTitle = '';
    this._notInUse.forEach((item, i) => {
      if (i > 1) { return; }
      this.oldNotMapedTitle += item;
      if (i === 0) {
        this.oldNotMapedTitle += ',';
      }
    })
  }

  get notInUse(): Array<string> {
    return this._notInUse;
  }

  constructor() { }

  openMessageBox(event: any): void {
    ComponentService.documentClick(event);
    this.showMessageBox = true;
  }

  closeMessageBox(event: any): void {
    this.showMessageBox = false;
  }

  updateMessage(): void {
    this.showMessageBox = false;
    this.onUpdateMessage.emit(this.message);
  }

  clearMessage(): void {
    this.message = '';
    this.showMessageBox = false;
    this.onUpdateMessage.emit(this.message);
  }

}
