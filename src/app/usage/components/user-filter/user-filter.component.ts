import { Component, Output, EventEmitter, OnDestroy, HostListener, Input, ChangeDetectionStrategy } from '@angular/core';
import { UsageRequestService } from '@app/usage/services/usage-request.service';
import { ComponentService, BaseSibscriber } from '@appcore';

@Component({
  selector: 'md-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class UserFilterComponent extends BaseSibscriber implements OnDestroy {

  topChecked = true;
  searchText = '';
  isExpanded = false;
  topCheckApply = true;
  searchWord = '';
  users: Array<any>;
  originUsers: Array<any>;

  @Output() onApply = new EventEmitter<Array<any>>();
  @Output() onInitUsers = new EventEmitter<void>();
  @Input() minSelected = 1;
  @Input() maxSelected = 10;

  private _prevState: { selected: Array<any>, top: boolean };

  selectedCount = 0;

  // get selectedCount(): number {
  //   if (!this.users) { return 0; }
  //   return this.users.filter(x => x.isChecked).length;
  // }

  constructor(
    public usageRequestService: UsageRequestService
  ) {
    super();
    super.add(
      this.usageRequestService.onUsersLoaded.subscribe(() => {
        this.originUsers = JSON.parse(JSON.stringify(this.usageRequestService.users));
        this.users = this.usageRequestService.users;
        this.changeTop(true);
        this.initState();
        this.updateSelectedCount();
        this.usageRequestService.usageRequest.users = this.users.filter(x => x.isChecked).map(x => x.id);
        this.onInitUsers.emit();
        this.usageRequestService.firstTimeSeleted();
      }));
  }

  private updateSelectedCount(): void {
    this.selectedCount = this.users.filter(x => x.isChecked).length
  }

  private initState(): void {
    this._prevState = {
      selected: this.users.filter(x => x.isChecked).map(x => x.id),
      top: this.topChecked
    }
  }

  private resetState(): void {
    this.topChecked = this._prevState.top;
    this.users.forEach(u => {
      u.isChecked = this._prevState.selected.find(id => u.id === id);
    });
    this.updateSelectedCount();
  }

  ngOnDestroy(): void {
    this.usageRequestService.usageRequest.users = undefined;
  }

  changeTop(flag: boolean): void {
    this.users.forEach((user: any, index: number) => {
      user.isChecked = index < 5 && flag;
    });
    this.updateSelectedCount();
  }

  changeSelect(isChecked: boolean): void {
    this.updateSelectedCount();
    this.topChecked = false;
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
    this.initState();
    this.onApply.emit(this._prevState.selected);
  }

  cancel(): void {
    this.topChecked = this.topCheckApply;
    this.clearSearch();
    this.isExpanded = false;
    this.resetState();
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
