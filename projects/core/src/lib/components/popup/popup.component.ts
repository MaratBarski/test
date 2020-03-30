import { Component, HostListener, Input, ElementRef, Renderer2, ViewChild, Output, EventEmitter } from '@angular/core';
import { ComponentService } from '../../services/component.service';

@Component({
  selector: 'mdc-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {

  constructor(
    private renderer: Renderer2
  ) { }

  @ViewChild('container', { static: true }) container: ElementRef;
  @Input() position: 'left' | 'top' | 'right' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' = 'left';
  @Output() onClose = new EventEmitter();
  @Input() fixed = false;

  private _target: any;

  @Input() dx = 10;
  @Input() dy = 10;
  @Input() closeOnClick = false;

  @Input() zIndex = 9999;

  @Input() set target(target: any) {
    this._target = target;
  }

  @Input() set isExpanded(isExpanded: boolean) {
    if (isExpanded) {
      this.opacity = 0;
      setTimeout(() => {
        this.opacity = 1;
      }, 100);
    }
    this._isExpanded = isExpanded;
  }
  get isExpanded(): boolean { return this._isExpanded; }
  private _isExpanded = false;

  isOver = false;
  opacity = 1;

  private stopOver(): void {
    setTimeout(() => {
      this.isOver = false;
    }, 500);
  }

  show(isShow: boolean, event: any): void {
    this.isOver = true;
    this.isExpanded = isShow;
    if (event) {
      this.setPosition(event);
    }
    this.stopOver();
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    if (this.isOver) { return; }
    this.onClose.emit();
    this.isExpanded = false;
  }

  private get rect(): any { return ComponentService.getRect(this.container); }
  private get targetRect(): any { return ComponentService.getRect(this._target); }

  private setPosition(event: any): void {
    if (this.fixed) { return; }
    if (!this.isExpanded) { return; }
    setTimeout(() => {
      this.initPosition[this.position](event);
    }, 1);
  }

  private initPosition = {
    'right': (event: any) => {
      this.setOffset(event.clientX + this.dx, event.clientY - this.rect.height / 2);
    },
    'left': (event: any) => {
      this.setOffset(event.clientX - this.rect.width - this.dx, event.clientY - this.rect.height / 2);
    },
    'top': (event: any) => {
      this.setOffset(event.clientX - this.dx, event.clientY - this.rect.height - this.dy);
    },
    'bottom': (event: any) => {
      this.setOffset(event.clientX - this.dx, event.clientY + this.dy);
    },
    'top-left': (event: any) => {
      this.setOffset(event.clientX - this.rect.width - this.dx, event.clientY - this.rect.height - this.dy);
    },
    'top-right': (event: any) => {
      this.setOffset(event.clientX + this.dx, event.clientY - this.rect.height - this.dy);
    },
    'bottom-left': (event: any) => {
      if (this._target) {
        this.setOffset(this.targetRect.right - this.rect.width, this.targetRect.bottom + this.dy);
      } else {
        this.setOffset(event.clientX - this.rect.width - this.dx, event.clientY + this.dy);
      }
    },
    'bottom-right': (event: any) => {
      this.setOffset(event.clientX + this.dx, event.clientY + this.dy);
    },
  }

  private setOffset(x: number, y: number): void {
    y = Math.max(y, 0);
    x = Math.max(x, 0);
    y = Math.min(y, window.innerHeight - this.rect.height);
    x = Math.min(x, window.innerWidth - this.rect.width);
    this.renderer.setStyle(this.container.nativeElement, 'left', `${x}px`);
    this.renderer.setStyle(this.container.nativeElement, 'top', `${y + ComponentService.scrollTop()}px`);
  }

  clickPopup(event: any): void {
    if (this.closeOnClick) { return; }
    this.isOver = true;
    this.stopOver();
  }
}
