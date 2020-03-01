import { Component, EventEmitter, Input, Output } from '@angular/core';

export class TabItemModel {
  title: string
}

@Component({
  selector: 'mdc-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent {

  @Output() select = new EventEmitter<number>();
  @Input() active = 0;
  @Input() tabs: Array<TabItemModel>;

  activate(index: number): void {
    if (this.active === index) { return; }
    this.active = index;
    this.select.emit(this.active);
  }
}
