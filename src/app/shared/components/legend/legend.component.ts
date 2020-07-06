import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'md-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit {

  isOpen = false;
  constructor() { }

  toogle(e: any): void {
    //this.isOpen = !this.isOpen;
  }

  ngOnInit() {
  }

}
