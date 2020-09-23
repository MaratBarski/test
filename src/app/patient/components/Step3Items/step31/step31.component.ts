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

  stateChange(): void {
    this.isOpen = !this.isOpen;
  }

  years: Array<SelectOption> = [];

  constructor(
    public editPatientService: EditPatientService
  ) { }

  ngOnInit() {
    this.years = [];
    for (let i = 1; i < 10; i++) {
      this.years.push({
        text: `${i}`,
        id: i
      })
    }
  }

}
