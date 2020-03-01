import { Component, Input, EventEmitter, Output, OnDestroy, ChangeDetectionStrategy, TemplateRef } from '@angular/core';
import { TableHeaderModel } from '../table-header/table-header.component';
import { ComponentService } from '../../services/component.service';
import { AutoSearchComponent } from '../auto-search/auto-search.component';
import { SearchService } from '../../services/search.service';
import { SubscriptionLike } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';

export class PaginatorInfo {
  currentPage: number;
  blockSize: number;
  pageSize: number;
}
export class TableRowModel {
  cells: { [key: string]: any };
  isActive?: boolean;
}
export class TableModel {
  headers: Array<TableHeaderModel>;
  rows: Array<TableRowModel>;
  activeRow?: TableRowModel;
};

@Component({
  selector: 'mdc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TableComponent implements OnDestroy {

  constructor(
    private searchService: SearchService
  ) { }

  private _subscriptions: Array<SubscriptionLike> = [];
  ngOnDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  private _serachText = '';
  get serachText(): string { return this._serachText; }

  @Output() onSort = new EventEmitter<TableHeaderModel>();

  @Input() set paginator(paginator: PaginatorComponent) {
    this._paginator = paginator;
    this.initPaginator();
    this._subscriptions.push(
      this._paginator.nextPageClick.subscribe((page: number) => {
        ComponentService.resetScroll();
        this.paginator.currentPage = page;
      }));
  }
  get paginator(): PaginatorComponent { return this._paginator; }
  private _paginator: PaginatorComponent;

  @Input() set search(search: AutoSearchComponent) {
    this._search = search;
    this._subscriptions.push(
      this._search.complite.subscribe((text: string) => {
        this.resetPaginator();
        this._rows = this.searchService.filterRows(
          this.dataSource.rows, { text: text, columns: this.searchOptions }
        );
        this._serachText = text;
        this.reloadPaginator();
      }));
  }
  get search(): AutoSearchComponent { return this._search; }
  private _search: AutoSearchComponent;

  @Input() headersTemplate: Array<{ [key: string]: TemplateRef<any> }>;
  @Input() cellsTemplate: Array<{ [key: string]: TemplateRef<any> }>;
  @Input() isMultiSelect = false;

  @Input() set searchOptions(searchOptions: Array<string>) {
    this._searchOptions = searchOptions;
  }
  get searchOptions(): Array<string> {
    if (!this._searchOptions) {
      this._searchOptions = [];
      if (!this.dataSource) { return this._searchOptions; }
      if (!this.dataSource.headers) { return this._searchOptions; }
      this._searchOptions = [...this.dataSource.headers.map(header => header.columnId)];
    }
    return this._searchOptions;
  }
  private _searchOptions: Array<string>;

  sortModel: TableHeaderModel;

  @Input() set dataSource(data: TableModel) {
    this.resetPaginator();
    const sorted = data.headers.filter(h => h.isSortedColumn);
    for (let i = 1; i < sorted.length; i++) {
      sorted[i].isSortedColumn = false;
    }
    if (sorted.length) {
      if (!sorted[0].sortDir) {
        sorted[0].sortDir = 'asc';
      }
      this.sortModel = { ...sorted[0] };
    }
    this._dataSource = data;
    data.rows.filter(row => row.isActive).forEach((row, index) => { row.isActive = !index; });
    this._rows = this.searchService.filterRows(
      data.rows, { text: this.serachText, columns: this.searchOptions }
    );
    this.initPaginator();
    this.reloadPaginator();
  }

  get dataSource(): TableModel {
    return this._dataSource;
  }
  private _dataSource: TableModel;

  get rows(): Array<TableRowModel> { return this._rows; }
  private _rows: Array<TableRowModel>;

  get isPaginator(): boolean {
    return !!this.paginator;
  }

  private initPaginator(): void {
    if (!this.isPaginator) { return; }
    if (!this.rows) { return; }
    this.paginator.list = this.rows.length;
  }

  private reloadPaginator(): void {
    if (!this.isPaginator) { return; }
    this.paginator.reload(this._rows.length);
  }

  resetPaginator(): void {
    if (!this.isPaginator) { return; }
    this.paginator.currentPage = 0;
  }

  sort(header: TableHeaderModel): void {
    this.resetPaginator();
    const sorted = this.dataSource.headers.find(h => h.isSortedColumn && h !== header);
    if (sorted) { sorted.isSortedColumn = false; }
    this.sortModel = { ...header };
    this.onSort.emit(header);
  }

  rowClick(row: TableRowModel): void {
    if (this.isMultiSelect) {
      row.isActive = !!!row.isActive;
      return;
    }
    this.dataSource.rows.filter(r => r.isActive).forEach(r => r.isActive = false);
    row.isActive = true;
    this.dataSource.activeRow = row;
  }
}
