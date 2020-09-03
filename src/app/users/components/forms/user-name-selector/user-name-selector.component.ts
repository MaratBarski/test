import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'md-user-name-selector',
  templateUrl: './user-name-selector.component.html',
  styleUrls: ['./user-name-selector.component.scss']
})
export class UserNameSelectorComponent {

  @Output() onSelect = new EventEmitter<any>();

  @Input() users = [
    { name: 'test1', id: 0 },
    { name: 'test1', id: 1 },
    { name: 'test1', id: 2 },
    { name: 'test3', id: 3 },
  ];

  filteredUsers = [];

  searchText = '';

  completeUserSelect(text: string): void {
    this.filteredUsers = this.users.filter(x => x.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
    this.searchText = text;
  }

  selectUser(user: any): void {
    this.onSelect.emit(user);
  }
}
