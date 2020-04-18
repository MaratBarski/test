import {Component, ViewChild, ElementRef, AfterViewInit, HostListener} from '@angular/core';
import {ComponentService, TranslateService, BaseSibscriber, animation, NavigationService} from '@appcore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    animation.openClose
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public componentService: ComponentService) {
  }
}
