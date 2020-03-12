import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ComponentService } from '../../services/component.service';

@Component({
  selector: 'mdc-info-popup',
  templateUrl: './info-popup.component.html',
  styleUrls: ['./info-popup.component.css']
})
export class InfoPopupComponent implements OnInit {
  @Input() width = '250px';
  @Input() header = 'header';
  @Input() set show(show: boolean) {
    if (!show) {
      this.target = undefined;
    }
    this._show = show;
  }
  @Input() top = 0;
  @Input() left = 0;
  @Input() target: any;
  @ViewChild('popup', { static: true }) popup: ElementRef;
  get show(): boolean { return this._show; }
  private _show = false;
  private _closeTimeOutID: any;

  get visibility(): string {
    return this.show ? 'visible' : 'hidden';
  }

  get opacity(): number {
    return this.show ? 1 : 0;
  }

  constructor() { }

  mouseLeave(event: any): void {
    this.show = false;
  }

  mouseOver(event: any): void {
    this.stopClose();
    this.show = true;
  }

  stopClose(): void {
    if (this._closeTimeOutID) {
      clearTimeout(this._closeTimeOutID);
      this._closeTimeOutID = undefined;
    }
  }

  startClose(): void {
    this.stopClose();
    this._closeTimeOutID = setTimeout(() => {
      this.show = false;
    }, 1000);
  }

  display(event: any, target: any): void {
    this.stopClose();
    if (this.target === target) {
      this.show = true;
      return;
    }
    this.target = target;
    this.top = event.clientY + ComponentService.scrollTop();
    this.left = event.clientX + 20 - ComponentService.getRect(this.popup).width;
    setTimeout(() => {
      this.show = true;
      if (window.innerHeight < ComponentService.getRect(this.popup).top + ComponentService.getRect(this.popup).height) {
        this.top -= ComponentService.getRect(this.popup).height;
      }
    }, 100);
  }

  ngOnInit() {
  }

}
