import { Component, OnInit, Input } from '@angular/core';
import { PermissionSetService, AllowedEvents } from '@app/users/services/permission-set.service';
import { BaseSibscriber } from '@appcore';

@Component({
  selector: 'md-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component extends BaseSibscriber implements OnInit {

  constructor(
    public permissionSetService: PermissionSetService
  ) {
    super();
  }

  templateItems = [];

  @Input() isOfflineMode = false;

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

  updateEvents(event: any): void {
    this.permissionSetService.updateAllowedEvents();
  }

  ngOnInit(): void {
    if (this.isOfflineMode && this.permissionSetService.permissionSet && this.permissionSetService.permissionSet.researchTemplates) {
      super.add(this.permissionSetService.onTemplatesLoaded.subscribe(() => {
        this.permissionSetService.selectTemplates();
      }));
    }
  }

}
