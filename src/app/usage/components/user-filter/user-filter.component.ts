import { Component, Output, EventEmitter, OnDestroy, OnInit, HostListener, Input, ChangeDetectionStrategy } from '@angular/core';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { ComponentService } from '@app/core-api';

@Component({
  selector: 'md-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFilterComponent implements OnDestroy, OnInit {

  topChecked = true;
  searchText = '';
  isExpanded = false;
  topCheckApply = true;
  searchWord = '';
  users: Array<any>;

  @Output() onApply = new EventEmitter<Array<any>>();
  @Input() minSelected = 1;
  @Input() maxSelected = 7;

  selectedCount = 0;

  // get selectedCount(): number {
  //   if (!this.users) { return 0; }
  //   return this.users.filter(x => x.isChecked).length;
  // }

  constructor(
    public usageRequestService: UsageRequestService
  ) {
    this.users = JSON.parse(JSON.stringify(usageRequestService.users));
    this.changeTop(true);
    this.updateSelectedCount();
  }

  private updateSelectedCount(): void {
    this.selectedCount = this.users.filter(x => x.isChecked).length
  }

  ngOnInit(): void {
    this.usageRequestService.usageRequest.users = this.users.filter(x => x.isChecked).map(x => x.id);
  }

  ngOnDestroy(): void {
    this.usageRequestService.usageRequest.users = undefined;
  }

  changeTop(flag: boolean): void {
    this.users.forEach((user: any, index: number) => {
      if (index >= 5) { return; }
      user.isChecked = flag
    });
    this.updateSelectedCount();
  }

  changeSelect(isChecked: boolean): void {
    this.updateSelectedCount();
  }

  clear(): void {
    this.topChecked = false;
    this.users.forEach((user: any, index: number) => {
      user.isChecked = false;
    });
    this.updateSelectedCount();
  }

  clearSearch(): void {
    this.searchText = '';
    this.searchWord = '';
  }

  apply(): void {
    this.topCheckApply = this.topChecked;
    this.isExpanded = false;
    this.onApply.emit(this.users.filter(x => x.isChecked).map(x => x.id));
  }

  cancel(): void {
    this.topChecked = this.topCheckApply;
    this.clearSearch();
    this.isExpanded = false;
  }

  searchKey(event: any): void {
    this.searchWord = this.searchText;
    // if (!event) {
    //   this.searchWord = this.searchText;
    //   return;
    // }
    // if (event.keyCode === 13) {
    //   this.searchWord = this.searchText;
    //   return;
    // }
    // if (this.searchText.length > 1) {
    //   this.searchWord = this.searchText;
    // }
  }

  expand(event: any): void {
    if (this.isExpanded) {
      this.isExpanded = false;
      return;
    }
    ComponentService.documentClick();
    event.stopPropagation();
    this.isExpanded = true;
  }

  filterContainerClick(event: any): void {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    this.isExpanded = false;
  }
}
