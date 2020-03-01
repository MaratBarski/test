import { Component, EventEmitter, Input, Output } from '@angular/core';

export class CheckBoxListOption {
  isChecked: boolean;
  text: string;
}
@Component({
  selector: 'mdc-check-box-list',
  templateUrl: './check-box-list.component.html',
  styleUrls: ['./check-box-list.component.css']
})
export class CheckBoxListComponent {

  @Output() cancel = new EventEmitter();
  @Output() apply = new EventEmitter();

  @Input()
  set isCheckedAll(isCheckedAll: boolean) {
    this._isCheckedAll = isCheckedAll;
    if (this._isCheckedAll) {
      this.selectAll(true);
    }
  };
  get isCheckedAll(): boolean { return this._isCheckedAll; }
  private _isCheckedAll = false;

  @Input() options: Array<CheckBoxListOption>;

  clear(): void {
    this.isCheckedAll = false;
    this.selectAll(false);
  }

  applyClick(): void {
    this.apply.emit();
  }

  cancelClick(): void {
    this.cancel.emit();
  }

  selectAll(isChecked: boolean): void {
    if (this.options) {
      this.options.forEach(option => option.isChecked = isChecked)
    }
  }
}
