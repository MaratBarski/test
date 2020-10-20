import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SelectOption} from '@appcore';

@Component({
  selector: 'md-irbpopup',
  templateUrl: './irbpopup.component.html',
  styleUrls: ['./irbpopup.component.scss']
})
export class IRBPopupComponent implements OnInit {
  options: SelectOption[] = [];
  irbResult = null;

  @Input() set IRB(value) {
    this.options = [];
    if (value) {
      value.forEach((item: any) => {
        this.options.push({text: item.researchName, value: item.researchId, id: item.researchId});
      });
    }
  }

  @Output() onIRBSelected: EventEmitter<number> = new EventEmitter<number>();
  @Output() onPopupClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

  submitIRB() {
    if (this.irbResult) {
      this.onIRBSelected.emit(this.irbResult);
    }
  }

  closePopup() {
    this.onPopupClose.emit(true);
  }

}
