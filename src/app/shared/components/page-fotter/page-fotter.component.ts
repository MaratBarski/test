import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'md-page-fotter',
  templateUrl: './page-fotter.component.html',
  styleUrls: ['./page-fotter.component.scss']
})
export class PageFotterComponent {
  
  @Output() onSave = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  save(): void {
    this.onSave.emit();
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
