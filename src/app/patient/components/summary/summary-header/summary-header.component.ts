import { Component, Input } from '@angular/core';
import { EditPatientService } from '@app/patient/services/edit-patient.service';

@Component({
  selector: 'md-summary-header',
  templateUrl: './summary-header.component.html',
  styleUrls: ['./summary-header.component.scss']
})
export class SummaryHeaderComponent {

  constructor(
    public editPatientService: EditPatientService
  ) { }

  @Input() tab = 0;
  @Input() name: string;

  get marginTop(): string {
    return this.tab ? '20px' : '0px';
  }

  openTab(): void {
    this.editPatientService.setTab(this.tab);
  }
}
