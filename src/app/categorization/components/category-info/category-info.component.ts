import { Component, Input, EventEmitter, Output, HostListener } from '@angular/core';
<<<<<<< HEAD
import { Hierarchy } from '@app/models/hierarchy';
import {environment} from '@env/environment';
=======
import { Hierarchy } from '@app/imported-files/models/hierarchy';
import { environment } from '@env/environment';
>>>>>>> development

@Component({
  selector: 'md-category-info',
  templateUrl: './category-info.component.html',
  styleUrls: ['./category-info.component.scss']
})
export class CategoryInfoComponent {

  isOver = false;
  get downloadUrl(): string { return environment.serverUrl + environment.endPoints.downloadHierarchy + '/'};
  @Input() category: Hierarchy;
  @Output() onClose = new EventEmitter();

  closeInfo(): void {
    this.onClose.emit();
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    if (this.isOver) { return; }
    this.closeInfo();
  }

  download(): void {
    window.open(`${environment.serverUrl}${environment.endPoints.downloadCategory}/${this.category.hierarchyRootId}`)
  }
}
