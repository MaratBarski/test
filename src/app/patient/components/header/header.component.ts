import { Component, OnInit, Input } from '@angular/core';
import { EditPatientService } from '@app/patient/services/edit-patient.service';

@Component({
  selector: 'md-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() pageTitle = 'Add permission set';
  @Input() showLegend = true;
  @Input() showTitle = true;

  constructor(
    public editPatientService: EditPatientService
  ) { }

  ngOnInit() {
  }

}
