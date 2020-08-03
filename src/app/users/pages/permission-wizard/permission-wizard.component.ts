import { Component, OnInit } from '@angular/core';
import { PermissionSetService } from '@app/users/services/permission-set.service';
import { TabWizardItem } from '@app/users/components/tabs/tabs.component';

@Component({
  selector: 'md-permission-wizard',
  templateUrl: './permission-wizard.component.html',
  styleUrls: ['./permission-wizard.component.scss']
})
export class PermissionWizardComponent implements OnInit {

  constructor(
    public permissionSetService: PermissionSetService
  ) { }

  tabs: Array<TabWizardItem> = [
    {
      text: 'General Details'
    },
    {
      text: 'Allowed Events'
    },
    {
      text: 'Allowed Cohort',
      isOptional: true
    }
  ]

  ngOnInit() {
  }

  selectNextTab(index: number): void {
    if (!this.permissionSetService.validate(true)) {
      return;
    }
    this.permissionSetService.setTab(index);
  }

}

