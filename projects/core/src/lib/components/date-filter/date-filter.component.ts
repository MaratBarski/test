import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { TabItemModel } from '../tabs/tabs.component';
import { DateService, DateRange } from '../../services/date.service';
import { FromTo } from '../date-range-selector/date-range-selector.component';
import { ComponentService } from '@app/core-api';

export interface DateRangeButton {
  range?: DateRange;
  custom?: boolean;
  text: string;
}
@Component({
  selector: 'mdc-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateFilterComponent {

  @ViewChild('dateRangeSelector', { static: true }) dateRangeSelector: ElementRef;

  constructor(private dateService: DateService) { }

  @Output() onFilter = new EventEmitter<Array<any>>();
  @Input() enableCustom = false;
  @Input() tabid = 'dateRangeFilter';
  @Input() tabActive = 0;
  @Input() dateField = 'insertDate';
  @Input() set dataSource(dataSource: Array<any>) {
    this._dataSource = dataSource;
    this.filterData();
  }
  get dataSource(): Array<any> { return this._dataSource; }
  private _dataSource: Array<any>;
  @Input() set items(items: Array<DateRangeButton>) {
    this._items = items;
    this.tabs = this._items.map((item, i) => {
      if (item.custom) {
        this.customIndex = i;
        return {
          title: item.text, isDropDown: true,
          click: (index: number, tab: TabItemModel, event: any, target: any) => {
            ComponentService.documentClick(event);
            this.showCustom = true;
          }
        }
      }
      return { title: item.text };
    });
  }

  customIndex = -1;
  showCustom: boolean = false;

  get items(): Array<DateRangeButton> { return this._items; }
  private _items: Array<DateRangeButton>;

  tabs: Array<TabItemModel>;

  selectTab(index: number): void {
    this.cancelCustomDate();
    this.tabActive = index;
    this.filterData();
  }

  filterData(): void {
    if (!this.items || this.items.length <= this.tabActive) { return; }
    if (!this.dataSource) { return; }
    if (!this.dateField) { return; }
    const res = this.dateService.getData(this.dataSource, this.items[this.tabActive].range, this.dateField);
    this.onFilter.emit(res);
  }

  customTo = new Date();
  customFrom = new Date();

  cancelCustomDate(): void {
    this.showCustom = false;
  }

  applyCustomDate(range: FromTo): void {
    this.tabActive = this.customIndex
    this.showCustom = false;
    this.customFrom = range.from;
    this.customTo = range.to;
    this.items[this.tabActive].range = {
      fromDate: this.customFrom,
      toDate: this.customTo
    };
    this.filterData();
  }

  dateRangeClick(event: any): void {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    this.cancelCustomDate();
  }
}
