import { Component } from '@angular/core';
import { EditPatientService } from '@app/patient/services/edit-patient.service';

@Component({
  selector: 'md-summary2',
  templateUrl: './summary2.component.html',
  styleUrls: ['./summary2.component.scss']
})
export class Summary2Component  {

  constructor(
    public editPatientService: EditPatientService
  ) { }

}
