import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectOption, DateService, BaseSibscriber } from '@appcore';
import { UsageRequestService, UsageQueryParams } from '@app/usage/services/usage-request.service';


@Component({
  selector: 'md-usage-dashboard-info-panel',
  templateUrl: './usage-dashboard-info-panel.component.html',
  styleUrls: ['./usage-dashboard-info-panel.component.scss']
})
export class UsageDashboardInfoPanelComponent extends BaseSibscriber implements OnInit {

  @Input() includeAdmin = false;
  @Output() onChange = new EventEmitter<any>();
  @Output() onInitUsers = new EventEmitter();
  @Input() showYears = true;
  @Input() showUsers = true;
  @Input() hideUsers = false;

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

  private queryParams: UsageQueryParams;

  constructor(
    private dateService: DateService,
    public usageRequestService: UsageRequestService
  ) {
    super();
    super.add(
      this.usageRequestService.onParams.subscribe(p => {
        this.queryParams = p;
        this.updateParams();
      }));
  }

  private emit(): void {
    this.onChange.emit(undefined);
  }

  changeYear(option: SelectOption): void {
    this.currentDateIndex = option.id as number;
    this.currentDateRange = option.value;
    this.usageRequestService.usageRequest.fromDate = this.dateService.formatDateUS(this.currentDateRange.fromDate);
    this.usageRequestService.usageRequest.toDate = this.dateService.formatDateUS(this.currentDateRange.toDate);
    this.usageRequestService.currentDateIndex = this.currentDateIndex;
    this.emit();
    this.usageRequestService.emit();
  }

  changeEnvironment(option: SelectOption): void {
    this.currentEnvitonment = (option.id as string);
    this.usageRequestService.usageRequest.environment = this.currentEnvitonment;
    this.emit();
    this.usageRequestService.emit();
  }

  changeIncludeAdmin(includeAdmin: boolean): void {
    //this.usageRequestService.usageRequest.includeAdmin = includeAdmin;
    // this.emit();
    // this.usageRequestService.emit();
    this.usageRequestService.includeAdmin(includeAdmin);
  }

  private loadEnvironments(): void {
    this.environmens = [{ id: '0', text: 'All Environment', value: '0' }]
      .concat(this.usageRequestService.adminEnvironments);
    this.selectedEnvironment = this.environmens.find(x => x.value === this.currentEnvitonment);
    if (!this.selectedEnvironment) {
      this.selectedEnvironment = this.environmens.length ? this.environmens[0] : undefined;
    }
    this.updateParams();
  }

  ngOnInit(): void {
    this.usageRequestService.reset();
    this.loadEnvironments();
  }

  applyUsers(users: Array<any>): void {
    this.usageRequestService.usageRequest.users = users;
    this.usageRequestService.userSelectChanged();
    //this.emit();
    //this.usageRequestService.emit();
  }

  initUsers($event): void {
    this.onInitUsers.emit();
  }

  private updateParams(): void {
    if (!this.queryParams) { return; }
    if (this.queryParams.environment && this.environmens) {
      const env = this.environmens.find(x => x.id == this.queryParams.environment);
      if (env) {
        this.changeEnvironment({ id: env.id, text: '' });
        this.selectedEnvironment = env;
      }
    }
    if (this.yearsOptions) {
      let currentDateIndex = parseInt(this.queryParams.years);
      let option = this.yearsOptions.find(x => x.id === currentDateIndex);
      if (option) {
        this.changeYear(option);
      }
    }
    this.includeAdmin = this.queryParams.includeAdmin === 'true';
    this.usageRequestService.usageRequest.includeAdmin = this.includeAdmin;
  }
}
