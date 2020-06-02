import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SelectOption, LoginService, BaseSibscriber, SelectComponent } from '@app/core-api';

@Component({
  selector: 'md-project-combo',
  templateUrl: './project-combo.component.html',
  styleUrls: ['./project-combo.component.scss']
})
export class ProjectComboComponent extends BaseSibscriber implements OnInit {

  @Input() applyWidth = false;
  @Input() selectUp = true;
  @Input() emptyProject: SelectOption = { text: 'Select environment...', id: '' };
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

  projectModel: any;

  constructor(private loginService: LoginService) {
    super();
  }

  ngOnInit() {
    super.add(
      this.loginService.onUserInfoUpdated.subscribe(ui => {
        if (!ui || !ui.data || !ui.data.projects) { return; }
        this.selectOptions = ui.data.projects.map(x => {
          return { text: x.projectName, id: x.projectId, value: x };
        });
        this.selectedOption = { ...this.emptyProject };
      }));
  }

  changedProject(option: SelectOption): void {
    this.project = option.id.toString();
    this.onChange.emit(this.project);
    this.selectOptions = this.selectOptions.filter(x => x.id !== this.emptyProject.id);
  }
}
