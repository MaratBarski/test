import { Component, Input } from '@angular/core';
import { EditPatientService } from '@app/patient/services/edit-patient.service';

@Component({
  selector: 'md-event-property-list',
  templateUrl: './event-property-list.component.html',
  styleUrls: ['./event-property-list.component.scss']
})
export class EventPropertyListComponent {

  @Input() id = 'all';
  constructor(
    public editPatientService: EditPatientService
  ) { }

  isCheckedAll = false;

  chackAll(): void {
    this.editPatientService.events.forEach(ev => {
      ev.isChecked = this.isCheckedAll;
      ev.siteEventPropertyInfos.forEach(p => {
        p.isChecked = this.isCheckedAll;
      });
    })
  }

  expand(option: any): void {
    option.isExpanded = !!!option.isExpanded;
  }

  checkEvent(option: any): void {
    option.siteEventPropertyInfos.forEach(element => {
      element.isChecked = option.isChecked;
    });
    this.updateCheckAll();
  }

  checkSubEvent(option: any, subItem: any): void {
    //alert(subItem.isChecked);
    this.updateOptionCheck(option);
  }

  updateOptionCheck(option: any): void {
    const checkedList = option.siteEventPropertyInfos.filter(x => x.isChecked);
    if (checkedList.length === option.siteEventPropertyInfos.length) {
      option.isChecked = true;
    }
    if (checkedList.length === 0) {
      option.isChecked = false;
    }
    this.updateCheckAll();
  }

  updateCheckAll(): void {
    const checkedList = this.editPatientService.events.filter(x => x.event.isChecked);
    if (checkedList.length === this.editPatientService.events.length) {
      this.isCheckedAll = true;
    }
    if (checkedList.length === 0) {
      this.isCheckedAll = false;
    }
  }


}
