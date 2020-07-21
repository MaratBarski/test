import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'md-permission-wizard',
  templateUrl: './permission-wizard.component.html',
  styleUrls: ['./permission-wizard.component.scss']
})
export class PermissionWizardComponent implements OnInit {

  constructor() { }

  selectedTab = 0;

  setTab(i: number): void {
    this.selectedTab = i;
  }

  ngOnInit() {
  }

}

