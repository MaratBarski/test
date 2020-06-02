import { Component, EventEmitter, Input, Output } from '@angular/core';

export class TabItemModel {
  title: string;
  isDropDown?: boolean;
  mouseOver?: any;
  mouseLeave?: any;
  click?: any;
  source?: any;
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
  @Input() tabid = 'tab';

  mouseover(index: number, tab: TabItemModel, event: any): void {
    if (!tab.mouseOver) { return; }
    tab.mouseOver(index, tab, event, document.getElementById(this.tabid + index));
  }

  mouseleave(index: number, tab: TabItemModel, event: any): void {
    if (!tab.mouseLeave) { return; }
    tab.mouseLeave(index, tab, event);
  }

  mouseclick(index: number, tab: TabItemModel, event: any): void {
    if (!tab.click) { return; }
    tab.click(index, tab, event);
  }

  activate(index: number, tab: TabItemModel): void {
    if (tab.isDropDown) { return; }
    if (this.active === index) { return; }
    this.active = index;
    this.select.emit(this.active);
  }
}
