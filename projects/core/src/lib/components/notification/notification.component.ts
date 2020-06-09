import { Component, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { animation } from '../../animations/animations';

// export enum RotateAnimationState {
//   initState = 'default',
//   rotate = 'rotated'
// }

@Component({
  selector: 'mdc-notification',
  templateUrl: './notification.component.html',
  animations: [
    animation.rotateRight90,
    animation.slideUpDown
  ],
})
export class NotificationComponent {
  @Output() onStateChange = new EventEmitter<boolean>();
  constructor() {

  }
}
