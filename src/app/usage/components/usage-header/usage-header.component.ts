import { Component, Input } from '@angular/core';

@Component({
  selector: 'md-usage-header',
  templateUrl: './usage-header.component.html',
  styleUrls: ['./usage-header.component.scss']
})
export class UsageHeaderComponent {

  @Input() headerTitle = 'Usage Dashboard';

}
