import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SelectOption } from '@app/core-api';
import { LoginService, BaseSibscriber, SelectComponent } from 'projects/core/src/public-api';

@Component({
  selector: 'md-project-combo',
  templateUrl: './project-combo.component.html',
  styleUrls: ['./project-combo.component.scss']
})
export class ProjectComboComponent extends BaseSibscriber implements OnInit {

  @Input() emptyProject: SelectOption = { text: 'Select project', id: '' };
  @Output() onChange = new EventEmitter<string>();
  selectOptions: Array<SelectOption>;
  @Input() set project(project: string) {
    if (!project) {
      this.selectedOption = { ...this.emptyProject };
    }
    this._project = project;
  }
  get project(): string { return this._project; }
  private _project = '';
  selectedOption: SelectOption = undefined;

  constructor(private loginService: LoginService) {
    super();
  }

  ngOnInit() {
    super.add(
      this.loginService.onUserInfoUpdated.subscribe(ui => {
        if (!ui || !ui.data || !ui.data.projects) { return; }
        this.selectOptions = ui.data.projects.map(x => {
          return { text: x.projectName, id: x.projectId };
        });
        this.selectedOption = { ...this.emptyProject };
      }));
  }

  changedProject(option: SelectOption): void {
    this.project = option.id;
    this.onChange.emit(this.project);
    this.selectOptions = this.selectOptions.filter(x => x.id !== this.emptyProject.id);
  }
}
