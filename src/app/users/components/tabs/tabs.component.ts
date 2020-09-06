import { Component, Output, EventEmitter, Input } from '@angular/core';

export class TabWizardItem {
  text: string;
  isOptional?: boolean;
  isDisabled?: boolean;
}

@Component({
  selector: 'md-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {

  @Output() onSelect = new EventEmitter<number>();
  @Input() selectedTab = 0;
  @Input() tabs: Array<TabWizardItem> = [];

  select(i: number): void {
    if (this.tabs[i].isDisabled) { return; }
    this.onSelect.emit(i);
  }

}
