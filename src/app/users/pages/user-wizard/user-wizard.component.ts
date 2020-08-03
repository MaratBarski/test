import { Component, OnInit } from '@angular/core';
import { UserEditService } from '@app/users/services/user-edit.service';
import { TabWizardItem } from '@app/users/components/tabs/tabs.component';

@Component({
  selector: 'md-user-wizard',
  templateUrl: './user-wizard.component.html',
  styleUrls: ['./user-wizard.component.scss']
})
export class UserWizardComponent implements OnInit {

  constructor(
    public userEditService: UserEditService
  ) { }

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

  selectNextTab(index: number): void {
    this.userEditService.setTab(index);
  }

}
