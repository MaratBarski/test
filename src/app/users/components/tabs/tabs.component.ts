import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { PermissionSetService } from '@app/users/services/permission-set.service';

@Component({
  selector: 'md-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  @Output() onSelect = new EventEmitter<number>();

  constructor(
    public permissionSetService: PermissionSetService
  ) { }


  select(i: number): void {
    if (!this.permissionSetService.validate(true)) {
      return;
    }
    this.permissionSetService.setTab(i);
    this.onSelect.emit(i);
  }

  ngOnInit() {
  }

}
