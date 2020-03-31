import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { CheckBoxListOption } from '../check-box-list/check-box-list.component';
import { PopupComponent } from '../popup/popup.component';

export class TableHeaderModel {
  text: string;
  isSortEnabled?: boolean;
  isSortedColumn?: boolean;
  sortDir?: 'asc' | 'desc';
  maxWidth?: number;
  filter?: boolean;
  columnId: string;
  csvTitle?: string;
  hidden?: boolean;
}

@Component({
  selector: 'mdc-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css']
})
export class TableHeaderComponent {
  @ViewChild('popupFilter', { static: false }) popupFilter: PopupComponent;
  @Input() model: TableHeaderModel;
  @Input() set filterOptions(filterOptions: Array<CheckBoxListOption>) {
    if (!filterOptions) { return; }
    this._filterOptions = filterOptions;
    this._originOptions = JSON.parse(JSON.stringify(filterOptions));
  }
  get filterOptions(): Array<CheckBoxListOption> {
    return this._filterOptions;
  }
  private _filterOptions: Array<CheckBoxListOption>;
  private _originOptions: Array<CheckBoxListOption>;

  @Output() onSort = new EventEmitter<TableHeaderModel>();
  @Output() onFilter = new EventEmitter<{ header: TableHeaderModel, event: any }>();
  @Output() onApplyFilter = new EventEmitter<TableHeaderComponent>();

  onCloseFilter(): void {
    if (this.popupFilter.isExpanded) {
      this.cancelFilter();
    }
  }

  applyFilter(): void {
    this._originOptions = JSON.parse(JSON.stringify(this._filterOptions));
    this.popupFilter.isExpanded = false;
    this.onApplyFilter.emit(this);
  }

  cancelFilter(): void {
    this._filterOptions = JSON.parse(JSON.stringify(this._originOptions));
    this.popupFilter.isExpanded = false;
  }

  sort(): void {
    if (!this.model.isSortEnabled) { return; }
    if (!this.model.sortDir) {
      this.model.sortDir = 'asc';
    } else {
      this.model.sortDir = this.model.sortDir === 'asc' ? 'desc' : 'asc';
    }
    this.model.isSortedColumn = true;
    this.onSort.emit(this.model);
  }

  openFilter(event: any): void {
    if (this.popupFilter.isExpanded) { return; }
    this.popupFilter.isExpanded = false;
    this.popupFilter.show(true, undefined);
    this.onFilter.emit({ header: this.model, event: event });
  }
}
