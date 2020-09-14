import { Component, Input, OnInit } from '@angular/core';
import { SelectOption } from '@appcore';
import { EditPatientService } from '@app/patient/services/edit-patient.service';

@Component({
  selector: 'md-step32',
  templateUrl: './step32.component.html',
  styleUrls: ['./step32.component.scss']
})
export class Step32Component implements OnInit {

  @Input() isOpen = false;
  
  stateChange():void{
    this.isOpen = !this.isOpen;
  }
  
  constructor(
    public editPatientService: EditPatientService
  ) { }

  dates:Array<SelectOption> = [
    {
      text:'1',
      id:1
    },
    {
      text:'2',
      id:2
    }
  ]

  numerics:Array<SelectOption> = [
    {
      text:'1%',
      id:1
    },
    {
      text:'2%',
      id:2
    }
  ]
  
  ngOnInit() {
  }

}
