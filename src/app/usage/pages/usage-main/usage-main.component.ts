import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseSibscriber, PageInfo, NavigationService } from '@app/core-api';
import { UsageReportParams } from '@app/usage/models/usage-request';
import { UsageRequestService } from '@app/usage/services/usage-request.service';

@Component({
  selector: 'md-usage-main',
  templateUrl: './usage-main.component.html',
  styleUrls: ['./usage-main.component.scss']
})
export class UsageMainComponent extends BaseSibscriber implements OnInit {

  currentPage: string;
  infoPanel: UsageReportParams;

  constructor(
    public usageRequestService: UsageRequestService,
    private activeRouter: ActivatedRoute,
    private navigationService: NavigationService
  ) {
    super();
    this.navigationService.currentPageID = PageInfo.JobsScheduling.id;
    super.add(
      this.activeRouter.url.subscribe(u => {
        this.currentPage = u.toString();
      }));
  }

  ngOnInit() {
  }

  onChangeInfoPanel(event: any): void {
  }

}
