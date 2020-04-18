import { Directive, Input, ElementRef, HostListener, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { ComponentService } from '../services/component.service';

const CLASS_NAME = 'tooltipnew';

export type TooltipPosition = 'left' | 'right' | 'top' | 'bottom';

@Directive({
  selector: '[mdcTooltip]'
})
export class TooltipDirective implements OnInit, OnDestroy {

  private _text: string;
  @Input('mdcTooltip') set text(text: string) {
    this._text = text;
    if (this.tooltipElement) {
      this.tooltipElement.textContent = text;
    }
  }
  get text(): string {
    return this._text;
  }

  @Input('stickyToElement') stickyToElement = false;
  @Input() position: TooltipPosition = 'left';
  @Input('isShowTooltip') set show(show: boolean) {
    this._show = show;
  }
  private _show = true;

  private dx = 12;
  private dy = 14;
  private prevPosition: TooltipPosition = undefined;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {
    this.createTooltip();
  }

  ngOnDestroy(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(this.tooltipElement.parentNode, this.tooltipElement);
    }
  }

  private tooltipElement: any;
  private get rect(): any { return ComponentService.getRect(this.element); }
  private get tooltipRect(): any { return ComponentService.getRect(this.tooltipElement); }

  private setOffset(x: number, y: number): void {
    this.renderer.setStyle(this.tooltipElement, 'left', `${x}px`);
    this.renderer.setStyle(this.tooltipElement, 'top', `${y + ComponentService.scrollTop()}px`);
  }

  private initPosition = {
    right: (event: any) => {
      if (this.stickyToElement) {
        this.setOffset(this.rect.left + this.rect.width, this.rect.top + (this.rect.height - this.tooltipRect.height) / 2 - 4);
      } else {
        this.setOffset(event.clientX + this.dx, event.clientY - this.tooltipRect.height / 2);
      }
    },
    left: (event: any) => {
      if (this.stickyToElement) {
        this.setOffset(this.rect.left - this.tooltipRect.width - 9, this.rect.top + (this.rect.height - this.tooltipRect.height) / 2 - 4);
      } else {
        this.setOffset(event.clientX - this.tooltipRect.width - this.dx, event.clientY - this.tooltipRect.height / 2);
      }
    },
    top: (event: any) => {
      if (this.stickyToElement) {
        this.setOffset(this.rect.left + this.rect.width / 2 - 20, this.rect.top - this.tooltipRect.height - 9);
      } else {
        this.setOffset(event.clientX - this.dx, event.clientY - this.tooltipRect.height - this.dy);
      }
    },
    bottom: (event: any) => {
      if (this.stickyToElement) {
        this.setOffset(this.rect.left + this.rect.width / 2 - 20, this.rect.top + this.rect.height + 1);
      } else {
        this.setOffset(event.clientX - this.dx, event.clientY + this.dy);
      }
    }
  }

  private createTooltip(): void {
    if (this.tooltipElement) { return; }
    this.tooltipElement = this.renderer.createElement("div");
    this.renderer.addClass(this.tooltipElement, CLASS_NAME);
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'display', 'none');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '99999');
    const text = this.renderer.createText(this.text);
    this.renderer.appendChild(this.tooltipElement, text);
    //this.renderer.insertBefore(this.element.nativeElement.parentNode, this.tooltipElement, this.element.nativeElement);
    document.body.append(this.tooltipElement);
  }

  private showTooltip(): void {
    this.createTooltip();
    this.renderer.setStyle(this.tooltipElement, 'display', 'block');
  }

  private setTooltipPosition(event: any): void {
    this.renderer.addClass(this.tooltipElement, `${CLASS_NAME}_${this.position}`);
    this.initPosition[this.position.toString()](event);
  }

  private changePosition(position: TooltipPosition, event: any): void {
    this.prevPosition = this.position;
    this.renderer.removeClass(this.tooltipElement, `${CLASS_NAME}_${this.position}`);
    this.position = position;
    this.setTooltipPosition(event);
  }

  private checkTooltipPosition(event: any): void {
    switch (this.position) {
      case ('left'):
        if (this.tooltipRect.left < 0) {
          this.changePosition('right', event);
        }
        break;
      case ('right'):
        if (this.tooltipRect.left + this.tooltipRect.width > window.innerWidth) {
          this.changePosition('left', event);
        }
        break;
      case ('bottom'):
        if (this.tooltipRect.top + this.tooltipRect.height > window.innerHeight - 10) {
          this.changePosition('top', event);
        }
        break;
      default:
        break
    }
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(event: any) {
    if (!this._show) { this.hideTooltip(); return; }
    this.showTooltip();
    this.setTooltipPosition(event);
    this.checkTooltipPosition(event);
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event: any) {
    this.hideTooltip();
  }

  private hideTooltip(): void {
    this.renderer.setStyle(this.tooltipElement, 'display', 'none');
    if (this.prevPosition) {
      this.renderer.removeClass(this.tooltipElement, `${CLASS_NAME}_${this.position}`);
      this.position = this.prevPosition;
      this.prevPosition = undefined;
    }
  }

}
