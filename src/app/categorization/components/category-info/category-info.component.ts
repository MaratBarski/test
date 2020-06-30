import { Component, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { Hierarchy } from '@app/imported-files/models/hierarchy';
import { environment } from '@env/environment';

@Component({
  selector: 'md-category-info',
  templateUrl: './category-info.component.html',
  styleUrls: ['./category-info.component.scss']
})
export class CategoryInfoComponent {

  isOver = false;
  defaultLevel: any;
  private _category: Hierarchy;
  @Input() set category(category: Hierarchy) {
    this._category = category;
    if (this._category.hierarchyLevels) {
      this.defaultLevel = this._category.hierarchyLevels.find(x => x.hierarchyLevelId === this._category.defaultLevelId);
    }
  }
  get category(): Hierarchy {
    return this._category;
  }

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
