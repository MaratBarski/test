import { Component } from '@angular/core';
import { NavigationService, PageInfo, BaseSibscriber, TabItemModel } from '@app/core-api';
import { UsageService, UsageReportParams, UsageReportState, GetDefaultState } from '@app/usage/services/usage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoPanel } from '@app/usage/components/usage-dashboard-info-panel/usage-dashboard-info-panel.component';

@Component({
  selector: 'md-usage-dashboard',
  templateUrl: './usage-dashboard.component.html',
  styleUrls: ['./usage-dashboard.component.scss']
})
export class UsageDashboardComponent extends BaseSibscriber {

  // activityButtons: Array<TabItemModel> = [
  //   { title: 'Month', source: 1 },
  //   { title: '3 Months', source: 3 },
  //   { title: '6 Months', source: 6 }
  // ];
  // currentActivity = 0;
  // currentTab = 0;
  // currentSubTab = -1;
  // usageReportParams: UsageReportParams;
  // data: any;
  // private _state: UsageReportState;

  // get state(): UsageReportState {
  //   return this._state;
  // }

  // constructor(
  //   private usageService: UsageService,
  //   private navigationService: NavigationService,
  //   private activatedRoute: ActivatedRoute,
  //   private router: Router
  // ) {
  //   super();
  //   this.navigationService.currentPageID = PageInfo.JobsScheduling.id;
  //   super.add(
  //     this.activatedRoute.paramMap.subscribe(params => {
  //       try {
  //         this._state = params.get('state') ? JSON.parse(decodeURIComponent(params.get('state'))) : GetDefaultState();
  //         this.usageService.setState(this._state);
  //       }
  //       catch (e) {
  //         window.location.href = '/usage-dashboard';
  //       }
  //       this.init();
  //     })
  //   )
  // }

  // selectTab(event: { tab: number, subTab: number }): void {
  //   this.currentTab = event.tab;
  //   this.currentSubTab = event.subTab;
  //   this.state.tab = event.tab;
  //   this.state.subTab = event.subTab;
  //   this.reload();
  // }

  // changeCurrentAcitity(i: number): void {
  //   this.currentActivity = i;
  //   this.state.activity = i;
  //   this.reload();
  // }

  // onChangeInfoPanel(infoPanel: InfoPanel): void {
  //   this.state.yearId = infoPanel.currentYear;
  //   this.state.includeAdmin = infoPanel.includeAdmin;
  //   this.state.environment = infoPanel.environment;
  //   this.reload();
  // }

  // private reload(): void {
  //   this.router.navigate(['/usage-dashboard', { state: encodeURIComponent(JSON.stringify(this.state)) }]);
  //   this.createView();
  // }

  // private initPage(): void {
  //   this.currentActivity = this.state.activity;
  //   this.currentTab = this.state.tab;
  //   this.currentSubTab = this.state.subTab;
  // }

  // init(): void {
  //   this.initPage();
  //   this.setPeriod();
  //   this.createReport();
  // }

  // setPeriod(): void {
  //   let date = new Date();
  //   date.setMonth(date.getMonth() - this.activityButtons[this.currentActivity].source);
  //   this.usageReportParams = {
  //     fromDate: date,
  //     toDate: new Date
  //   }
  // }

  // createReport(): void {
  //   super.add(
  //     this.usageService.getUsageReport(this.usageReportParams).subscribe(res => {
  //       this.data = res;
  //     }));
  // }

  // private createView(): void {

  // }
}
