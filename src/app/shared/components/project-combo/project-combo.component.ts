import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SelectOption, LoginService, BaseSibscriber, SortService } from '@appcore';

@Component({
  selector: 'md-project-combo',
  templateUrl: './project-combo.component.html',
  styleUrls: ['./project-combo.component.scss']
})
export class ProjectComboComponent extends BaseSibscriber implements OnInit {
  @Input() user: any;
  @Input() isSmall = false;
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
    if (this.selectOptions) {
      this.selectedOption = this.selectOptions.find(x => x.id === this._project) || { ...this.emptyProject };
    }
  }
  get project(): string { return this._project; }
  private _project = '';
  selectedOption: SelectOption = undefined;

  projectModel: any;

  constructor(private loginService: LoginService, private sortService: SortService) {
    super();
  }

  ngOnInit() {
    super.add(
      this.loginService.onUserInfoUpdated.subscribe(ui => {
        if (!ui || !ui.data || !ui.data.projects) { return; }
        this.selectOptions = ui.data.projects.map(x => {
          return { text: x.projectName, id: x.projectId, value: x };
        }).sort((a, b) => {
          return this.sortService.compareString(a.text, b.text, 'asc');
        });;
        this.selectedOption = { ...this.emptyProject };
      }));
  }

  changedProject(option: SelectOption): void {
    this.project = option.id.toString();
    this.onChange.emit(this.project);
    this.selectOptions = this.selectOptions.filter(x => x.id !== this.emptyProject.id);
  }
}
