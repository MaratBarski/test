import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'md-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  @Input() userInfo: any;
  @Output() onClose = new EventEmitter<void>();
  isOver = false;

  constructor() { }

  ngOnInit() {
  }

  closeInfo(): void {
    this.onClose.emit();
  }

  edit(): void {
    this.onClose.emit();
  }
}
