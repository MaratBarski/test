import { EventEmitter, Component, Input, Output, HostListener } from '@angular/core';
import { ComponentService } from '@appcore';


@Component({
  selector: 'md-event-searcher',
  templateUrl: './event-searcher.component.html',
  styleUrls: ['./event-searcher.component.scss']
})
export class EventSearcherComponent {

  @Input() placeholder = '';
  @Input() searchText = '';
  @Input() isDisabled = false;

  @Output() onTextChanged = new EventEmitter<string>();
  @Output() onShowAll = new EventEmitter();
  @Output() onExpanDisabled = new EventEmitter();

  @Input() isExpanded = false;

  keyDown(event: any): void {
    // if (this.isDisabled) { return; }
    // this.onTextChanged.emit(this.searchText);
  }

  keyUp(event: any): void {
    if (this.isDisabled) { return; }
    this.isExpanded = true;
    this.onTextChanged.emit(this.searchText);
  }

  expandAll(event: any): void {
    if (this.isDisabled) {
      this.onExpanDisabled.emit();
      return;
    }
    const f = this.isExpanded;
    ComponentService.documentClick(event);
    this.isExpanded = !f;
    this.onShowAll.emit();
  }

  clear(event: any): void {
    if (this.isDisabled) { return; }
    this.searchText = '';
    this.onTextChanged.emit('');
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    this.isExpanded = false;
  }
}
