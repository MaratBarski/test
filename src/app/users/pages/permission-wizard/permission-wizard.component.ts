import { Component, OnInit } from '@angular/core';
import { PermissionSetService, NO_ALLOWED_EVENTS } from '@app/users/services/permission-set.service';
import { TabWizardItem } from '@app/users/components/tabs/tabs.component';
import { NavigationService, BaseNavigation } from '@appcore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'md-permission-wizard',
  templateUrl: './permission-wizard.component.html',
  styleUrls: ['./permission-wizard.component.scss']
})
export class PermissionWizardComponent extends BaseNavigation implements OnInit {

  showCancelConfirm = false;

  get showChangesConfirm(): boolean {
    return this.permissionSetService.showCancelConfirm;
  }

  constructor(
    public permissionSetService: PermissionSetService,
    private activatedRoute: ActivatedRoute,
    protected navigationService: NavigationService,
    private router: Router
  ) {
    super(navigationService);
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
    this.navigationService.beforeNavigate = ((url: string) => {
      if (url) {
        this.permissionSetService.redirectUrl = url;
      }
      if (this.permissionSetService.isHasChanges()) {
        this.permissionSetService.showCancelConfirm = !!url;
        return true;
      }
      if (url) {
        this.router.navigateByUrl(url);
      }
    });

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
    this.permissionSetService.isAfterValidate = true;
    if (this.permissionSetService.permissionSet.allowedEvent === NO_ALLOWED_EVENTS) {
      if (!this.permissionSetService.validate(true)) { return; }
      this.showCancelConfirm = true;
      return;
    }
    this.permissionSetService.save();
  }

  selectNextTab(index: number): void {
    if (!this.permissionSetService.validate(true)) {
      this.permissionSetService.isAfterValidate = true;
      return;
    }
    this.permissionSetService.setTab(index);
  }

  cancelChanges(): void {
    this.permissionSetService.showCancelConfirm = false;
  }

  confirmChanges(): void {
    this.permissionSetService.cancelConfirm();
  }
}

