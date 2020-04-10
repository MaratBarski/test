import { Component, OnInit, Output } from '@angular/core';
import { UsageRequestService } from '@app/usage/services/usage-request.service';

@Component({
  selector: 'md-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss']
})
export class UserFilterComponent implements OnInit {

  constructor(
    public usageRequestService: UsageRequestService
  ) { }

  ngOnInit() {
  }


}
