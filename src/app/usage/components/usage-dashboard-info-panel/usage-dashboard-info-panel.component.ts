import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'md-usage-dashboard-info-panel',
  templateUrl: './usage-dashboard-info-panel.component.html',
  styleUrls: ['./usage-dashboard-info-panel.component.scss']
})
export class UsageDashboardInfoPanelComponent implements OnInit {

  @Input() includeAdmin = false;

  constructor() { }

  ngOnInit() {
  }

}
