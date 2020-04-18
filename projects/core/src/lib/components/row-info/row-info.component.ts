import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, AfterContentInit, Renderer2, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, timer } from 'rxjs';


@Component({
  selector: 'mdc-row-info',
  templateUrl: './row-info.component.html',
  styleUrls: ['./row-info.component.css'],
  animations: [
    trigger('rowInfoAnimation', [
      state('true', style({
        width: '{{width}}px',
        overflow: 'hidden'
      }), { params: { width: 1000 } }),
      state('false', style({
        width: '0px',
        overflow: 'hidden',
        opacity: 0
      })),
      transition('true => false', animate('100ms ease-out')),
      transition('false => true', animate('300ms ease-in'))
    ])
  ]
})
export class RowInfoComponent implements AfterContentInit, OnDestroy {

  @Input() componentID: string;
  @Output() onInit = new EventEmitter<RowInfoComponent>();
  @ViewChild('container', { static: true }) container: ElementRef;

  width = 0;
  height = 0;
  show = false;

  constructor(private renderer2: Renderer2) { }

  ngAfterContentInit(): void {
    this.initComponent();
  }

  private initComponent(): void {
    this.width = this.container.nativeElement.offsetWidth;
    this.height = this.container.nativeElement.offsetHeight;
    this.renderer2.setStyle(this.container.nativeElement, 'width', `${this.width}px`);
    this.renderer2.setStyle(this.container.nativeElement, 'height', `${this.height}px`);
    this.renderer2.setStyle(this.container.nativeElement, 'overflow', 'hidden');
    this.onInit.emit(this);
    this.renderer2.setStyle(this.container.nativeElement, 'width', '0px');
  }

  setMargin(margin: number, isFirstTime = true): void {
    this.renderer2.setStyle(this.container.nativeElement, 'margin-top', `${margin}px`);
    if (isFirstTime) {
      this.show = true;
    } else {
      const ts = timer(0, 1).subscribe(sec => {
        this.show = true;
        ts.unsubscribe();
      });
    }
  }

  onClick(event: any): void {
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.show = false;
  }
}
