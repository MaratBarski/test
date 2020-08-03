import { Component, OnInit } from '@angular/core';
import { UserEditService } from '@app/users/services/user-edit.service';
import { TabWizardItem } from '@app/users/components/tabs/tabs.component';
import { SplitBtnOption } from '@app/users/components/footer/footer.component';

@Component({
  selector: 'md-user-wizard',
  templateUrl: './user-wizard.component.html',
  styleUrls: ['./user-wizard.component.scss']
})
export class UserWizardComponent implements OnInit {

  constructor(
    public userEditService: UserEditService
  ) { }

  get isSaveEnable(): boolean {
    return this.userEditService.selectedTab > 0;
  }

  tabs: Array<TabWizardItem> = [
    {
      text: 'Account Details'
    },
    {
      text: 'Permission Set'
    }
  ]

  ngOnInit() {
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

}
