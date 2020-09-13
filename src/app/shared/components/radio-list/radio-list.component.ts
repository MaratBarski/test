import { Component, Input, EventEmitter, Output } from '@angular/core';
import { SelectOption } from '@appcore';


@Component({
  selector: 'md-radio-list',
  templateUrl: './radio-list.component.html',
  styleUrls: ['./radio-list.component.scss']
})
export class RadioListComponent {

  @Input() selectedOption: SelectOption;
  @Input() options: Array<SelectOption> = []
  @Input() radioId = 'radio';
  @Output() onChange = new EventEmitter<SelectOption>();

  change(opt: SelectOption): void {
    this.selectedOption = opt;
    this.onChange.emit(opt);
  }
}
