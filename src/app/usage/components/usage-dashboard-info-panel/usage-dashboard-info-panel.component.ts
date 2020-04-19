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

  currentYear = 0;

  yearsOptions: Array<SelectOption> = [
    { id: 0, text: 'YTD (Year To Date)', value: this.dateService.getYear(0) },
    { id: 1, text: `${this.dateService.getYear(-1)}`, value: this.dateService.getYear(-1) },
    { id: 2, text: `${this.dateService.getYear(-2)}`, value: this.dateService.getYear(-2) },
    { id: 3, text: `${this.dateService.getYear(-3)}`, value: this.dateService.getYear(-3) }
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
    this.currentYear = (option.id as number);
    this.usageRequestService.usageRequest.fromDate =
      this.dateService.formatDate(this.dateService.fromYear(this.currentYear));
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
    this.usageRequestService.usageRequest.includeAdmin = includeAdmin;
    this.emit();
    this.usageRequestService.emit();
  }

  private loadEnvironments(): void {
    this.environmens = [{ id: '', text: 'All Environment', value: '' }].concat(
      this.usageRequestService.environments.map((en, index) => {
        return { id: en.id, text: en.name, value: en.id };
      }));
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
