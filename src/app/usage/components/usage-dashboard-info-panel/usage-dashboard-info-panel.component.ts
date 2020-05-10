import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectOption, DateService, BaseSibscriber } from '@app/core-api';
import { UsageRequestService } from '@app/usage/services/usage-request.service';

@Component({
  selector: 'md-usage-dashboard-info-panel',
  templateUrl: './usage-dashboard-info-panel.component.html',
  styleUrls: ['./usage-dashboard-info-panel.component.scss']
})
export class UsageDashboardInfoPanelComponent extends BaseSibscriber implements OnInit {

  @Input() includeAdmin = false;
  @Output() onChange = new EventEmitter<any>();
  @Input() showYears = true;
  @Input() showUsers = true;

  currentDateRange = this.dateService.getFromMonth2Current(13);
  currentDateIndex = 0;

  yearsOptions: Array<SelectOption> = [
    { id: 0, text: 'Last 13 Months', value: this.dateService.getFromMonth2Current(13) },
    { id: 1, text: `${this.dateService.getYear(-1)}`, value: this.dateService.getFromYear(0) },
    { id: 2, text: `${this.dateService.getYear(-2)}`, value: this.dateService.getFromYear(1) },
    { id: 3, text: `${this.dateService.getYear(-3)}`, value: this.dateService.getFromYear(2) }
  ];

  currentEnvitonment = '';
  selectedEnvironment: SelectOption;
  environmens: Array<SelectOption>;

  constructor(
    private dateService: DateService,
    public usageRequestService: UsageRequestService
  ) {
    super();
  }

  private emit(): void {
    this.onChange.emit(undefined);
  }

  changeYear(option: SelectOption): void {
    this.currentDateIndex = option.id as number;
    this.currentDateRange = option.value;
    this.usageRequestService.usageRequest.fromDate = this.dateService.formatDate(this.currentDateRange.fromDate);
    this.usageRequestService.usageRequest.toDate = this.dateService.formatDate(this.currentDateRange.toDate);
    this.emit();
    this.usageRequestService.emit();
  }

  changeEnvironment(option: SelectOption): void {
    this.currentEnvitonment = (option.id as string);
    this.usageRequestService.usageRequest.environmet = this.currentEnvitonment;
    this.emit();
    this.usageRequestService.emit();
  }

  changeIncludeAdmin(includeAdmin: boolean): void {
    // this.usageRequestService.usageRequest.includeAdmin = includeAdmin;
    // this.emit();
    // this.usageRequestService.emit();
    this.usageRequestService.includeAdmin(includeAdmin);
  }

  private loadEnvironments(): void {
    this.environmens = [{ id: '0', text: 'All Environment', value: '0' }].concat(this.usageRequestService.environments);
    this.selectedEnvironment = this.environmens.find(x => x.value === this.currentEnvitonment);
    if (!this.selectedEnvironment) {
      this.selectedEnvironment = this.environmens.length ? this.environmens[0] : undefined;
    }
  }

  ngOnInit(): void {
    this.usageRequestService.reset();
    this.loadEnvironments();
  }

  applyUsers(users: Array<any>): void {
    this.usageRequestService.usageRequest.users = users;
    this.emit();
    this.usageRequestService.emit();
  }
}
