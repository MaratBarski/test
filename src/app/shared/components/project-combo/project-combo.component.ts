import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { SelectOption, LoginService, BaseSibscriber, SortService } from '@appcore';

@Component({
  selector: 'md-project-combo',
  templateUrl: './project-combo.component.html',
  styleUrls: ['./project-combo.component.scss']
})
export class ProjectComboComponent extends BaseSibscriber implements OnInit {
  @Input() userType: string;
  @Input() user: any;
  @Input() isSmall = false;
  @Input() applyWidth = false;
  @Input() selectUp = true;
  @Input() emptyProject: SelectOption = { text: 'Select environment...', id: '' };
  @Output() onChange = new EventEmitter<string>();
  selectOptions: Array<SelectOption>;
  @Input() set disabled(disabled: boolean) {
    setTimeout(() => {
      this._disabled = disabled;
    }, 0);
  }
  get disabled(): boolean {
    return this._disabled;
  }
  private _disabled = false;
  @Input() isInvalid = false;
  @Input() set project(project: string) {
    if (!project) {
      this.selectedOption = { ...this.emptyProject };
    }
    this._project = project;
    this.initSelectedProject();
  }

  get project(): string { return this._project; }
  private _project = '';
  selectedOption: SelectOption = undefined;

  private initSelectedProject(): void {
    if (this.selectOptions) {
      this.selectedOption = this.selectOptions.find(x => x.id == this._project) || { ...this.emptyProject };
      if (this.selectedOption) {
        this.projectModel = this._project;
      }
    }
  }

  set projectModel(projectModel: any) {
    setTimeout(() => {
      this._projectModel = projectModel;
    }, 1);
  }

  get projectModel(): any {
    return this._projectModel;
  }
  private _projectModel: any;

  constructor(
    private loginService: LoginService,
    private sortService: SortService
  ) {
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
        this.initSelectedProject();
      }));
  }

  changedProject(option: SelectOption): void {
    this.project = option.id.toString();
    this.onChange.emit(this.project);
    this.selectOptions = this.selectOptions.filter(x => x.id !== this.emptyProject.id);
  }

  getProjectById(id: any): any {
    return this.selectOptions.find(x => x.id === id);
  }
}
