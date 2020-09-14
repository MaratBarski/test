import { Component, Input, OnInit } from '@angular/core';
import { SelectOption } from '@appcore';
import { EditPatientService } from '@app/patient/services/edit-patient.service';


@Component({
  selector: 'md-step31',
  templateUrl: './step31.component.html',
  styleUrls: ['./step31.component.scss']
})
export class Step31Component implements OnInit {

  @Input() isOpen = false;
  
  stateChange():void{
    this.isOpen = !this.isOpen;
  }

  countries:Array<SelectOption> = [
    {
      text:'Israel',
      id:1
    },
    {
      text:'Usa',
      id:2
    }
  ]

  
  years:Array<SelectOption> = [
    {
      text:'1',
      id:1
    },
    {
      text:'2',
      id:2
    }
  ]

  constructor(
    public editPatientService: EditPatientService
  ) { }

  ngOnInit() {
  }

}
