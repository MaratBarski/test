import { Component, OnInit } from '@angular/core';
import { UserEditService } from '@app/users/services/user-edit.service';

@Component({
  selector: 'md-edit-user-general',
  templateUrl: './edit-user-general.component.html',
  styleUrls: ['./edit-user-general.component.scss']
})
export class EditUserGeneralComponent implements OnInit {

  constructor(
    public userEditService: UserEditService
  ) { }

  ngOnInit() {
  }

}
