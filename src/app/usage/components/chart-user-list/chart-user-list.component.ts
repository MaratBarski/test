import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'md-chart-user-list',
  templateUrl: './chart-user-list.component.html',
  styleUrls: ['./chart-user-list.component.scss']
})
export class ChartUserListComponent {
  @Input() users: { name: string; value: string; }
}
