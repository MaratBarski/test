import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TabItemModel, AutoCompleteComponent, SelectOption } from '@appcore';
import { EditPatientService } from '@app/patient/services/edit-patient.service';
import { ProjectComboComponent } from '@app/shared/components/project-combo/project-combo.component';
import { CohortSources, OutputFormats } from '@app/patient/models/models';

@Component({
  selector: 'md-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit, AfterViewInit {

  @ViewChild('userNameCmp', { static: true }) userNameCmp: AutoCompleteComponent;
  @ViewChild('projectCmp', { static: false }) projectCmp: ProjectComboComponent;
  @ViewChild('radioTemplate1', { static: false }) radioTemplate1: any;
  @ViewChild('radioTemplate2', { static: false }) radioTemplate2: any;
  @ViewChild('radioTitle1', { static: false }) radioTitle1: any;
  @ViewChild('radioTitle2', { static: false }) radioTitle2: any;

  constructor(
    public editPatientService: EditPatientService
  ) { }

  tabsFormat: Array<TabItemModel> = [];
  cohortOptions: Array<SelectOption> = []

  activeFormat = 0;
  selectedCohortOption: SelectOption;

  ngOnInit(): void {
    this.tabsFormat = OutputFormats.map(x => {
      return { title: x.text }
    });
    this.activeFormat = this.editPatientService.settings.outputFormat;
    this.queries = this.editPatientService.queries;
  }

  ngAfterViewInit(): void {
    const dict = {
      radioTemplate1: { body: this.radioTemplate1, title: this.radioTitle1 },
      radioTemplate2: { body: this.radioTemplate2, title: this.radioTitle2 }
    };
    setTimeout(() => {
      this.cohortOptions = CohortSources.map(x => {
        return {
          text: x.text,
          id: x.id,
          template: dict[x.template].body,
          titleTemplate: dict[x.template].title
        }
      });
      this.selectedCohortOption = this.cohortOptions.find(x => x.id === this.editPatientService.settings.cohortSource);
    }, 0);
  }

  changedProject(id: string): void {
    this.editPatientService.settings.projectId = id;
  }

  setOutputFormat(i: number): void {
    this.editPatientService.settings.outputFormat = i;
  }

  searchQueryText = '';
  queries = [];

  completeQuery(text: string): void {
    this.queries = this.queries.filter(x => x.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
    this.searchQueryText = text;
  }

  selectQuery(item: any): void {
    this.editPatientService.settings.queryId = item.id;
  }

  clearQuery(): void {
    this.editPatientService.settings.queryId = 0;
  }

  changeSource(opt: SelectOption): void {
    this.selectedCohortOption = opt;
    this.editPatientService.settings.cohortSource = opt.id;
  }
}
