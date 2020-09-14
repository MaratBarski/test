import { Component, OnInit } from '@angular/core';
import { EditPatientService } from '@app/patient/services/edit-patient.service';

@Component({
  selector: 'md-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {

  constructor(
    public editPatientService: EditPatientService
  ) { }

  ngOnInit() {
  }

}
