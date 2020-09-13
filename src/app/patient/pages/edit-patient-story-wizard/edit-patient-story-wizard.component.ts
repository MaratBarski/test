import { Component, OnInit } from '@angular/core';
import { EditPatientService } from '@app/patient/services/edit-patient.service';
import { TabWizardItem } from '@app/shared/components/tab-wizard/tab-wizard.component';

@Component({
  selector: 'md-edit-patient-story-wizard',
  templateUrl: './edit-patient-story-wizard.component.html',
  styleUrls: ['./edit-patient-story-wizard.component.scss']
})
export class EditPatientStoryWizardComponent implements OnInit {

  constructor(
    public editPatientService: EditPatientService
  ) { }

  showLegend = true;
  pageTitle = 'ADD PATIENT STORY SETTINGS';

  tabs: Array<TabWizardItem> = [
    {
      text: 'Source & Output'
    },
    {
      text: 'Content',
      isOptional: true
    },
    {
      text: 'Privacy Settings',
      isOptional: true
    },
    {
      text: 'Summary'
    }
  ];

  ngOnInit(): void {
    this.editPatientService.reset();
  }

  selectNextTab(index: number): void {
    // if (!this.permissionSetService.validate(true)) {
    //   this.permissionSetService.isAfterValidate = true;
    //   return;
    // }
    this.editPatientService.setTab(index);
  }

}
