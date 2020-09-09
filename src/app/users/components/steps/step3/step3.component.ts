import { Component, OnInit, Input } from '@angular/core';
import { PermissionSetService } from '@app/users/services/permission-set.service';
import { BaseSibscriber } from '@appcore';

@Component({
  selector: 'md-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component extends BaseSibscriber implements OnInit {

  constructor(
    public permissionSetService: PermissionSetService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.isOfflineMode && this.permissionSetService.permissionSet && this.permissionSetService.permissionSet.researchRestrictionEvents) {
      super.add(this.permissionSetService.onTemplatesLoaded.subscribe(() => {
        this.permissionSetService.addEvents();
      }));
    }
  }

  @Input() isOfflineMode = false;

  add(): void {
    this.permissionSetService.addEvent();
  }

  remove(item: any): void {
    this.permissionSetService.removeRoleItem(item);
    this.permissionSetService.validate(false);
  }

  changeRoleItem(event: any): void {
    this.permissionSetService.validate(false);
  }
}
