import { Component, OnInit } from '@angular/core';
import { DateService, TranslateService, NavigationService, PageInfo, BaseSibscriber } from '@app/core-api';

@Component({
  selector: 'md-usage-dashboard',
  templateUrl: './usage-dashboard.component.html',
  styleUrls: ['./usage-dashboard.component.scss']
})
export class UsageDashboardComponent extends BaseSibscriber implements OnInit {

  constructor(
    private translateService: TranslateService,
    private dateService: DateService,
    private navigationService: NavigationService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.JobsScheduling.id;
  }

  ngOnInit() {
  }

}
