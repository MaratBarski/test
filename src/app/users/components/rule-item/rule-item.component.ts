import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'md-rule-item',
  templateUrl: './rule-item.component.html',
  styleUrls: ['./rule-item.component.scss']
})
export class RuleItemComponent implements OnInit {

  @Input() roleItem: any;
  @Output() onRemove = new EventEmitter<any>();

  constructor() { }

  remove(): void {
    this.onRemove.emit(this.roleItem);
  }
  
  ngOnInit() {
  }

}
