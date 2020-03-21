import { Component, Input } from '@angular/core';

@Component({
  selector: 'mdc-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.css']
})
export class ModalWindowComponent {

  @Input() center = true;
  @Input() margin = "0 auto";
  @Input() top = '50%';
  @Input() left = '0';
  @Input() right = '0';
  @Input() position = 'fixed';
  @Input() width = '540px';
  @Input() removeScroll = true;
  @Input() topBorder = true;
  @Input() shadow = true;

  @Input('hidden')
  set isHidden(hidden: boolean) {
    this._isHidden = hidden;
    if (this.removeScroll) {
      if (!this._isHidden) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'visible';
      }
    }
  }
  get isHidden(): boolean { return this._isHidden; }

  private _isHidden = false;
}
