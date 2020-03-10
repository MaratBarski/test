import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SelectOption } from '@app/core-api';
import { LoginService, BaseSibscriber } from 'projects/core/src/public-api';

@Component({
  selector: 'md-project-combo',
  templateUrl: './project-combo.component.html',
  styleUrls: ['./project-combo.component.scss']
})
export class ProjectComboComponent extends BaseSibscriber implements OnInit {

  @Output() onChange = new EventEmitter<string>();
  selectOptions: Array<SelectOption>;
  @Input() selectedProject: string;

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
        this.selectedProject = this.selectOptions.length ? this.selectOptions[0].id : undefined;
      }));
  }

  changedProject(option: SelectOption): void {
    this.selectedProject = option.id;
    this.onChange.emit(this.selectedProject);
  }


}
