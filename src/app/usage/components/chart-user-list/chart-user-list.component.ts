import { Component, EventEmitter, Input, Output } from '@angular/core';
import { } from 'events';

@Component({
  selector: 'md-chart-user-list',
  templateUrl: './chart-user-list.component.html',
  styleUrls: ['./chart-user-list.component.scss']
})
export class ChartUserListComponent {
  @Input() users: { name: string; value: string; }
  @Output() onClose = new EventEmitter<any>();
  close(event: any): void {
    this.onClose.emit(event);
  }
}
