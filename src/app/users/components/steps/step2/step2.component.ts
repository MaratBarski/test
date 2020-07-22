import { Component, OnInit } from '@angular/core';
import { PermissionSetService, AllowedEvents } from '@app/users/services/permission-set.service';

@Component({
  selector: 'md-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {

  constructor(
    public permissionSetService: PermissionSetService
  ) { }

  templateItems = [];

  get allowedEvents(): Array<any> {
    return AllowedEvents;
  }

  updateTemplates(t: any): void {
    this.permissionSetService.updateTemplates();
  }

  selectTemplateItem(t: any): void {
    if (this.permissionSetService.permissionSet.allowedEvent !== 3) { return; }
    this.templateItems = t.templateItems;
  }

  unselectTemplateItem(): void {
    this.templateItems = [];
  }

  ngOnInit() {
  }

}
