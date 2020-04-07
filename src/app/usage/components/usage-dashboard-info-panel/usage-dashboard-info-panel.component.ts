import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectOption, DateService, BaseSibscriber } from '@app/core-api';
import { UsageService, UsageReportState } from '@app/usage/services/usage.service';

export interface InfoPanel {
  currentYear: number;
  includeAdmin: boolean;
  environment: string;
}
@Component({
  selector: 'md-usage-dashboard-info-panel',
  templateUrl: './usage-dashboard-info-panel.component.html',
  styleUrls: ['./usage-dashboard-info-panel.component.scss']
})
export class UsageDashboardInfoPanelComponent extends BaseSibscriber implements OnInit {

  @Input() includeAdmin = false;
  @Output() onChange = new EventEmitter<InfoPanel>()

  currentYear = 0;
  yearsOptions: Array<SelectOption> = [
    { id: 0, text: 'YTD (Year To Date)', value: this.dateService.getYear(0) },
    { id: 1, text: `${this.dateService.getYear(-1)}`, value: this.dateService.getYear(-1) },
    { id: 2, text: `${this.dateService.getYear(-2)}`, value: this.dateService.getYear(-2) },
    { id: 3, text: `${this.dateService.getYear(-3)}`, value: this.dateService.getYear(-3) }
  ];

  currentEnvitonment = '';
  environmens: Array<SelectOption> = [
    { id: '', text: 'YTD (Year To Date)', value: this.dateService.getYear(0) },
    { id: '1', text: `${this.dateService.getYear(-1)}`, value: this.dateService.getYear(-1) },
    { id: '2', text: `${this.dateService.getYear(-2)}`, value: this.dateService.getYear(-2) },
    { id: '3', text: `${this.dateService.getYear(-3)}`, value: this.dateService.getYear(-3) }
  ];

  constructor(private dateService: DateService, private usageService: UsageService) {
    super();
    super.add(
      this.usageService.onStateChanged.subscribe((state: UsageReportState) => {
        this.currentYear = state.yearId || 0;
        this.includeAdmin = state.includeAdmin || false;
        this.currentEnvitonment = state.environment;
      }));
  }

  private emit(): void {
    this.onChange.emit({
      currentYear: this.currentYear,
      includeAdmin: this.includeAdmin,
      environment: this.currentEnvitonment
    })
  }

  changeYear(option: SelectOption): void {
    this.currentYear = (option.id as number);
    this.emit();
  }

  changeEnvironment(option: SelectOption): void {
    this.currentEnvitonment = (option.id as string);
    this.emit();
  }

  changeIncludeAdmin(includeAdmin: boolean): void {
    this.emit();
  }


  ngOnInit() {

  }

}
