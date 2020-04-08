import { Component } from '@angular/core';
import { UsageLinks } from '@app/usage/services/usage.service';


@Component({
  selector: 'md-usage-dashboard-top',
  templateUrl: './usage-dashboard-top.component.html',
  styleUrls: ['./usage-dashboard-top.component.scss']
})
export class UsageDashboardTopComponent {
  links = UsageLinks;
}
