import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mdc-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {

  @Input() organizationName = '';
  @Input() logo = '';

  constructor() { }

  ngOnInit() {
  }

}
