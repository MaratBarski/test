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

  @Input() showAnyMore = false;
  @Output() onUpdateMessage = new EventEmitter<string>();

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
