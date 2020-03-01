import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[mdcVisibility]'
})
export class VisibilityDirective {

  @Input('mdcVisibility') set show(visible: boolean) {
    this.renderer.setStyle(this.element.nativeElement, 'visibility', visible ? 'visible' : 'hidden');
  }

  constructor(private element: ElementRef, private renderer: Renderer2) { }

}
