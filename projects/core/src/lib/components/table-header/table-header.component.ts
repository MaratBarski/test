import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, HostListener, Renderer2, TemplateRef } from '@angular/core';
import { CheckBoxListOption } from '../check-box-list/check-box-list.component';
import { AnimationService } from '../../services/animation.service';
import { BaseSibscriber } from '../../common/BaseSibscriber';

export enum ColumnType {
  Text = 1,
  Number = 2,
  Date = 3,
  Bool = 4
}

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
  showDetails?: boolean;
  columnType?: ColumnType;
  css?: string;
  style?: { [key: string]: any };
  columnStyle?: { [key: string]: any };
}

@Component({
  selector: 'mdc-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css']
})
export class TableHeaderComponent extends BaseSibscriber {
  @Output() onShowFilter = new EventEmitter();
  constructor(private animationService: AnimationService, private renderer2: Renderer2) {
    super();
    super.add(
      this.animationService.onStart.subscribe(() => {
        this.onCloseFilter();
      }));
    super.add(
      this.animationService.onShowElement.subscribe((header: TableHeaderComponent) => {
        if (this !== header) {
          this.cancelFilter();
        }
      }));
  }

  @Input() isShowFilter = false;
  get filterVisibility(): string {
    return this.isShowFilter ? 'visible' : 'hidden';
  }

  @ViewChild('filterPopup', { static: false }) filterPopup: ElementRef;
  @Input() model: TableHeaderModel;
  @Input() customFilter: TemplateRef<any>;
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
    if (this.isShowFilter) {
      this.cancelFilter();
    }
  }

  isNoFiltered = true;

  applyFilter(): void {
    this._originOptions = JSON.parse(JSON.stringify(this._filterOptions));
    this.isShowFilter = false;
    this.onApplyFilter.emit(this);
    this.isNoFiltered = !this._originOptions.find(x => !x.isChecked);
  }

  cancelFilter(): void {
    if (this._originOptions) {
      this._filterOptions = JSON.parse(JSON.stringify(this._originOptions));
    }
    this.isShowFilter = false;
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
    if (this.isShowFilter) { return; }
    event.stopPropagation();
    this.onShowFilter.emit();
    this.animationService.showElement(this);
    const h = this.filterPopup.nativeElement.offsetHeight
    this.renderer2.setStyle(this.filterPopup.nativeElement, 'height', '0px')
    // this.animationService.animateForward(
    //   this.filterPopup.nativeElement, h, 'height', undefined, h / 10
    // )
    this.isShowFilter = true;
    this.onFilter.emit({ header: this.model, event: event });
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    this.cancelFilter();
  }

  stopEvent(event: any): void {
    event.stopPropagation();
  }
}
