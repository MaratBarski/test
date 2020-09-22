import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TabItemModel, AutoCompleteComponent, SelectOption } from '@appcore';
import { EditPatientService } from '@app/patient/services/edit-patient.service';
import { ProjectComboComponent } from '@app/shared/components/project-combo/project-combo.component';
import { CohortSources, OutputFormats } from '@app/patient/models/models';
import { take } from 'rxjs/operators';

@Component({
  selector: 'md-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit, AfterViewInit {

  @ViewChild('userNameCmp', { static: true }) userNameCmp: AutoCompleteComponent;
  @ViewChild('projectCmp', { static: true }) projectCmp: ProjectComboComponent;
  @ViewChild('radioTemplate1', { static: true }) radioTemplate1: any;
  @ViewChild('radioTemplate2', { static: true }) radioTemplate2: any;
  @ViewChild('radioTitle1', { static: true }) radioTitle1: any;
  @ViewChild('radioTitle2', { static: true }) radioTitle2: any;

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
    this.editPatientService.onQueriesLoded
      .pipe(take(1))
      .subscribe(() => {
        this.queries = this.editPatientService.queries.map(s => {
          return {
            id: s.session_id,
            name: s.session_name
          }
        });
      })
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
    this.editPatientService.projectName = this.projectCmp.selectedOption.text;
    this.editPatientService.setQueries();
    this.editPatientService.setHierarchyProjects();
    this.editPatientService.loadEvents();
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
    this.editPatientService.queryName = item.name;
  }

  clearQuery(): void {
    this.editPatientService.settings.queryId = 0;
    this.editPatientService.queryName = '';
  }

  changeSource(opt: SelectOption): void {
    this.selectedCohortOption = opt;
    this.editPatientService.settings.cohortSource = opt.id;
  }

  selectedFile: any;

  changeFile(event: any): void {
    this.selectedFile = event.target.files[0];
    //alert(event.target.files[0].name);
  }
}
