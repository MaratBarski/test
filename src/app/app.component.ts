import {Component, ViewChild, ElementRef, AfterViewInit, HostListener} from '@angular/core';
import {ComponentService, TranslateService, BaseSibscriber, animation, NavigationService} from './core-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    animation.openClose
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseSibscriber implements AfterViewInit {
  @ViewChild('appMenu', {static: true}) appMenu: ElementRef;
  @ViewChild('firstTd', {static: true}) firstTd: ElementRef;
  sideBarOpened: boolean = false;

  constructor(public componentService: ComponentService) {
    super();
    this.componentService.onSideBarToggle.subscribe((res) => {
      this.sideBarOpened = res;
    });
  }

  ngAfterViewInit(): void {

  }
}
