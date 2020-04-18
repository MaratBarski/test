import { Component, Input, ViewChild, ElementRef, TemplateRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'md-chart-pdf',
  templateUrl: './chart-pdf.component.html',
  styleUrls: ['./chart-pdf.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartPdfComponent {

  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;
  @Input() width = '400px';
  @Input() height = '400px';
  @Input() chart: TemplateRef<any>;
  @Input() dataLabelSize = 10;

  getElement(): any {
    return this.chartContainer.nativeElement.getElementsByTagName('svg')[0];
  }
  getSvg(): any {
    const svg = this.getElement();
    const txt = Array.from(svg.getElementsByClassName('textDataLabel'));
    txt.forEach((elm: any) => {
      elm.style.fontSize = `${this.dataLabelSize}px`;
    });
    return svg.outerHTML;
  }
}
