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

  stateChange(): void {
    this.isOpen = !this.isOpen;
  }

  constructor(
    public editPatientService: EditPatientService
  ) { }

  dates: Array<SelectOption> = [];
  numerics: Array<SelectOption> = [];

  ngOnInit(): void {
    for (let i = 1; i < 6; i++) {
      const opt = { text: `${i}%`, id: i };
      this.dates.push(opt);
      this.numerics.push(opt);
    }
  }

}
