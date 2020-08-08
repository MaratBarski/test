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

  get isSaveEnable(): boolean {
    return this.permissionSetService.selectedTab > 0;
  }

  get isNextEnable(): boolean {
    return this.permissionSetService.selectedTab < 1;
  }

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

  ngOnInit(): void {
    this.permissionSetService.resetService();
  }

  cancel(): void {
    this.permissionSetService.cancel();
  }

  next(i: number): void {
    this.permissionSetService.nextTab(i);
  }

  save(): void {
    this.permissionSetService.save();
  }

  selectNextTab(index: number): void {
    if (!this.permissionSetService.validate(true)) {
      return;
    }
    this.permissionSetService.setTab(index);
  }

}

