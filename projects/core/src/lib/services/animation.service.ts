import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  private animations: Array<any> = [];
  private renderer2: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer2 = rendererFactory.createRenderer(null, null);
  }

  stopAnimation(): void {
    this.animations.forEach(id => { clearTimeout(id) });
    this.animations = [];
  }

  animate(elm: any, width: number, callBack: any, speed: number, currentWidth = 0): void {
    if (speed <= 0) { speed = 100; }
    const id = setTimeout(() => {
      if (currentWidth >= width) {
        this.renderer2.setStyle(elm, 'width', `${width}px`);
        if (callBack) { callBack(); }
        return;
      }
      this.renderer2.setStyle(elm, 'width', `${currentWidth}px`);
      this.animate(elm, width, callBack, speed, currentWidth + speed)
    }, 10);
    this.animations.push(id);
  }

  animateBack(elm: any, width: number, speed: number, callBack: any): void {
    if (speed <= 0) { speed = 100; }
    const id = setTimeout(() => {
      if (width <= 0) {
        this.renderer2.setStyle(elm, 'width', '0px');
        if (callBack) { callBack(); }
        return;
      }
      this.renderer2.setStyle(elm, 'width', `${width}px`);
      this.animateBack(elm, width - speed, speed, callBack);
    }, 10);
    this.animations.push(id);
  }
}
