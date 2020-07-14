import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'md-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  @Output() onCancel = new EventEmitter();
  @Output() onConfirm = new EventEmitter();

  @Input() text = 'text';
  @Input() subText = 'subText';  
  @Input() name = 'name';
  @Input() subName = 'subName';

  cancel(): void {
    this.onCancel.emit();
  }

  confirm(): void {
    this.onConfirm.emit();
  }

}
