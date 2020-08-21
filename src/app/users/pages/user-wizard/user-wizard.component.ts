import { Component, OnInit } from '@angular/core';
import { UserEditService } from '@app/users/services/user-edit.service';
import { TabWizardItem } from '@app/users/components/tabs/tabs.component';
import { SplitBtnOption } from '@app/users/components/footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService, BaseNavigation } from '@appcore';

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
    private router: Router
  ) {
    super(navigationService);
  }

  get isSaveEnable(): boolean {
    return this.userEditService.selectedTab > 0;
  }

  get isNextEnable(): boolean {
    return this.userEditService.selectedTab < 1;
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
    this.userEditService.resetService();
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
