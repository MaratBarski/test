import { Component, ContentChild, TemplateRef, Input, EventEmitter, Output } from '@angular/core';

export class SwitchButtonModel {
  disable: boolean;
  icon: string;
}

@Component({
  selector: 'mdc-switch-button',
  templateUrl: './switch-button.component.html',
  styleUrls: ['./switch-button.component.css']
})
export class SwitchButtonComponent {
  @Input() buttons: Array<SwitchButtonModel>;
  @ContentChild(TemplateRef, { read: TemplateRef, static: true }) template: TemplateRef<any>;
  @Output() onClick = new EventEmitter<number>();
  @Input() activeIndex = 0;

  btnClick(button: SwitchButtonModel, index: number): void {
    if (button.disable) { return; }
    if (this.activeIndex === index) { return; }
    this.activeIndex = index;
    this.onClick.emit(index);
  }


}
