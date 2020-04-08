import { Component, OnInit } from '@angular/core';
import { InfoPanel } from '@app/usage/components/usage-dashboard-info-panel/usage-dashboard-info-panel.component';
import { ActivatedRoute } from '@angular/router';
import { BaseSibscriber } from '@app/core-api';

@Component({
  selector: 'md-usage-main',
  templateUrl: './usage-main.component.html',
  styleUrls: ['./usage-main.component.scss']
})
export class UsageMainComponent extends BaseSibscriber implements OnInit {
  
  currentPage: string;
  infoPanel: InfoPanel;

  constructor(
    private activeRouter: ActivatedRoute
  ) {
    super();
    super.add(
      this.activeRouter.url.subscribe(u => {
        this.currentPage = u.toString();
      }));
  }

  ngOnInit() {
  }

  onChangeInfoPanel(infoPanel: InfoPanel): void {
    this.infoPanel = infoPanel;
  }

}
