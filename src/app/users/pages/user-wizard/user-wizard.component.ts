import { Component, OnInit } from '@angular/core';
import { UserEditService } from '@app/users/services/user-edit.service';
import { SplitBtnOption } from '@app/users/components/footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService, BaseNavigation, LoginService } from '@appcore';
import { TabWizardItem } from '@app/shared/components/tab-wizard/tab-wizard.component';

@Component({
  selector: 'md-user-wizard',
  templateUrl: './user-wizard.component.html',
  styleUrls: ['./user-wizard.component.scss']
})
export class UserWizardComponent extends BaseNavigation implements OnInit {

  constructor(
    public userEditService: UserEditService,
    private activatedRoute: ActivatedRoute,
    protected navigationService: NavigationService,
    private router: Router,
    public loginService: LoginService
  ) {
    super(navigationService);
  }

  get isLastTab(): boolean {
    return this.userEditService.selectedTab === 1;
  }

  get isSaveEnable(): boolean {
    return this.userEditService.selectedTab > 0;
  }

  get isNextEnable(): boolean {
    return this.userEditService.selectedTab < 1;
  }

  get pageTitle(): string {
    return this.userEditService.user.isNew ? 'CREATE NEW USER' : `EDIT USER OF ${this.userEditService.user.login}`
  }

  tabs: Array<TabWizardItem> = [
    {
      text: 'Account Details'
    },
    {
      text: 'Permission Set'
    }
  ]

  get showChangesConfirm(): boolean {
    return this.userEditService.showCancelConfirm;
  }

  ngOnInit() {
    this.navigationService.beforeNavigate = ((url: string) => {
      if (url) {
        this.userEditService.redirectUrl = url;
      }
      if (this.userEditService.isHasChanges()) {
        this.userEditService.showCancelConfirm = !!url;
        return true;
      }
      if (url) {
        this.router.navigateByUrl(url);
      }
    });
    super.add(
      this.activatedRoute.paramMap.subscribe(u => {
        const id = parseInt(u.get('uid') || '0');
        const mode = parseInt(u.get('mode') || '0');
        if (isNaN(mode)) {
          this.router.navigateByUrl('/users');
        }
        this.userEditService.resetService({ id: id, mode: mode });
        if (mode === 1) {
          this.tabs[1].isDisabled = true;
          this.userEditService.initTab(0);
          if (!this.loginService.isSuperAdmin) {
            this.router.navigateByUrl('/users');
          }
        } else if (mode === 2) {
          this.tabs[0].isDisabled = true;
          this.userEditService.initTab(1);
        } else if (mode) {
          this.router.navigateByUrl('/users');
        }
      }));
  }

  btnOptions: Array<SplitBtnOption> = [
    { text: 'Save' }
  ]

  selectNextTab(index: number): void {
    this.userEditService.setTab(index);
  }

  cancel(): void {
    this.userEditService.cancel();
  }

  next(i: number): void {
    this.userEditService.nextTab(i);
  }

  save(): void {
    this.userEditService.save();
  }

  optionClick(i: number): void {

  }


  cancelChanges(): void {
    this.userEditService.showCancelConfirm = false;
  }

  confirmChanges(): void {
    this.userEditService.cancelConfirm();
  }
}
