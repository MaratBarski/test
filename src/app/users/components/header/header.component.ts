import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'md-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() pageTitle = 'Add permission set';
  
  constructor() { }

  ngOnInit() {
  }

}
