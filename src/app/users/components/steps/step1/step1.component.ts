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

  researchers: Array<any> = [];
  private _researchers: Array<any>;

  ngOnInit() {
    this._researchers = this.permissionSetService.getResearchers();
  }

  changeIsNew(): void {
    //alert(this.permissionSetService.permissionSet.isNew);
  }

  completeMethod(text: string): void {
    this.researchers = this._researchers.filter(x => x.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
    this.searchText = text;
  }

  selectItem($event) {

  }

  selectedItem: any;
  searchText: string;

}
