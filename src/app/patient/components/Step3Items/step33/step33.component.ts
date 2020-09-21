import { Component, Input, OnInit } from '@angular/core';
import { EditPatientService } from '@app/patient/services/edit-patient.service';
import { SelectOption } from '@appcore';

@Component({
  selector: 'md-step33',
  templateUrl: './step33.component.html',
  styleUrls: ['./step33.component.scss']
})
export class Step33Component implements OnInit {

  @Input() isOpen = false;
  
  stateChange():void{
    this.isOpen = !this.isOpen;
  }
  
  constructor(
    public editPatientService: EditPatientService
  ) { }

  ngOnInit() {
  }

}
