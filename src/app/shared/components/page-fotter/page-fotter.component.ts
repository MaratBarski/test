import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'md-page-fotter',
  templateUrl: './page-fotter.component.html',
  styleUrls: ['./page-fotter.component.scss']
})
export class PageFotterComponent {

  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  @Input() isValid = false;
  @Input() isLoading = false;

  save(): void {
    if (this.isLoading || !this.isValid) { return; }
    this.onSave.emit();
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
