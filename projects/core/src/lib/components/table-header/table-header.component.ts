import { Component, Input, EventEmitter, Output } from '@angular/core';

export class TableHeaderModel {
  text: string;
  isSortEnabled?: boolean;
  isSortedColumn?: boolean;
  sortDir?: 'asc' | 'desc';
  maxWidth?: number;
  filter?: boolean;
  columnId: string;
}

@Component({
  selector: 'mdc-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css']
})
export class TableHeaderComponent {

  @Input() model: TableHeaderModel;
  @Output() onSort = new EventEmitter<TableHeaderModel>();
  @Output() onFilter = new EventEmitter<{ header: TableHeaderModel, event: any }>();

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
    event.stopPropagation();
    this.onFilter.emit({ header: this.model, event: event });
  }
}
