import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'md-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  @Input() userInfo: any;
  @Output() onClose = new EventEmitter<void>();
  isOver = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  closeInfo(): void {
    this.onClose.emit();
  }

  edit(): void {
    this.router.navigate(['/users/edit-user', { uid: this.userInfo.id, mode: 1 }]);
    this.onClose.emit();
  }
}
