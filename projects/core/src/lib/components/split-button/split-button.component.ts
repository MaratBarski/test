import { Component, Input, Output, EventEmitter } from '@angular/core';

export class SplitButtonAction {
  text: string
}

@Component({
  selector: 'mdc-split-button',
  templateUrl: './split-button.component.html',
  styleUrls: ['./split-button.component.css']
})
export class SplitButtonComponent {

  @Input() text: string;
  @Input() actions: Array<SplitButtonAction>;
  @Output() mainClick = new EventEmitter();
  @Output() actionClick = new EventEmitter<SplitButtonAction>();

  isOpen = false;

  onBlur() {
    this.isOpen = false;
  }

  clickAction(action: SplitButtonAction): void {
    this.actionClick.emit(action);
    this.isOpen = false;
  }

  clickMain(): void {
    this.mainClick.emit();
  }

  clickArrow(): void {
    this.isOpen = !this.isOpen;
  }
}
