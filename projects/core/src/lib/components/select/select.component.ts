import { Component, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { animation, SlideInOutState } from '../../animations/animations';
import { ComponentService } from '../../services/component.service';

export class SelectOption {
  text: string;
  id: string;
}
@Component({
  selector: 'mdc-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  animations: [
    animation.slideUpDown
  ]
})
export class SelectComponent {

  @ViewChild('combo', { static: true }) combo: ElementRef;
  @Input() options: Array<SelectOption>;
  @Input() selected: SelectOption;
  @Input() selectUp = true;
  @Input() maxHeight = '';
  @Input() closeOnselect = true;
  @Input() expandHandler: 'click' | 'hover' = 'click';

  @Output() changed = new EventEmitter<SelectOption>();

  isExpanded = false;
  isOver = false;

  select(option: SelectOption): void {
    if (this.closeOnselect) {
      this.isExpanded = false;
    }
    this.selected = option;
    this.changed.emit(this.selected);
  }

  mouseClick(event: any): void {
    if (this.combo.nativeElement.offsetTop - ComponentService.scrollTop()
      < window.innerHeight / 2
    ) {
      this.selectUp = false;
    }
    this.isExpanded = !this.isExpanded;
  }

  blur() {
    this.isExpanded = false;
  }
}
