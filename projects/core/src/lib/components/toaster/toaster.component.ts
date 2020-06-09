import {Component, Input, EventEmitter, Output, forwardRef} from '@angular/core';
import {animation} from '../../animations/animations';

export enum ToasterType {
  info,
  error,
  warning,
  success,
  infoProgressBar
}

@Component({
  selector: 'mdc-toaster',
  templateUrl: './toaster.component.html',
  animations: [
    animation.rotateRight90,
    animation.slideUpDown
  ],
})
export class ToasterComponent {
  // it is id of notification in array;
  @Input() id: string;
  @Input() type: ToasterType = ToasterType.info;
  @Input() title = '';
  @Input() text = '';

  // emitting close event with id of toaster for searching in array of toasters;
  @Output() onToasterClose: EventEmitter<string> = new EventEmitter<string>();
  // for progress toaster only
  @Input() fileName = '';
  @Input() percentage = 0;
  @Output() onAbort: EventEmitter<string> = new EventEmitter<string>();
  toasterType = ToasterType;

  constructor() {
    this.testIncreasePercentage();
  }

  testIncreasePercentage(){
    setTimeout(() => {
      if (this.percentage <= 100) {
        this.percentage += 1;
        this.testIncreasePercentage();
      }
    }, 100);
  }

  onCloseClicked(): void {
    console.log('');
    this.onToasterClose.emit(this.id);
  }

  onAbortClicked(): void {
    console.log('abort');
    this.onAbort.emit('');
  }
}
