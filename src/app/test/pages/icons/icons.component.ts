import { Component, ViewChild } from '@angular/core';
import { SvgLoaderComponent } from '@app/core-api';


@Component({
  selector: 'md-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent {
  color = '#000';
  @ViewChild('svgLoder', { static: true }) svgLoder: SvgLoaderComponent;
  size = 20;

  completeSearch(txt:string):void{
    alert(txt)
  }
}
