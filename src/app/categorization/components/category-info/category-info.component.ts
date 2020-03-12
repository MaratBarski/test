import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Hierarchy } from '@app/imported-files/models/hierarchy';

@Component({
  selector: 'md-category-info',
  templateUrl: './category-info.component.html',
  styleUrls: ['./category-info.component.scss']
})
export class CategoryInfoComponent {

  @Input() category: Hierarchy;
  @Output() onClose = new EventEmitter();

  closeInfo(): void {
    this.onClose.emit();
  }
}
