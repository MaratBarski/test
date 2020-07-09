import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mdc-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  @Input() className = 'btn_icon';
  @Input() disabled = false;
  @Input() text: string;
  @Output() clicked = new EventEmitter<void>();

  click(): void {
    this.clicked.emit();
  }
}
