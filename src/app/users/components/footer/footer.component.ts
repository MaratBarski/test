import { Component, Output, Input, EventEmitter, HostListener } from '@angular/core';
import { ComponentService } from '@appcore';


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

  @Input() step = 0;
  @Input() isSaveEnable = false;
  @Input() isNextEnable = false;
  @Input() btnOptions: Array<SplitBtnOption> = [{
    text: 'Save'
  }];

  isShowOptions = false;

  cancel(): void {
    this.isShowOptions = false;
    this.onCancel.emit();
  }

  next(i: number): void {
    this.isShowOptions = false;
    this.onNext.emit(i);
  }

  save(): void {
    this.isShowOptions = false;
    this.onSave.emit();
  }

  optionClick(i: number): void {
    this.onOptionClick.emit(i);
    this.isShowOptions = false;
  }

  showOptions(event: any): void {
    ComponentService.documentClick(event);
    this.isShowOptions = true;
  }


  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    this.isShowOptions = false;
  }
}
