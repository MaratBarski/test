import { Component } from '@angular/core';
import { EditPatientService } from '@app/patient/services/edit-patient.service';

@Component({
  selector: 'md-summary1',
  templateUrl: './summary1.component.html',
  styleUrls: ['./summary1.component.scss']
})
export class Summary1Component {

  constructor(
    public editPatientService: EditPatientService
  ) { }

}
