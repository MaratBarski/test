import { Component, OnInit } from '@angular/core';
import { PermissionSetService } from '@app/users/services/permission-set.service';

@Component({
  selector: 'md-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(
    public permissionSetService: PermissionSetService
  ) { }

  cancel(): void {
    this.permissionSetService.cansel();
  }

  next(i:number): void {
    this.permissionSetService.nextTab(i);
  }

  save():void{
    this.permissionSetService.save();
  }
}
