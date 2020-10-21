import {Component, Input, OnInit} from '@angular/core';
import {animation, RotatedState} from '@appcore';

@Component({
  selector: 'md-popup-menu-button',
  templateUrl: './popup-menu-button.component.html',
  styleUrls: ['./popup-menu-button.component.scss'],
  animations: [
    animation.slideUpDown,
    animation.rotateRight90
  ]
})
export class PopupMenuButtonComponent implements OnInit {
  isExpanded = false;
  isOver = false;
  rotatedState: RotatedState = RotatedState.default;
  @Input() disabled = false;

  constructor() { }

  ngOnInit() {
  }

  downloadOriginal() {

  }

  blur() {
    this.isExpanded = false;
    this.rotatedState = RotatedState.default;
  }

  mouseClick(event: any): void {

    if (!this.disabled) {
      this.isExpanded = !this.isExpanded;
      this.rotatedState = this.isExpanded ? RotatedState.rotated : RotatedState.default;
    }
  }
}
