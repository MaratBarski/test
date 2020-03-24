import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'mdc-date-range-selector',
  templateUrl: './date-range-selector.component.html',
  styleUrls: ['./date-range-selector.component.css']
})
export class DateRangeSelectorComponent implements OnInit {

  @Input() header = 'Select report data range';
  constructor() { }

  ngOnInit() {
  }

}
