import { Component, OnInit } from '@angular/core';
import { PermissionSetService } from '@app/users/services/permission-set.service';

@Component({
  selector: 'md-permission-wizard',
  templateUrl: './permission-wizard.component.html',
  styleUrls: ['./permission-wizard.component.scss']
})
export class PermissionWizardComponent implements OnInit {

  constructor(
    public permissionSetService: PermissionSetService
  ) { }

  selectedTab = 0;

  setTab(i: number): void {
    this.selectedTab = i;
  }

  ngOnInit() {
  }

}

