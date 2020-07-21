import { Component, OnInit } from '@angular/core';
import { PermissionSetService } from '@app/users/services/permission-set.service';

@Component({
  selector: 'md-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {

  constructor(
    public permissionSetService: PermissionSetService
  ) { }

  ngOnInit() {
  }

  changeIsNew(): void {
    //alert(this.permissionSetService.permissionSet.isNew);
  }

}
