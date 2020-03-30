import { Component, OnInit } from '@angular/core';
import { DateService, TranslateService, NavigationService, PageInfo, BaseSibscriber, TabItemModel } from '@app/core-api';

@Component({
  selector: 'md-usage-dashboard',
  templateUrl: './usage-dashboard.component.html',
  styleUrls: ['./usage-dashboard.component.scss']
})
export class UsageDashboardComponent extends BaseSibscriber implements OnInit {

  activityButtons: Array<TabItemModel> = [{ title: 'Month' }, { title: '3 Months' }, { title: '6 Months' }];
  currentActivity = 0;

  constructor(
    private translateService: TranslateService,
    private dateService: DateService,
    private navigationService: NavigationService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.JobsScheduling.id;
  }

  changeCurrentAcitity(i: number): void {
    this.currentActivity = i;
  }

  ngOnInit() {
  }

}
