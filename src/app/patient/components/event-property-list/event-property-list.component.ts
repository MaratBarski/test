import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'md-event-property-list',
  templateUrl: './event-property-list.component.html',
  styleUrls: ['./event-property-list.component.scss']
})
export class EventPropertyListComponent implements OnInit {

  @Input() id = 'all';
  constructor() { }

  eventList = [];
  isCheckedAll = true;

  ngOnInit(): void {
    this.initEvents();
  }

  chackAll(): void {
    this.eventList.forEach(ev => {
      ev.event.isChecked = this.isCheckedAll;
      ev.properties.forEach(p => {
        p.isChecked = this.isCheckedAll;
      });
    })
  }

  expand(option: any): void {
    option.isExpanded = !!!option.isExpanded;
  }

  checkEvent(option: any): void {
    option.properties.forEach(element => {
      element.isChecked = option.event.isChecked;
    });
    this.updateCheckAll();
  }

  checkSubEvent(option: any, subItem: any): void {
    //alert(subItem.isChecked);
    this.updateOptionCheck(option);
  }

  updateOptionCheck(option: any): void {
    const checkedList = option.properties.filter(x => x.isChecked);
    if (checkedList.length === option.properties.length) {
      option.event.isChecked = true;
    }
    if (checkedList.length === 0) {
      option.event.isChecked = false;
    }
    this.updateCheckAll();
  }

  updateCheckAll(): void {
    const checkedList = this.eventList.filter(x => x.event.isChecked);
    if (checkedList.length === this.eventList.length) {
      this.isCheckedAll = true;
    }
    if (checkedList.length === 0) {
      this.isCheckedAll = false;
    }
  }

  initEvents(): void {
    this.eventList = [
      {
        event: { name: 'test1', id: 'id', isChecked: true },
        properties: [
          { name: 'name', id: 'id', isChecked: true },
          { name: 'name', id: 'id', isChecked: true },
          { name: 'name', id: 'id', isChecked: true },
          { name: 'name', id: 'id', isChecked: true },
          { name: 'name', id: 'id', isChecked: true },
          { name: 'name', id: 'id', isChecked: true },
          { name: 'name', id: 'id' },
          { name: 'name', id: 'id' },
        ]
      },
      {
        event: { name: 'asasas', id: 'id', isChecked: false },
        properties: [
          { name: 'name', id: 'id', isChecked: true },
          { name: 'name', id: 'id', isChecked: true },
          { name: 'name', id: 'id', isChecked: true },
          { name: 'name', id: 'id', isChecked: true },
          { name: 'name', id: 'id', isChecked: true },
          { name: 'name', id: 'id', isChecked: true },
          { name: 'name', id: 'id' },
          { name: 'name', id: 'id' },
        ]
      }
    ];
  }

}
