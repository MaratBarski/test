import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TabItemModel, AutoCompleteComponent, SelectOption, BaseSibscriber } from '@appcore';
import { EditPatientService } from '@app/patient/services/edit-patient.service';
import { ProjectComboComponent } from '@app/shared/components/project-combo/project-combo.component';
import { CohortSources, OutputFormats } from '@app/patient/models/models';
import { RadioListComponent } from '@app/shared/components/radio-list/radio-list.component';

@Component({
  selector: 'md-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component extends BaseSibscriber implements OnInit, AfterViewInit {

  @ViewChild('userNameCmp', { static: true }) userNameCmp: AutoCompleteComponent;
  @ViewChild('projectCmp', { static: true }) projectCmp: ProjectComboComponent;
  @ViewChild('radioTemplate1', { static: true }) radioTemplate1: any;
  @ViewChild('radioTemplate2', { static: true }) radioTemplate2: any;
  @ViewChild('radioTitle1', { static: true }) radioTitle1: any;
  @ViewChild('radioTitle2', { static: true }) radioTitle2: any;
  @ViewChild('cohortRadion', { static: true }) cohortRadion: RadioListComponent;

  constructor(
    public editPatientService: EditPatientService
  ) {
    super();
  }

  tabsFormat: Array<TabItemModel> = [];
  cohortOptions: Array<SelectOption> = []

  activeFormat = 0;
  selectedCohortOption: SelectOption;
  queryCollapsed = true;

  ngOnInit(): void {
    this.tabsFormat = OutputFormats.map(x => {
      return { title: x.text }
    });
    this.activeFormat = this.editPatientService.settings.outputFormat;
    super.add(this.editPatientService.onQueriesLoded
      .subscribe(() => {
        this.sourceQueries = this.queries = this.editPatientService.queries.map(s => {
          return {
            id: s.session_id,
            name: s.session_name
          }
        });
      }));
  }

  ngAfterViewInit(): void {
    // const dict = {
    //   radioTemplate1: { body: this.radioTemplate1, title: this.radioTitle1 },
    //   radioTemplate2: { body: this.radioTemplate2, title: this.radioTitle2 }
    // };
    // setTimeout(() => {
    //   this.cohortOptions = CohortSources.map(x => {
    //     return {
    //       text: x.text,
    //       id: x.id,
    //       template: dict[x.template].body,
    //       titleTemplate: dict[x.template].title
    //     }
    //   });
    //   this.selectedCohortOption = this.cohortOptions.find(x => x.id === this.editPatientService.settings.cohortSource);
    // }, 0);
    setTimeout(() => {
      this.selectedCohortOption = this.cohortRadion.options.find(x => x.id === this.editPatientService.settings.cohortSource);
    }, 1);
  }

  changedProject(id: string): void {
    this.editPatientService.settings.projectId = id;
    this.editPatientService.projectName = this.projectCmp.selectedOption.text;
    setTimeout(() => {
      this.editPatientService.setQueries();  
    }, 1);
    //this.editPatientService.setHierarchyProjects();
    //this.editPatientService.loadEvents();
    this.editPatientService.isValueChanged = true;
  }

  setOutputFormat(i: number): void {
    this.editPatientService.settings.outputFormat = i;
    this.editPatientService.isValueChanged = true;
  }

  searchQueryText = '';
  queries = [];
  sourceQueries = [];

  completeQuery(text: string): void {
    this.queryCollapsed = false;
    this.queries = this.sourceQueries.filter(x => !text || !text.trim() || x.name.toLowerCase().indexOf(text.toLowerCase()) > -1);
    this.searchQueryText = text;
  }

  selectQuery(item: any): void {
    this.editPatientService.settings.queryId = item.id;
    this.editPatientService.queryName = item.name;
    this.editPatientService.isValueChanged = true;
  }

  clearQuery(): void {
    this.queryCollapsed = false;
    this.editPatientService.settings.queryId = 0;
    this.editPatientService.queryName = '';
    this.editPatientService.isValueChanged = true;
  }

  changeSource(opt: SelectOption): void {
    this.selectedCohortOption = opt;
    this.editPatientService.settings.cohortSource = opt.id;
    this.editPatientService.isValueChanged = true;
  }

  selectedFile: any;

  changeFile(event: any): void {
    this.selectedFile = event.target.files[0];
    this.editPatientService.file = event.target.files[0];
    this.editPatientService.isValueChanged = true;
    //alert(event.target.files[0].name);
  }
}
