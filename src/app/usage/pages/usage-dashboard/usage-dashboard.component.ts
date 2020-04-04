import { Component, OnInit } from '@angular/core';
import { DateService, TranslateService, NavigationService, PageInfo, BaseSibscriber, TabItemModel } from '@app/core-api';
import { UsageService, UsageReportParams } from '@app/usage/services/usage.service';
import { ActivatedRoute, Router } from '@angular/router';

interface UsageReportState {
  tab: number;
  subTab: number;
  activity: number;
}
const GetDefaultState = (): UsageReportState => {
  return {
    tab: 0,
    subTab: -1,
    activity: 0
  }
}

@Component({
  selector: 'md-usage-dashboard',
  templateUrl: './usage-dashboard.component.html',
  styleUrls: ['./usage-dashboard.component.scss']
})
export class UsageDashboardComponent extends BaseSibscriber implements OnInit {

  activityButtons: Array<TabItemModel> = [
    { title: 'Month', source: 1 },
    { title: '3 Months', source: 3 },
    { title: '6 Months', source: 6 }
  ];
  currentActivity = 0;
  currentTab = 0;
  currentSubTab = -1;
  usageReportParams: UsageReportParams;
  data: any;
  _state: UsageReportState;

  get state(): UsageReportState {
    try {
      if (!this._state) {
        this._state = this.activatedRoute.snapshot.paramMap.get('state') ? JSON.parse(decodeURIComponent(this.activatedRoute.snapshot.paramMap.get('state'))) : GetDefaultState()
      }
    } catch (e) {
      window.location.href = '/usage-dashboard';
    }
    return this._state;
  }

  constructor(
    private usageService: UsageService,
    private navigationService: NavigationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.JobsScheduling.id;
  }

  selectTab(event: { tab: number, subTab: number }): void {
    this.currentTab = event.tab;
    this.currentSubTab = event.subTab;
    this.state.tab = event.tab;
    this.state.subTab = event.subTab;
    this.reload();
  }

  changeCurrentAcitity(i: number): void {
    this.currentActivity = i;
    this.state.activity = i;
    this.reload();
  }

  private reload(): void {
    this.router.navigate(['/usage-dashboard', { state: encodeURIComponent(JSON.stringify(this.state)) }]);
    this.createView();
  }

  private initPage(): void {
    this.currentActivity = this.state.activity;
    this.currentTab = this.state.tab;
    this.currentSubTab = this.state.subTab;
  }

  ngOnInit(): void {
    this.initPage();
    this.setPeriod();
    this.createReport();
  }

  setPeriod(): void {
    let date = new Date();
    date.setMonth(date.getMonth() - this.activityButtons[this.currentActivity].source);
    this.usageReportParams = {
      fromDate: date,
      toDate: new Date
    }
  }

  createReport(): void {
    super.add(
      this.usageService.getUsageReport(this.usageReportParams).subscribe(res => {
        this.data = res;
      }));
  }

  private createView(): void {

  }
}
