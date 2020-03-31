import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'md-usage-report',
  templateUrl: './usage-report.component.html',
  styleUrls: ['./usage-report.component.scss']
})
export class UsageReportComponent implements OnInit {

  @Input() pageTitle = 'Monthly General Usage';
  @Input() pageTooltip = 'Each bar represents the monthly number of users who created at least one new query or downloaded a file.';
  
  constructor() { }

  ngOnInit() {
  }

}
