import { Component, Output, Input, EventEmitter } from '@angular/core';

export class SplitBtnOption {
  text: string;
}

@Component({
  selector: 'md-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @Output() onNext = new EventEmitter<number>();
  @Output() onSave = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Output() onOptionClick = new EventEmitter<number>();

  @Input() isSaveEnable = false;
  @Input() isNextEnable = false;  
  @Input() btnOptions: Array<SplitBtnOption>;

  cancel(): void {
    this.onCancel.emit();
  }

  next(i: number): void {
    this.onNext.emit(i);
  }

  save(): void {
    this.onSave.emit();
  }

  optionClick(i: number): void {
    this.onOptionClick.emit(i);
  }
}
