import { Component, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { Hierarchy } from '@app/models/hierarchy';

@Component({
  selector: 'md-category-info',
  templateUrl: './category-info.component.html',
  styleUrls: ['./category-info.component.scss']
})
export class CategoryInfoComponent {

  isOver = false;

  @Input() category: Hierarchy;
  @Output() onClose = new EventEmitter();

  closeInfo(): void {
    this.onClose.emit();
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    if (this.isOver) { return; }
    this.closeInfo();
  }
}
