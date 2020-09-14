import { Component, Input, OnInit } from '@angular/core';
import { EditPatientService } from '@app/patient/services/edit-patient.service';

@Component({
  selector: 'md-step34',
  templateUrl: './step34.component.html',
  styleUrls: ['./step34.component.scss']
})
export class Step34Component implements OnInit {

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
