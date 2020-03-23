import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

export class CheckBoxListOption {
  isChecked?: boolean;
  text: string;
  id: any;
}
@Component({
  selector: 'mdc-check-box-list',
  templateUrl: './check-box-list.component.html',
  styleUrls: ['./check-box-list.component.css']
})
export class CheckBoxListComponent implements OnInit {

  @Output() cancel = new EventEmitter();
  @Output() apply = new EventEmitter();

  @Input()
  set isCheckedAll(isCheckedAll: boolean) {
    this._isCheckedAll = isCheckedAll;
    if (this._isCheckedAll) {
      this.selectAll(true);
    }
  }

  get checkedCount(): number {
    if (!this.options) { return 0; }
    return this.options.filter(x => x.isChecked).length;
  }

  get unCheckedCount(): number {
    if (!this.options) { return 0; }
    return this.options.filter(x => !x.isChecked).length;
  }

  ngOnInit(): void {
    this._isCheckedAll = (this.unCheckedCount === 0);
  }

  get isCheckedAll(): boolean { return this._isCheckedAll; }
  private _isCheckedAll = false;

  @Input() set options(options: Array<CheckBoxListOption>) {
    this._sourceOptions = JSON.parse(JSON.stringify(options));
    this._options = options;
    this.ngOnInit();
  }

  get options(): Array<CheckBoxListOption> { return this._options; }
  private _options: Array<CheckBoxListOption>;

  get sourceOptions(): Array<CheckBoxListOption> {
    return this._sourceOptions;
  }
  private _sourceOptions: Array<CheckBoxListOption>

  clear(): void {
    this.isCheckedAll = false;
    this.selectAll(false);
  }

  onChangeAll(isChecked: boolean): void {
    if (!this.options) { return; }
    this.options.forEach(x => x.isChecked = isChecked);
  }

  applyClick(): void {
    this._sourceOptions = JSON.parse(JSON.stringify(this._options));
    this.apply.emit();
  }

  cancelClick(): void {
    this._options = JSON.parse(JSON.stringify(this._sourceOptions));
    this.cancel.emit();
  }

  selectAll(isChecked: boolean): void {
    if (!this.options) { return; }
    this.options.forEach(option => option.isChecked = isChecked)
  }

  onChange(isChecked: boolean): void {
    this._isCheckedAll = (this.unCheckedCount === 0);
  }
}
