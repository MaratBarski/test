import { Component, OnInit, ViewChild } from '@angular/core';
import { TabItemModel, AutoCompleteComponent } from '@appcore';
import { EditPatientService } from '@app/patient/services/edit-patient.service';
import { ProjectComboComponent } from '@app/shared/components/project-combo/project-combo.component';
import { OutputFormats } from '@app/patient/models/models';

@Component({
  selector: 'md-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {

  @ViewChild('userNameCmp', { static: true }) userNameCmp: AutoCompleteComponent;
  @ViewChild('projectCmp', { static: false }) projectCmp: ProjectComboComponent;

  constructor(
    public editPatientService: EditPatientService
  ) { }

  tabsFormat: Array<TabItemModel> = [
    { title: 'xml' },
    { title: 'table' }
  ]

  activeFormat = 0;

  ngOnInit(): void {
    this.tabsFormat = OutputFormats.map(x => {
      return { title: x.text }
    });
    this.activeFormat = this.editPatientService.settings.outputFormat;
  }

  changedProject(id: string): void {
    this.editPatientService.settings.projectId = id;
  }

  setOutputFormat(i: number): void {
    this.editPatientService.settings.outputFormat = i;
  }

}
