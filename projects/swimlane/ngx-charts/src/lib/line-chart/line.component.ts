import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ElementRef,
  ChangeDetectionStrategy,
  SimpleChanges
} from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { select } from 'd3-selection';

@Component({
  selector: 'g[ngx-charts-line]',
  template: `
    <svg:path
      [@animationState]="'active'"
      class="line"
      [attr.d]="initialPath"
      [attr.fill]="fill"
      [attr.stroke]="stroke"
      stroke-width="1.5px"
    />
    <svg:circle *ngFor="let p of points"
      [attr.cx]="p[0]" 
      [attr.cy]="p[1]" 
      r="3" 
      [attr.fill]="stroke"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('animationState', [
      transition(':enter', [
        style({
          strokeDasharray: 2000,
          strokeDashoffset: 2000
        }),
        animate(
          1000,
          style({
            strokeDashoffset: 0
          })
        )
      ])
    ])
  ]
})
export class LineComponent implements OnChanges {
  @Input() path;
  @Input() stroke;
  @Input() data;
  @Input() fill: string = 'none';
  @Input() animations: boolean = true;

  @Output() select = new EventEmitter();

  initialized: boolean = false;
  initialPath: string;

  constructor(private element: ElementRef) { }
  points: Array<[number, number]> = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) {
      this.initialized = true;
      this.initialPath = this.path;
    } else {
      this.updatePathEl();
    }
    this.initPoints();
  }

  updatePathEl(): void {
    const node = select(this.element.nativeElement).select('.line');

    if (this.animations) {
      node.transition().duration(750).attr('d', this.path);
    } else {
      node.attr('d', this.path);
    }
  }

  initPoints(): void {
    let p = this.path.replace('M', '').split('L');
    this.points = p.map(x => {
      const temp = x.split(',');
      return [parseFloat(temp[0]), parseFloat(temp[1])];
    })
  }
}
