import { Component, Output, EventEmitter, Input } from '@angular/core';

export class TabWizardItem {
  text: string;
  isOptional?: boolean;
  isDisabled?: boolean;
}

@Component({
  selector: 'md-tab-wizard',
  templateUrl: './tab-wizard.component.html',
  styleUrls: ['./tab-wizard.component.scss']
})
export class TabWizardComponent {

  @Output() onSelect = new EventEmitter<number>();
  @Input() selectedTab = 0;
  @Input() tabs: Array<TabWizardItem> = [];

  select(i: number): void {
    if (this.tabs[i].isDisabled) { return; }
    this.onSelect.emit(i);
  }

}

