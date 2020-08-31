import { Component, OnInit, Input } from '@angular/core';
import { PermissionSetService } from '@app/users/services/permission-set.service';

@Component({
  selector: 'md-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() pageTitle = 'Add permission set';
  @Input() showLegend = true;
  @Input() showTitle = true;

  constructor(
    public permissionSetService: PermissionSetService
  ) { }

  ngOnInit() {
  }

}
