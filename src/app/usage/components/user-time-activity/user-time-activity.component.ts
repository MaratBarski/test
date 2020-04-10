import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TabItemModel } from 'core/public-api';
import { UsageRequestService } from '@app/usage/services/usage-request.service';

@Component({
  selector: 'md-user-time-activity',
  templateUrl: './user-time-activity.component.html',
  styleUrls: ['./user-time-activity.component.scss']
})
export class UserTimeActivityComponent {

  @Input() current = 0;
  @Output() onSelect = new EventEmitter<number>();
  @Input() buttons: Array<TabItemModel>;
  constructor(
    public usageRequestService: UsageRequestService
  ){}

  selectButton(i: number): void {
    if (this.current === i) { return; }
    this.current = i;
    this.onSelect.emit(i);
  }

}
