import { Component, Input } from '@angular/core';
import { CoefficientOptions, DataOptions, RoleOptions } from '@app/users/models/models';
import { SelectOption } from '@appcore';

@Component({
  selector: 'md-user-project-selector',
  templateUrl: './user-project-selector.component.html',
  styleUrls: ['./user-project-selector.component.scss']
})
export class UserProjectSelectorComponent {

  @Input() env: any;
  @Input() index: number;

  get roleOptions(): Array<SelectOption> { return RoleOptions; }

  get dataOptions(): Array<SelectOption> { return DataOptions; }

  get coefficientOptions(): Array<SelectOption> { return CoefficientOptions; }

  changedRole(option: SelectOption): void {
    this.env.role = option.id;
  }

  changedData(option: SelectOption): void {
    if (this.env.data === option.id) { return; }
    this.env.data = option.id;
    if (this.env.data === 1) {
      this.env.kf = 4;
      this.env.isShowAdvanced = false;
    }
  }

  changedKf(option: SelectOption): void {
    if (this.env.kf === option.id) { return; }
    this.env.kf = option.id;
  }

  showAdvanced(): void {
    this.env.isShowAdvanced = true;
  }
}
