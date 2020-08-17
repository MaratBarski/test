import { Component, OnInit } from '@angular/core';
import { PermissionSetService, NO_ALLOWED_EVENTS } from '@app/users/services/permission-set.service';
import { TabWizardItem } from '@app/users/components/tabs/tabs.component';
import { BaseSibscriber } from '@app/core-api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'md-permission-wizard',
  templateUrl: './permission-wizard.component.html',
  styleUrls: ['./permission-wizard.component.scss']
})
export class PermissionWizardComponent extends BaseSibscriber implements OnInit {

  showCancelConfirm = false;

  constructor(
    public permissionSetService: PermissionSetService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
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
  ];

  cancelSave(): void {
    this.showCancelConfirm = false;
  }

  confirmSave(): void {
    this.showCancelConfirm = false;
    this.permissionSetService.save();
  }

  ngOnInit(): void {
    super.add(
      this.activatedRoute.paramMap.subscribe(u => {
        const id = u.get('id') || 0;
        this.permissionSetService.resetService(id);
      }));
  }

  cancel(): void {
    this.permissionSetService.cancel();
  }

  next(i: number): void {
    this.permissionSetService.nextTab(i);
  }

  save(): void {
    if (this.permissionSetService.permissionSet.allowedEvent === NO_ALLOWED_EVENTS) {
      this.showCancelConfirm = true;
      return;
    }
    this.permissionSetService.save();
  }

  selectNextTab(index: number): void {
    if (!this.permissionSetService.validate(true)) {
      return;
    }
    this.permissionSetService.setTab(index);
  }

}

