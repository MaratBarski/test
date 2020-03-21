import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

export interface IconModel {
  path: string;
}

@Component({
  selector: 'mdc-svg-loader',
  templateUrl: './svg-loader.component.html',
  styleUrls: ['./svg-loader.component.css']
})
export class SvgLoaderComponent implements AfterViewInit {

  @ViewChild('main', { static: true }) main: ElementRef;

  private _icons: Array<IconModel>;
  get icons(): Array<IconModel> {
    if (!this._icons) {
      this._icons = [];
      const nodes = this.main.nativeElement.childNodes;
      nodes.forEach(element => {
        this._icons.push({
          path: element.id
        })
      });
    }
    return this._icons;
  }

  ngAfterViewInit(): void {
  }

}
