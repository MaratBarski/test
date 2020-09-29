import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() onChange = new EventEmitter();

  get roleOptions(): Array<SelectOption> { return RoleOptions; }

  get dataOptions(): Array<SelectOption> { return DataOptions; }

  get coefficientOptions(): Array<SelectOption> { return CoefficientOptions; }

  changedRole(option: SelectOption): void {
    this.env.role = option.id;
    this.changeCheck();
  }

  changedData(option: SelectOption): void {
    if (this.env.data === option.id) { return; }
    this.env.data = option.id;
    if (this.env.data === 1) {
      this.env.kf = 4;
      this.env.isShowAdvanced = false;
    }
    this.changeCheck();
  }

  changedKf(option: SelectOption): void {
    if (this.env.kf === option.id) { return; }
    this.env.kf = option.id;
    this.changeCheck();
  }

  showAdvanced(): void {
    this.env.isShowAdvanced = true;
  }

  changeCheck(): void {
    this.onChange.emit();
  }
}
