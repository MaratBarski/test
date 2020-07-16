import { Component, Input, EventEmitter, Output, OnDestroy, ChangeDetectionStrategy, TemplateRef, AfterViewInit, ViewChild, HostListener, Renderer2, ElementRef, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { TableHeaderModel, TableHeaderComponent } from '../table-header/table-header.component';
import { ComponentService } from '../../services/component.service';
import { AutoSearchComponent } from '../auto-search/auto-search.component';
import { SearchService } from '../../services/search.service';
import { SubscriptionLike } from 'rxjs';
import { PaginatorComponent } from '../paginator/paginator.component';
import { CheckBoxListOption } from '../check-box-list/check-box-list.component';
import { CsvManagerService } from '../../services/csv-manager.service';
import { DownloadComponent } from '../download/download.component';
import { EmptyState, DefaultEmptyState } from '../empty-state/empty-state.component';
import { RowInfoComponent } from '../row-info/row-info.component';
import { AnimationService } from '../../services/animation.service';
import { MenuLink, ModalMenuComponent } from '../modal-menu/modal-menu.component';
import { SortService } from '../../services/sort.service';

export interface TableActionCommand {
  command: string;
  item: TableRowModel;
}
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
  actionsDisabled?: boolean;
}
export class TableModel {
  headers: Array<TableHeaderModel>;
  rows: Array<TableRowModel>;
  activeRow?: TableRowModel;
  resetFilter?: boolean;
  actions?: { links?: Array<MenuLink>, subLinks?: Array<MenuLink> }
};

@Component({
  selector: 'mdc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TableComponent implements OnDestroy, AfterViewInit, AfterViewChecked {

  constructor(
    private csvManagerService: CsvManagerService,
    private searchService: SearchService,
    private renderer2: Renderer2,
    private animationService: AnimationService,
    private sortService: SortService,
    private cdRef: ChangeDetectorRef
  ) {
    this._subscriptions.push(
      this.animationService.onShowElement.subscribe(elm => {
        if (elm !== this.commandRow) {
          this.commandRow = undefined;
        };
      })
    )
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
      });
      this.filters[header.columnId].sort((a: CheckBoxListOption, b: CheckBoxListOption) => {
        return this.sortService.compareString(a.text, b.text, 'asc');
      })
    });
  }

  ngAfterViewInit(): void {
    this.resetPaginator();
    this.initPaginator();
    this.reloadPaginator();
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  private _serachText = '';
  get serachText(): string { return this._serachText; }

  @Output() onSort = new EventEmitter<TableHeaderModel>();
  @Output() onFilter = new EventEmitter<{ header: TableHeaderModel, event: any }>();
  @Output() onAction = new EventEmitter<TableActionCommand>();

  @Input() set emptyState(emptyState: EmptyState) {
    this._emptyState = emptyState;
    this._currentEmptyState = emptyState;
  }
  get emptyState(): EmptyState {
    return this._currentEmptyState;
  }
  private _emptyState: EmptyState;
  private _currentEmptyState: EmptyState;

  @Input() set paginator(paginator: PaginatorComponent) {
    this._paginator = paginator;
    this.initPaginator();
    this._subscriptions.push(
      this._paginator.nextPageClick.subscribe((page: number) => {
        ComponentService.resetScroll();
        this.paginator.currentPage = page;
        this.isFirstInfoOpen = true;
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
        this._currentEmptyState = DefaultEmptyState();
        this.resetPaginator();
        this._rows = this.searchService.filterRows(
          this.dataSource.rows, { text: text, columns: this.searchOptions }
        );
        //this.cdRef.markForCheck();
        //this.cdRef.detach();
        this._serachText = text;
        this.reloadPaginator();
      }));
  }
  get search(): AutoSearchComponent { return this._search; }
  private _search: AutoSearchComponent;

  resetSearch(): void {
    this._serachText = '';
    if (this._search) {
      this._search.text = '';
    }
  }

  @ViewChild('tableObject', { static: false }) tableObject: ElementRef;
  @Input() rowInfoTemplate: TemplateRef<any>;
  @Input() headersTemplate: Array<{ [key: string]: TemplateRef<any> }>;
  @Input() customFilters: Array<{ [key: string]: TemplateRef<any> }>;
  @Input() cellsTemplate: Array<{ [key: string]: TemplateRef<any> }>;
  @Input() editHeaderTemplate: TemplateRef<any>;
  @Input() isMultiSelect = false;
  @Input() tableID = 'mainTable';
  @Input() stayOnCurrentPage = false;
  @Input() editCellTemplate: any;
  @Input() auto = false;

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
  isAnimate = true;

  @Input() set dataSource(data: TableModel) {
    this.isFirstInfoOpen = true;
    if (!data) { return; }
    this.resetSearch();
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
    const cp = this.isPaginator ? this.paginator.currentPage : 0;
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
    if (this.isPaginator && this.stayOnCurrentPage) {
      this.paginator.setCurrentPage(cp + 1);
    }
    this.stayOnCurrentPage = false;
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
    this.isFirstInfoOpen = true;
    if (!this.isPaginator) { return; }
    this.paginator.currentPage = 0;
    this.paginator.currentBlock = 0;
  }

  sort(header: TableHeaderModel): void {
    const sorted = this.dataSource.headers.find(h => h.isSortedColumn && h !== header);
    if (sorted) { sorted.isSortedColumn = false; }
    this.sortModel = { ...header };
    this.resetPaginator();
    this.onSort.emit(header);
  }

  filter(event: { header: TableHeaderModel, event: any }): void {
    this.onFilter.emit(event);
  }

  private filterData(data: TableModel): TableModel {
    this.isFirstInfoOpen = true;
    if (!this.filters) { return { ...data }; }
    let rows = data.rows;
    const filters = {};
    Object.keys(this.filters).forEach(k => {
      if (this.filters[k].length) {
        filters[k] = this.filters[k];
      }
    });
    Object.keys(filters).forEach(k => {
      const filtered = filters[k].filter((cb: CheckBoxListOption) => cb.isChecked);
      if (!filtered.length) { rows = []; return; }
      if (filtered.length === filters[k].length) { return; }
      const dict = {};
      filtered.forEach((x: CheckBoxListOption) => { dict[x.text] = true });
      rows = rows.filter(row => {
        return dict[row.cells[k]];
      });
    });
    return { ...data, rows: rows };
  }

  onApplyFilter(header: TableHeaderComponent): void {
    this._currentEmptyState = DefaultEmptyState();
    this.resetSearch();
    this.filters[header.model.columnId] = header.filterOptions;
    this.dataSource = this._dataSourceOrigin;
  }

  cellClick(row: TableRowModel, rowIndex: number, index: number, showDetails: boolean, $event: any): void {
    if (!showDetails) { return; }
    if (index) { return; }
    this.resetActiveRow();
    this.showItemInfo(row, undefined, rowIndex, event);
    row.isActive = true;
    this.dataSource.activeRow = row;
  }

  rowClick(row: TableRowModel, rowIndex: number, event: any): void {
    if (this.isMultiSelect) {
      row.isActive = !!!row.isActive;
    }
    this.resetActiveRow();
    //this.showItemInfo(row, undefined, rowIndex, event);
    row.isActive = true;
    this.dataSource.activeRow = row;
  }

  resetActiveRow(): void {
    if (this.dataSource && this.dataSource.rows) {
      this.dataSource.rows.filter(r => r.isActive).forEach(r => r.isActive = false);
    }
  }

  currentRowInfo: TableRowModel;
  clientY = 0;
  rowDetails: RowInfoComponent = undefined;
  isFirstInfoOpen = true;
  stickyInfo2Table = true;

  closeRowInfo(): void {
    this.hideCurrentRowDetails(() => {
      this.currentRowInfo = undefined;
      this.rowDetails = undefined;
    });
  }

  rowDetailsInit(rowDetails: RowInfoComponent): void {
    if (this.isAnimate) {
      if (this.stickyInfo2Table) {
        rowDetails.setTop(ComponentService.getRect(this.tableObject.nativeElement.rows[0]).top, this.isFirstInfoOpen);
      } else if (this.clientY + rowDetails.height > window.innerHeight) {
        rowDetails.setMargin(window.innerHeight - this.clientY - rowDetails.height, this.isFirstInfoOpen);
      } else {
        rowDetails.setMargin(0, this.isFirstInfoOpen);
      }
    } else {
      rowDetails.reInit(ComponentService.getRect(this.tableObject.nativeElement.rows[0]).top);
    }
    this.isFirstInfoOpen = false;
    this.rowDetails = rowDetails;
  }

  showItemInfo(row: TableRowModel | any, header: TableHeaderModel, rowIndex: number, event: any): void {
    if (this.currentRowInfo === row) {
      event.stopPropagation();
      return;
    }
    if (this.currentRowInfo) {
      event.stopPropagation();
      this.isAnimate = false;
      this.currentRowInfo = row;
      return;
    }
    this.isAnimate = true;
    ComponentService.documentClick();
    // this.rowClick(row);
    event.stopPropagation();
    this.clientY = event.clientY;
    this.hideCurrentRowDetails(() => {
      this.currentRowInfo = row;
    });
  }

  hideCurrentRowDetails(callback: any): void {
    if (!this.currentRowInfo) { callback(); return; }
    if (!this.rowDetails) { callback(); return; }
    this.rowDetails.hide();
    setTimeout(() => {
      callback();
    }, 500);
  }

  infoRowClick(event: any): void {
    event.stopPropagation();
  }

  onShowFilter(): void {
    this.closeRowInfo();
  }

  get specColums(): number {
    return this.dataSource && this.dataSource.actions ? 1 : 0;
  }

  commandRow: TableRowModel;

  openLinkMenu(row: TableRowModel, event: any, rowIndex: number): void {
    ComponentService.documentClick();
    this.clientY = event.clientY;
    event.stopPropagation();
    //this.rowClick(row);
    this.commandRow = row;
    this.animationService.showElement(this.commandRow);
  }

  onActionCommand(cmd: string): void {
    this.onAction.emit({ command: cmd, item: this.commandRow });
    setTimeout(() => {
      this.commandRow = undefined;
    }, 10);
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    this.closeRowInfo();
    this.commandRow = undefined;
    this.resetActiveRow();
  }

  initActionsLinks(menu: ModalMenuComponent): void {
    const elm = document.getElementById(menu.componentID);
    if (this.clientY + elm.offsetHeight > window.innerHeight) {
      this.renderer2.setStyle(elm, 'marginTop', `${window.innerHeight - this.clientY - elm.offsetHeight - 50}px`);
    } else {
      this.renderer2.setStyle(elm, 'marginTop', '0px');
    }
  }

  currentOver: TableRowModel = undefined;

  rowMouseOver(event: any, row: TableRowModel, index: number): void {
    this.currentOver = row;
  }

  rowMouseLeave(event: any, row: TableRowModel, index: number): void {
    this.currentOver = undefined;
  }
}
