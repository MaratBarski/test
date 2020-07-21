import { Component, OnInit } from '@angular/core';
import { PermissionSetService } from '@app/users/services/permission-set.service';

@Component({
  selector: 'md-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {

  constructor(
    public permissionSetService: PermissionSetService
  ) { }

  ngOnInit() {
  }

}
