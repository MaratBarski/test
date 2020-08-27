import { Component, HostListener } from '@angular/core';
import { ComponentService } from '@appcore';

@Component({
  selector: 'md-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent {

  isOpen = false;
  constructor() { }

  toogle(e: any): void {
    ComponentService.documentClick(e);
    this.isOpen = true;
  }

  @HostListener('document:click', ['$event']) onMouseClick(event: any) {
    this.isOpen = false;
  }


}
