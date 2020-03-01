import { Component, Input } from '@angular/core';

@Component({
  selector: 'mdc-modal-window',
  templateUrl: './modal-window.component.html',
  styleUrls: ['./modal-window.component.css']
})
export class ModalWindowComponent {
  @Input() 
  set isHidden(hidden: boolean) {
    this._isHidden = hidden;
    if(this._isHidden){
      
    }
  }
  get isHidden(): boolean { return this._isHidden; }
  _isHidden = false;
  constructor() { }
}
