import { Component, Input, EventEmitter, Output, OnDestroy, ChangeDetectionStrategy, TemplateRef, AfterViewInit, ViewChild } from '@angular/core';
import { TableHeaderModel, TableHeaderComponent } from '../table-header/table-header.component';
import { ComponentService } from '../../services/component.service';
import { AutoSearchComponent } from '../auto-search/auto-search.component';
import { SearchService } from '../../services/search.service';
import { SubscriptionLike } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { CheckBoxListOption } from '../check-box-list/check-box-list.component';
import { CsvManagerService } from '../../services/csv-manager.service';
import { DownloadComponent } from '../download/download.component';

export class PaginatorInfo {
  currentPage: number;
  blockSize: number;
  pageSize: number;
}
export class TableRowModel {
  cells: { [key: string]: any };
  csv?: { [key: string]: any };
  source?: any;
  isActive?: boolean;
}
export class TableModel {
  headers: Array<TableHeaderModel>;
  rows: Array<TableRowModel>;
  activeRow?: TableRowModel;
  resetFilter?: boolean;
};

@Component({
  selector: 'mdc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TableComponent implements OnDestroy, AfterViewInit {

  constructor(
    private csvManagerService: CsvManagerService,
    private searchService: SearchService
  ) {
  }

  filters: any;

  private _subscriptions: Array<SubscriptionLike> = [];
  ngOnDestroy(): void {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  private initFilters(): void {
    if (this.filters) { return; }
    if (!this._dataSource || !this._dataSource.headers) { return; }
    this.filters = {};
    this.dataSource.headers.filter(h => h.filter).forEach(header => {
      this.filters[header.columnId] = [];
      const dict = {}
      this.dataSource.rows.forEach(data => {
        const value = data.cells[header.columnId];
        if (!value) { return; }
        if (dict[value.toString()]) { return; }
        dict[value.toString()] = true;
        const filterOption: CheckBoxListOption = {
          id: value.toString(),
          isChecked: true,
          text: value.toString()
        }
        this.filters[header.columnId].push(filterOption);
      })
    });
  }

  ngAfterViewInit(): void {
    this.resetPaginator();
    this.initPaginator();
    this.reloadPaginator();
  }

  private _serachText = '';
  get serachText(): string { return this._serachText; }

  @Output() onSort = new EventEmitter<TableHeaderModel>();
  @Output() onFilter = new EventEmitter<{ header: TableHeaderModel, event: any }>();

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

  @Input() set downloader(dowmload: DownloadComponent) {
    this._subscriptions.push(
      dowmload.onDownload.subscribe(() => {
        this.csvManagerService.downloadCsv(dowmload.fileName, { ...this.dataSource, rows: this._rows });
      }));
  }

  @Input() set search(search: AutoSearchComponent) {
    this._search = search;
    this._subscriptions.push(
      this._search.complete.subscribe((text: string) => {
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
    if (!data) { return; }
    const isResetFilter = !!data.resetFilter;
    data.resetFilter = false;
    if (!this._dataSourceOrigin || isResetFilter) {
      this._dataSourceOrigin = { ...data };
    }
    if (!isResetFilter) {
      data = this.filterData(data);
    } else {
      this.filters = undefined;
    }
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
    this.initFilters();
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
  private _dataSourceOrigin: TableModel;

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
    if (!this.isPaginator || !this._rows) { return; }
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

  filter(event: { header: TableHeaderModel, event: any }): void {
    this.onFilter.emit(event);
  }

  private filterData(data: TableModel): TableModel {
    if (!this.filters) { return { ...data }; }
    let rows = data.rows;
    Object.keys(this.filters).forEach(k => {
      const filtered = this.filters[k].filter((cb: CheckBoxListOption) => cb.isChecked);
      if (!filtered.length) { rows = []; return; }
      if (filtered.length === this.filters[k].length) { return; }
      const dict = {};
      filtered.forEach((x: CheckBoxListOption) => { dict[x.text] = true });
      rows = rows.filter(row => {
        return dict[row.cells[k]];
      });
    });
    return { ...data, rows: rows };
  }

  onApplyFilter(header: TableHeaderComponent): void {
    this.filters[header.model.columnId] = header.filterOptions;
    this.dataSource = this._dataSourceOrigin;
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
