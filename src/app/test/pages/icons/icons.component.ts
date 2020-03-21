import { Component, OnInit, ViewChild } from '@angular/core';
import { SvgLoaderComponent } from '@app/core-api';


@Component({
  selector: 'md-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {

  backgroundColor = '#fff';
  @ViewChild('svgLoder', { static: true }) svgLoder: SvgLoaderComponent;
  constructor() { }

  ngOnInit() {
  }

}
