import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditPatientService } from '@app/patient/services/edit-patient.service';
import { TabWizardItem } from '@app/shared/components/tab-wizard/tab-wizard.component';
import { BaseSibscriber } from '@appcore';

@Component({
  selector: 'md-edit-patient-story-wizard',
  templateUrl: './edit-patient-story-wizard.component.html',
  styleUrls: ['./edit-patient-story-wizard.component.scss']
})
export class EditPatientStoryWizardComponent extends BaseSibscriber implements OnInit {

  constructor(
    public editPatientService: EditPatientService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

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
    super.add(
      this.activatedRoute.paramMap.subscribe(u => {
        const id = parseInt(u.get('id') || '0');
        this.pageTitle = id ? 'Edit permission set' : 'Add permission set';
        this.editPatientService.reset(id);
      }));
  }

  selectNextTab(index: number): void {
    // if (!this.permissionSetService.validate(true)) {
    //   this.permissionSetService.isAfterValidate = true;
    //   return;
    // }
    this.editPatientService.setTab(index);
  }

}
