import { Component, Input, EventEmitter, Output } from '@angular/core';

export class TableHeaderModel {
  text: string;
  isSortEnabled?: boolean;
  isSortedColumn?: boolean;
  sortDir?: 'asc' | 'desc';
  maxWidth?: number;
  columnId: string;
}

@Component({
  selector: 'mdc-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css']
})
export class TableHeaderComponent {

  @Input() model: TableHeaderModel;
  @Output() onSort = new EventEmitter<TableHeaderModel>()

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
}
