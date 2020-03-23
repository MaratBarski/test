import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { ComponentService, BaseSibscriber } from '@app/core-api';

@Directive({
  selector: '[mdAnimationSticky]'
})
export class AnimationStickyDirective extends BaseSibscriber {

  private _position = '';
  constructor(
    private elementRef: ElementRef,
    private componentService: ComponentService,
    private renderer2: Renderer2

  ) {
    super();
    this._position = this.elementRef.nativeElement.style.position;
    super.add(this.componentService.onToggleMenu.subscribe(state => {
      setTimeout(() => {
        this.renderer2.setStyle(this.elementRef.nativeElement, 'position', this._position);
      }, 500);
    }));
    super.add(this.componentService.onStartToggleMenu.subscribe(state => {
      const rect = ComponentService.getRect(this.elementRef);
      this.renderer2.setStyle(this.elementRef.nativeElement, 'position', 'fixed');
      this.renderer2.setStyle(this.elementRef.nativeElement, 'left', `${rect.left}px`);
      this.renderer2.setStyle(this.elementRef.nativeElement, 'top', `${rect.top}px`);
    }));
  }

}
