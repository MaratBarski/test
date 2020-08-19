import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'md-rule-item',
  templateUrl: './rule-item.component.html',
  styleUrls: ['./rule-item.component.scss']
})
export class RuleItemComponent {

  @Input() isShowerror = false;
  @Input() roleItem: any;
  @Output() onRemove = new EventEmitter<any>();
  @Output() onChange = new EventEmitter<any>();

  remove(): void {
    this.onRemove.emit(this.roleItem);
  }

  changed(): void {
    this.onChange.emit();
  }

}
