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
    });
    this.editPatientService.isValueChanged = true;
  }

  expand(option: any): void {
    option.isExpanded = !!!option.isExpanded;
  }

  checkEvent(option: any): void {
    option.siteEventPropertyInfos.forEach(element => {
      element.isChecked = option.isChecked;
    });
    this.updateCheckAll();
    this.editPatientService.isValueChanged = true;
  }

  checkSubEvent(option: any, subItem: any): void {
    this.updateOptionCheck(option);
    if (subItem.isChecked) { option.isChecked = true; }
    this.editPatientService.isValueChanged = true;
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
  }
}
