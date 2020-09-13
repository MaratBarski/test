import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectOption } from '@appcore';

@Component({
  selector: 'md-user-role-selector',
  templateUrl: './user-role-selector.component.html',
  styleUrls: ['./user-role-selector.component.scss'],
})
export class UserRoleSelectorComponent {

  @Input() set selectedId(i: number) {
    this._selectedId = i;
    this.setSelected();
  }
  get selectedId(): number { return this._selectedId; }
  private _selectedId = -1;

  @Input() set options(options: Array<SelectOption>) {
    this._options = options;
    this.setSelected();
  }
  get options(): Array<SelectOption> { return this._options; }
  private _options: Array<SelectOption>;

  @Output() changed = new EventEmitter<SelectOption>();

  @Input() label = 'Role:';

  selected: SelectOption;

  isExpanded = false;

  setSelected(): void {
    if (!this.options || !this.options.length) { return; }
    this.selected = this.options.find(x => x.id === this.selectedId);
  }

  blur() { this.isExpanded = false; }

  select(option: SelectOption): void {
    this.isExpanded = false;
    if (this.selected === option) { return; }
    this.selected = option;
    this.changed.emit(this.selected);
  }

  mouseClick(event: any): void {
    this.isExpanded = !this.isExpanded;
  }
}
