import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  get onStart(): Observable<void> { return this._onStart.asObservable(); }
  get onEnd(): Observable<void> { return this._onEnd.asObservable(); }
  get onShowElement(): Observable<any> { return this._onShowElement.asObservable(); }
  private _onShowElement = new Subject<any>();
  private _onEnd = new Subject<void>();
  private _onStart = new Subject<void>();
  private animations: Array<any> = [];
  private renderer2: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer2 = rendererFactory.createRenderer(null, null);
  }

  showElement(element: any): void {
    this._onShowElement.next(element);
  }

  stopAnimation(): void {
    this.animations.forEach(id => { clearTimeout(id) });
    this.animations = [];
  }

  emitStart(): void {
    this._onStart.next();
  }

  animateForward(elm: any, value: number, style: string, callBack: any, speed: number, currentValue = 0): void {
    if (speed <= 0) { speed = 100; }
    const id = setTimeout(() => {
      if (currentValue >= value) {
        this.renderer2.setStyle(elm, style, `${value}px`);
        if (callBack) { callBack(); }
        this._onEnd.next();
        return;
      }
      this.renderer2.setStyle(elm, style, `${currentValue}px`);
      this.animateForward(elm, value, style, callBack, speed, currentValue + speed)
    }, 10);
    this.animations.push(id);
  }

  animateBack(elm: any, value: number, style: string, speed: number, callBack: any): void {
    if (speed <= 0) { speed = 100; }
    const id = setTimeout(() => {
      if (value <= 0) {
        this.renderer2.setStyle(elm, style, '0px');
        if (callBack) { callBack(); }
        return;
      }
      this.renderer2.setStyle(elm, style, `${value}px`);
      this.animateBack(elm, value - speed, style, speed, callBack);
    }, 10);
    this.animations.push(id);
  }
}
