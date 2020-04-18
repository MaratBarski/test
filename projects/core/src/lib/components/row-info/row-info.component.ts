import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, AfterContentInit, Renderer2 } from '@angular/core';


@Component({
  selector: 'mdc-row-info',
  templateUrl: './row-info.component.html',
  styleUrls: ['./row-info.component.css']
})
export class RowInfoComponent implements AfterContentInit {

  @Input() componentID: string;
  @Output() onInit = new EventEmitter<RowInfoComponent>();
  @ViewChild('container', { static: true }) container: ElementRef;

  width = 0;
  height = 0;

  constructor(private renderer2: Renderer2) { }

  ngAfterContentInit(): void {
    this.initComponent();
  }

  private initComponent(): void {
    // setTimeout(() => {
    this.width = this.container.nativeElement.offsetWidth;
    this.height = this.container.nativeElement.offsetHeight;
    this.renderer2.setStyle(this.container.nativeElement, 'width', `${this.width}px`);
    this.renderer2.setStyle(this.container.nativeElement, 'height', `${this.height}px`);
    this.renderer2.setStyle(this.container.nativeElement, 'overflow', 'hidden');
    this.onInit.emit(this);
    // }, 10);
  }

  setMargin(margin: number): void {
    this.renderer2.setStyle(this.container.nativeElement, 'margin-top', `${margin}px`);
  }

  onClick(event: any): void {
    event.stopPropagation();
  }
}
