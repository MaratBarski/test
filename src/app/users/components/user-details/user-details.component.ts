import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'md-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  @Input() userInfo: any;
  isOver = false;
  
  constructor() { }

  ngOnInit() {
  }

}
