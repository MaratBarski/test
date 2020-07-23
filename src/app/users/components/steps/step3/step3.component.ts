import { Component, OnInit } from '@angular/core';
import { PermissionSetService } from '@app/users/services/permission-set.service';

@Component({
  selector: 'md-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements OnInit {

  constructor(
    public permissionSetService: PermissionSetService
  ) { }

  ngOnInit() {
  }

  add(): void {
    this.permissionSetService.addRoleItem();
  }

  remove(item: any): void {
    this.permissionSetService.removeRoleItem(item);
  }
}
