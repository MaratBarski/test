import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'mdc-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent {

  constructor(private paginationService: PaginationService) { }

  @Input() showOptions = false;
  @Input() isShowAllEnabled = false;
  @Input() paginationTitle = '';
  @Input() noPagingTitle = '';
  @Input() showAllText = 'Show all';
  @Input() currentPage = 0;
  @Input() showPageSelector = false;

  @Input() set pageSize(pageSize: number) {
    this._pageSize = pageSize;
    this.optionsForm.controls.pageSize.setValue(this._pageSize);
  }
  get pageSize(): number { return this._pageSize; }
  private _pageSize = 10;

  @Input() set blockSize(blockSize: number) {
    this._blockSize = blockSize;
    this.optionsForm.controls.blockSize.setValue(this._blockSize);
  }
  get blockSize(): number { return this._blockSize; }
  private _blockSize = 10;

  @Input() set list(list: number) {
    this._list = list;
    this._pages = null;
  }

  @Output() nextPageClick = new EventEmitter<number>();
  currentBlock = 0;

  selectedPage = new FormControl('', [
    Validators.required,
    Validators.min(1)
  ]);

  get list(): number { return this._list; }
  get displayTitle(): string { return `${this.firstBlockRow}-${this.displayRows}`; }
  private _pages: Array<number>;
  private _list: number;

  get pages(): Array<number> {
    if (!this._pages) {
      this.init();
    }
    return this._pages;
  }

  reload(list: number): void {
    this._list = list;
    this.init();
  }

  private init(): void {
    this.currentPage = 0;
    this.currentBlock = 0;
    this._pages = [];
    let count = this._list / this.pageSize;
    if (count * this.pageSize < this._list) {
      count++;
    }
    for (let i = 0; i < count; i++) {
      this._pages.push(i + 1);
    }
  }

  get pageCount(): number { return this.pages.length; }

  get blockCount(): number {
    let count = this.pageCount / this.blockSize;
    if (count - Math.round(count) > 0) { count++; }
    return Math.round(count);
  }

  get isFirstPage(): boolean { return this.currentPage === 0; }
  get isLastPage(): boolean { return this.currentPage === this.pageCount - 1; }

  get isFirstBlock(): boolean { return this.currentBlock === 0; }
  get isLastBlock(): boolean { return this.currentBlock === this.blockCount - 1; }

  get displayRows(): number { return Math.min(this.lastBlockRow, this._list); }

  get firstBlockRow(): number { return this.currentPage * this.pageSize + 1; }
  get lastBlockRow(): number { return this.firstBlockRow + this.pageSize - 1; }

  get firstBlockPage(): number {
    if (this.currentBlock < this.blockCount - 1) { return this.currentBlock * this.blockSize;; }
    const pages = this.paginationService.paginate(
      this.pages,
      { currentPage: this.currentBlock, pageSize: this.blockSize, complite: true }
    )
    return pages.length ? Math.max(0, pages[0] - 1) : 0;
  }

  get lastBlockPage(): number { return this.firstBlockPage + this.blockSize - 1; }

  get isFirstBlockPage(): boolean { return this.currentPage === this.firstBlockPage; }
  get isLastBlockPage(): boolean { return this.currentPage === this.lastBlockPage; }

  get totalBlocks(): number {
    const i = this.pages.length % this.blockSize > 0 ? 1 : 0;
    return parseInt((this.pages.length / this.blockSize).toString()) + i;
  }

  setPage(p: number): void {
    if (this.currentPage === p - 1) { return; }
    this.currentPage = p - 1;
    this.nextPageClick.emit(this.currentPage);
  }

  nextPage(index: number): void {
    if (this.isFirstPage && index < 0) { return; }
    if (this.isLastPage && index > 0) { return; }
    if (index > 0 && this.currentBlock < this.totalBlocks && this.isLastBlockPage) {
      this.currentBlock++;
    }
    if (index < 0 && this.currentBlock > 0 && this.isFirstBlockPage) {
      this.currentBlock--;
    }
    this.currentPage += index
    this.nextPageClick.emit(this.currentPage);
  }

  nextBlock(index: number): void {
    if (index > 0 && this.isLastBlock) { return; }
    if (index < 0 && this.isFirstBlock) { return; }
    this.currentBlock += index;
    this.setPage(this.currentBlock * this.blockSize + 1);
  }

  firstPage(): void {
    this.currentBlock = 0;
    this.setPage(1);
  }

  lastPage(): void {
    this.setPage(this.pages.length);
    this.currentBlock = this.totalBlocks - 1;
  }

  getBlockIndex(page: number): number {
    let index = page / this.blockSize;
    if (index - Math.round(index) > 0) {
      return Math.round(index);
    }
    return Math.round(index) - 1;
  }

  selectedPageKeyUp(event: any): void {
    if (event.keyCode === 13) {
      this.goToPage();
    }
  }

  goToPage(): void {
    if (this.selectedPage.invalid) {
      this.selectedPage.setValue(1);
    }
    if (this.pageCount < this.selectedPage.value) {
      this.selectedPage.setValue(this.pageCount);
    }
    this.currentBlock = this.getBlockIndex(this.selectedPage.value);
    this.setPage(parseInt(this.selectedPage.value));
  }

  showAll(): void {
    this.currentPage = 0;
    this.currentBlock = 0;
    this.pageSize = this._list;
    this.reload(this._list);
  }

  optionsForm = new FormGroup({
    pageSize: new FormControl('', [
      Validators.min(1),
      Validators.max(100),
      Validators.required
    ]),
    blockSize: new FormControl('', [
      Validators.min(1),
      Validators.max(100),
      Validators.required
    ])
  });

  applyOptions(): void {
    if (!this.optionsForm.valid) { return; }
    this.currentPage = 0;
    this.currentBlock = 0;
    this._pageSize = this.optionsForm.controls.pageSize.value;
    this._blockSize = this.optionsForm.controls.blockSize.value;
    this.reload(this._list);
  }
}
