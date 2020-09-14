import { Component } from '@angular/core';
import { EditPatientService } from '@app/patient/services/edit-patient.service';

@Component({
  selector: 'md-summary3',
  templateUrl: './summary3.component.html',
  styleUrls: ['./summary3.component.scss']
})
export class Summary3Component {

  constructor(
    public editPatientService: EditPatientService
  ) { }
}
